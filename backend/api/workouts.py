"""Workout check-ins and inline custom items."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import delete, select

from .. import db
from ..models import CustomItem, WorkoutLog
from ..services.time_utils import now_iso
from .deps import (
    CurrentUid,
    CustomItemPayload,
    CustomTogglePayload,
    DbSession,
    TogglePayload,
)

router = APIRouter(tags=["workouts"])


def _int(value: bool) -> int:
    return 1 if value else 0


@router.get("/api/logs")
def get_logs(session: DbSession, uid: CurrentUid, log_date: str = Query(...)):
    rows = session.scalars(
        select(WorkoutLog).where(WorkoutLog.user_id == uid, WorkoutLog.log_date == log_date)
    ).all()
    return [
        {
            "schedule_type": r.schedule_type,
            "item_name": r.item_name,
            "is_completed": r.is_completed,
        }
        for r in rows
    ]


@router.post("/api/toggle")
def toggle_item(payload: TogglePayload, session: DbSession, uid: CurrentUid):
    is_completed = _int(payload.is_completed)
    db.upsert(
        session,
        WorkoutLog,
        key={"user_id": uid, "log_date": payload.log_date, "item_name": payload.item_name},
        insert={
            "schedule_type": payload.schedule_type,
            "is_completed": is_completed,
        },
    )
    return {
        "ok": True,
        "log_date": payload.log_date,
        "item_name": payload.item_name,
        "is_completed": is_completed,
    }


@router.get("/api/custom/logs")
def custom_logs(session: DbSession, uid: CurrentUid, log_date: str = Query(...)):
    rows = session.scalars(
        select(CustomItem)
        .where(CustomItem.user_id == uid, CustomItem.log_date == log_date)
        .order_by(CustomItem.id)
    ).all()
    return [
        {
            "item_name": r.item_name,
            "is_completed": r.is_completed,
            "target_value": r.target_value,
            "current_value": r.current_value,
            "target_unit": r.target_unit,
        }
        for r in rows
    ]


@router.post("/api/custom/add")
def custom_add(payload: CustomItemPayload, session: DbSession, uid: CurrentUid):
    item_name = payload.item_name.strip()
    if not item_name:
        raise HTTPException(400, "Item name cannot be empty")
    db.upsert(
        session,
        CustomItem,
        key={"user_id": uid, "log_date": payload.log_date, "item_name": item_name},
        insert={
            "target_value": payload.target_value,
            "target_unit": payload.target_unit,
            "created_at": now_iso(),
        },
        update={},
    )
    return {"ok": True, "log_date": payload.log_date, "item_name": item_name}


@router.post("/api/custom/toggle")
def custom_toggle(payload: CustomTogglePayload, session: DbSession, uid: CurrentUid):
    is_completed = _int(payload.is_completed)
    row = session.scalar(
        select(CustomItem).where(
            CustomItem.user_id == uid,
            CustomItem.log_date == payload.log_date,
            CustomItem.item_name == payload.item_name,
        )
    )
    if row is not None:
        row.is_completed = is_completed
        if payload.current_value is not None:
            row.current_value = payload.current_value
    return {"ok": True, "item_name": payload.item_name, "is_completed": is_completed}


@router.delete("/api/custom")
def custom_delete(
    session: DbSession,
    uid: CurrentUid,
    log_date: str = Query(...),
    item_name: str = Query(...),
):
    session.execute(
        delete(CustomItem).where(
            CustomItem.user_id == uid,
            CustomItem.log_date == log_date,
            CustomItem.item_name == item_name,
        )
    )
    return {"ok": True, "log_date": log_date, "item_name": item_name}
