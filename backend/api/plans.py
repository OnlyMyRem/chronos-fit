"""Workout plans: the merged system/user view plus create and delete."""

from __future__ import annotations

import json

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from .. import db
from ..models import ANONYMOUS_UID, Plan
from ..seeds import DEFAULT_PLANS, VALID_WEEKDAYS
from ..services.time_utils import now_iso, today_bj, weekday_en
from .deps import CurrentUid, DbSession, PlanPayload

router = APIRouter(prefix="/api/plans", tags=["plans"])


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


@router.get("")
def get_plans(session: DbSession, uid: CurrentUid):
    plans, weekday_plan = load_plans_data(session, uid)
    return {
        "plans": plans,
        "weekday_plan": weekday_plan,
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
