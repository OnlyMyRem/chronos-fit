"""Exercise chips ("气泡词条") shown inside the plan editor.

The factory set is shared (``is_system = 1``) and shown to everybody until they
clear it; ``users.ticker_cleared`` is what keeps it away after that, so a page
reload does not resurrect chips the user deliberately removed.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session

from ..models import TickerItem, User
from .deps import CurrentUid, DbSession, TickerPayload, TickerResetPayload

router = APIRouter(prefix="/api/ticker", tags=["ticker"])

RESET_MODES = {"clear", "defaults"}


def _entry(row: TickerItem) -> dict:
    return {
        "id": row.id,
        "label": row.label,
        "target_value": row.target_value,
        "target_unit": row.target_unit,
        "is_system": row.is_system,
    }


def _factory_hidden(session: Session, uid: int) -> bool:
    if not uid:
        return False
    return bool(session.scalar(select(User.ticker_cleared).where(User.id == uid)))


def load_ticker_items(session: Session, uid: int) -> list[dict]:
    """This user's own chips, plus the factory set unless they cleared it."""
    stmt = select(TickerItem)
    if _factory_hidden(session, uid):
        stmt = stmt.where(TickerItem.user_id == uid)
    else:
        stmt = stmt.where((TickerItem.is_system == 1) | (TickerItem.user_id == uid))
    rows = session.scalars(stmt.order_by(TickerItem.is_system.desc(), TickerItem.id)).all()
    return [_entry(row) for row in rows]


@router.get("")
def get_ticker(session: DbSession, uid: CurrentUid):
    return load_ticker_items(session, uid)


@router.post("/reset")
def reset_ticker(payload: TickerResetPayload, session: DbSession, uid: CurrentUid):
    """``clear`` empties the strip, ``defaults`` restores the factory chips."""
    if not uid:
        raise HTTPException(401, "请先登录")
    if payload.mode not in RESET_MODES:
        raise HTTPException(400, "mode 仅支持 clear 或 defaults")
    session.execute(
        delete(TickerItem).where(
            TickerItem.user_id == uid, TickerItem.is_system == 0
        )
    )
    session.execute(
        update(User)
        .where(User.id == uid)
        .values(ticker_cleared=1 if payload.mode == "clear" else 0)
    )
    return {"ok": True, "items": load_ticker_items(session, uid)}


@router.post("")
def add_ticker(payload: TickerPayload, session: DbSession, uid: CurrentUid):
    if not uid:
        raise HTTPException(401, "请先登录")
    label = payload.label.strip()
    if not label:
        raise HTTPException(400, "词条名称不能为空")
    session.add(
        TickerItem(
            user_id=uid,
            label=label,
            target_value=payload.target_value,
            target_unit=payload.target_unit,
            is_system=0,
        )
    )
    session.flush()
    return {"ok": True, "label": label}


@router.delete("")
def delete_ticker(
    session: DbSession,
    uid: CurrentUid,
    ticker_id: int = Query(...),
):
    session.execute(
        delete(TickerItem).where(
            TickerItem.id == ticker_id,
            TickerItem.user_id == uid,
            TickerItem.is_system == 0,
        )
    )
    return {"ok": True}
