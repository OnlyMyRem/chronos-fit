"""Three-meal logging (breakfast / lunch / dinner)."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import delete, desc, func, select

from .. import db
from ..models import MEAL_KEYS, MealDismissal, MealItem
from ..services.time_utils import now_iso
from .deps import CurrentUid, DbSession, MealItemPayload, MealTogglePayload

router = APIRouter(prefix="/api/meals", tags=["meals"])


@router.get("/recent")
def meals_recent(session: DbSession, uid: CurrentUid, limit: int = Query(default=3)):
    """The items this user logs most often, per meal: the columns' default rows.
    被 ✕ 屏蔽过的名字不再出现；屏蔽在重新录入该条目时自动解除。"""
    limit = max(1, min(limit, 10))
    out: dict[str, list[str]] = {}
    for meal in MEAL_KEYS:
        dismissed = set(
            session.scalars(
                select(MealDismissal.item_name).where(
                    MealDismissal.user_id == uid, MealDismissal.meal == meal
                )
            )
        )
        rows = session.execute(
            select(
                MealItem.item_name,
                func.count(MealItem.id).label("uses"),
                func.max(MealItem.id).label("last_id"),
            )
            .where(MealItem.user_id == uid, MealItem.meal == meal)
            .group_by(MealItem.item_name)
            .order_by(desc("uses"), desc("last_id"))
        ).all()
        out[meal] = [r.item_name for r in rows if r.item_name not in dismissed][:limit]
    return out


@router.get("/logs")
def meals_logs(session: DbSession, uid: CurrentUid, log_date: str = Query(...)):
    rows = session.scalars(
        select(MealItem)
        .where(MealItem.user_id == uid, MealItem.log_date == log_date)
        .order_by(MealItem.id)
    ).all()
    return [
        {"meal": r.meal, "item_name": r.item_name, "is_completed": r.is_completed}
        for r in rows
    ]


@router.post("/add")
def meals_add(payload: MealItemPayload, session: DbSession, uid: CurrentUid):
    item_name = payload.item_name.strip()
    if not item_name:
        raise HTTPException(400, "Item name cannot be empty")
    db.upsert(
        session,
        MealItem,
        key={
            "user_id": uid,
            "log_date": payload.log_date,
            "meal": payload.meal,
            "item_name": item_name,
        },
        insert={"created_at": now_iso()},
        update={},
    )
    # 重新录入 = 想要它回到推荐里，屏蔽自动解除。
    session.execute(
        delete(MealDismissal).where(
            MealDismissal.user_id == uid,
            MealDismissal.meal == payload.meal,
            MealDismissal.item_name == item_name,
        )
    )
    return {"ok": True, "log_date": payload.log_date, "meal": payload.meal,
            "item_name": item_name}


@router.post("/toggle")
def meals_toggle(payload: MealTogglePayload, session: DbSession, uid: CurrentUid):
    is_completed = 1 if payload.is_completed else 0
    rows = session.scalars(
        select(MealItem).where(
            MealItem.user_id == uid,
            MealItem.log_date == payload.log_date,
            MealItem.meal == payload.meal,
            MealItem.item_name == payload.item_name,
        )
    ).all()
    for row in rows:
        row.is_completed = is_completed
    return {"ok": True, "item_name": payload.item_name, "is_completed": is_completed}


@router.delete("")
def meals_delete(
    session: DbSession,
    uid: CurrentUid,
    log_date: str = Query(...),
    meal: str = Query(...),
    item_name: str = Query(...),
):
    session.execute(
        delete(MealItem).where(
            MealItem.user_id == uid,
            MealItem.log_date == log_date,
            MealItem.meal == meal,
            MealItem.item_name == item_name,
        )
    )
    return {"ok": True, "log_date": log_date, "meal": meal, "item_name": item_name}


@router.delete("/suggestion")
def meals_dismiss_suggestion(
    session: DbSession,
    uid: CurrentUid,
    meal: str = Query(...),
    item_name: str = Query(...),
):
    """推荐条目的 ✕：只是「不再推荐这个名字」，历史打卡记录一个字都不动。
    想找回就在输入行重新录入该条目，屏蔽随之解除。"""
    db.upsert(
        session,
        MealDismissal,
        key={"user_id": uid, "meal": meal, "item_name": item_name},
        insert={"created_at": now_iso()},
        update={},
    )
    return {"ok": True, "meal": meal, "item_name": item_name}
