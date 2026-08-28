"""Body composition logging (weight / body fat) and its history series."""

from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import delete, select

from .. import db
from ..models import BodyLog
from ..services.time_utils import cutoff_date, now_iso
from .deps import BodyPayload, CurrentUid, DbSession

router = APIRouter(prefix="/api/body", tags=["body"])

WEIGHT_RANGE = (20.0, 400.0)
BODY_FAT_RANGE = (1.0, 70.0)


def _parse_log_date(value: str) -> str:
    try:
        return datetime.strptime(value.strip(), "%Y-%m-%d").strftime("%Y-%m-%d")
    except ValueError:
        raise HTTPException(400, "日期格式应为 YYYY-MM-DD")


def _check_range(value: float | None, bounds: tuple[float, float], label: str) -> float | None:
    if value is None:
        return None
    lo, hi = bounds
    if not lo <= float(value) <= hi:
        raise HTTPException(400, f"{label}需在 {lo}–{hi} 之间")
    return round(float(value), 2)


@router.get("/history")
def body_history(session: DbSession, uid: CurrentUid, days: int = Query(0, ge=0, le=3650)):
    rows = session.scalars(
        select(BodyLog).where(BodyLog.user_id == uid).order_by(BodyLog.log_date)
    ).all()
    items = [{"log_date": r.log_date, "weight": r.weight, "body_fat": r.body_fat} for r in rows]
    if days > 0:
        cutoff = cutoff_date(days)
        items = [i for i in items if i["log_date"] >= cutoff]
    return items


@router.post("")
def body_upsert(payload: BodyPayload, session: DbSession, uid: CurrentUid):
    log_date = _parse_log_date(payload.log_date)
    weight = _check_range(payload.weight, WEIGHT_RANGE, "体重(kg)")
    body_fat = _check_range(payload.body_fat, BODY_FAT_RANGE, "体脂(%)")
    if weight is None and body_fat is None:
        raise HTTPException(400, "请至少填写体重或体脂")

    values = {"weight": weight, "body_fat": body_fat}
    updated_at = now_iso()
    row = db.upsert(
        session,
        BodyLog,
        key={"user_id": uid, "log_date": log_date},
        insert=values | {"updated_at": updated_at},
        # Keeps the old COALESCE(excluded.x, body_logs.x) rule: an omitted field
        # never wipes a previously stored measurement.
        update={key: value for key, value in values.items() if value is not None}
        | {"updated_at": updated_at},
    )
    return {"ok": True, "log_date": log_date, "weight": row.weight, "body_fat": row.body_fat}


@router.delete("")
def body_delete(session: DbSession, uid: CurrentUid, log_date: str = Query(...)):
    normalized = log_date.strip()
    session.execute(
        delete(BodyLog).where(BodyLog.user_id == uid, BodyLog.log_date == normalized)
    )
    return {"ok": True, "log_date": normalized}
