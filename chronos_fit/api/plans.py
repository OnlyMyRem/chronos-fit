"""Workout plans: the merged system/user view plus create and delete."""

from __future__ import annotations

import json
import re

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from .. import db
from ..models import ANONYMOUS_UID, Plan, WorkoutCycle
from ..seeds import DEFAULT_PLANS, VALID_WEEKDAYS
from ..services.time_utils import now_iso, today_bj, weekday_en
from .deps import CurrentUid, CyclePayload, DbSession, PlanPayload

router = APIRouter(prefix="/api/plans", tags=["plans"])

DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def _rows(session: Session, user_id: int) -> list[Plan]:
    return list(
        session.scalars(select(Plan).where(Plan.user_id == user_id).order_by(Plan.id)).all()
    )


def _entry(plan: Plan) -> dict:
    return {"items": json.loads(plan.items), "weekday": plan.weekday}


def load_plans_data(session: Session, user_id: int) -> tuple[dict, dict]:
    """Merge system plans with this user's own.

    A user row shadows the same-named system row. For the weekday binding the
    user's row wins outright — the old last-wins dict allowed a system plan to
    steal a binding the user had just changed.
    """
    own = _rows(session, user_id)
    merged = {p.plan_name: _entry(p) for p in own}
    if user_id != ANONYMOUS_UID:
        for system_plan in _rows(session, ANONYMOUS_UID):
            merged.setdefault(system_plan.plan_name, _entry(system_plan))

    plans = {name: value["items"] for name, value in merged.items()}

    weekday_plan: dict[str, str] = {}
    own_names = {p.plan_name for p in own}
    for name, value in merged.items():
        if value["weekday"] and name not in own_names:
            weekday_plan[value["weekday"]] = name
    for plan in own:
        if plan.weekday:
            weekday_plan[plan.weekday] = plan.plan_name
    return plans, weekday_plan


def _cycle_for(session: Session, uid: int) -> dict | None:
    """当前用户的滚动周期配置；未启用（游客或无记录）返回 None。"""
    if uid == ANONYMOUS_UID:
        return None
    row = session.scalar(select(WorkoutCycle).where(WorkoutCycle.user_id == uid))
    if row is None:
        return None
    names = json.loads(row.plan_names)
    plans, _ = load_plans_data(session, uid)
    names = [n for n in names if n in plans]
    if not names:
        return None
    return {
        "anchor_date": row.anchor_date,
        "train_days": row.train_days,
        "rest_days": row.rest_days,
        "plan_names": names,
    }


@router.get("")
def get_plans(session: DbSession, uid: CurrentUid):
    plans, weekday_plan = load_plans_data(session, uid)
    return {
        "plans": plans,
        "weekday_plan": weekday_plan,
        "cycle": _cycle_for(session, uid),
        "default_plans": {name: spec["items"] for name, spec in DEFAULT_PLANS.items()},
        "today": today_bj(),
        "weekday": weekday_en(),
    }


@router.post("")
def save_plan(payload: PlanPayload, session: DbSession, uid: CurrentUid):
    if not uid:
        raise HTTPException(401, "请先登录")
    name = payload.name.strip()
    if not name:
        raise HTTPException(400, "计划名称不能为空")
    items = [i.strip() for i in payload.items if i.strip()]
    weekday = payload.weekday.strip() if payload.weekday else None
    if weekday not in VALID_WEEKDAYS:
        weekday = None
    db.upsert(
        session,
        Plan,
        key={"plan_name": name, "user_id": uid},
        insert={
            "items": json.dumps(items, ensure_ascii=False),
            "updated_at": now_iso(),
            "weekday": weekday,
        },
    )
    return {"ok": True, "name": name}


@router.delete("")
def delete_plan(session: DbSession, uid: CurrentUid, name: str = Query(...)):
    if not uid:
        raise HTTPException(401, "请先登录")
    result = session.execute(
        delete(Plan).where(Plan.plan_name == name, Plan.user_id == uid)
    )
    if result.rowcount == 0:
        raise HTTPException(404, "Plan not found")
    return {"ok": True, "name": name}


@router.post("/cycle")
def save_cycle(payload: CyclePayload, session: DbSession, uid: CurrentUid):
    """保存练 N 休 M 的滚动周期。锚点日默认今天：第 1 天即第 1 个训练日。
    计划名单做去重和存在性过滤，全部失效视为参数错误——空轮换没有意义。"""
    if not uid:
        raise HTTPException(401, "请先登录")
    train, rest = payload.train_days, payload.rest_days
    if not (1 <= train <= 7) or not (0 <= rest <= 6):
        raise HTTPException(400, "训练天数需在 1-7，休息天数需在 0-6")
    anchor = payload.anchor_date or today_bj()
    if not DATE_PATTERN.match(anchor):
        raise HTTPException(400, "起始日需为 YYYY-MM-DD 格式")
    seen: list[str] = []
    for name in payload.plan_names:
        if name and name not in seen:
            seen.append(name)
    plans, _ = load_plans_data(session, uid)
    seen = [n for n in seen if n in plans]
    if not seen:
        raise HTTPException(400, "至少选择一个参与轮换的计划")
    db.upsert(
        session,
        WorkoutCycle,
        key={"user_id": uid},
        insert={
            "anchor_date": anchor,
            "train_days": train,
            "rest_days": rest,
            "plan_names": json.dumps(seen, ensure_ascii=False),
            "updated_at": now_iso(),
        },
        update={
            "anchor_date": anchor,
            "train_days": train,
            "rest_days": rest,
            "plan_names": json.dumps(seen, ensure_ascii=False),
            "updated_at": now_iso(),
        },
    )
    return {"ok": True}


@router.delete("/cycle")
def delete_cycle(session: DbSession, uid: CurrentUid):
    if not uid:
        raise HTTPException(401, "请先登录")
    session.execute(delete(WorkoutCycle).where(WorkoutCycle.user_id == uid))
    return {"ok": True}
