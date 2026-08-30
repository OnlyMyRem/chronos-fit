"""Interval timers: the countdown capsules on the right of the page.

Anonymous visitors get the defaults straight from the seed list (read-only), so the
capsules tick without an account. Signed-in users get the defaults copied into their
own rows on the first request — guarded by ``users.metronomes_seeded`` — which is what
makes an edit or a delete stick instead of being re-seeded on the next visit.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import delete, select

from ..models import Metronome, User
from ..seeds import DEFAULT_METRONOMES, seed_metronomes_for
from .deps import CurrentUid, DbSession, MetronomePayload, MetronomeUpdatePayload

router = APIRouter(prefix="/api/metronomes", tags=["metronomes"])

MIN_DURATION_SEC = 1
MAX_DURATION_SEC = 3600
MAX_LABEL_CHARS = 40


def _entry(metronome: Metronome) -> dict:
    return {
        "id": metronome.id,
        "label": metronome.label,
        "duration_sec": metronome.duration_sec,
        "sound_key": metronome.sound_key,
        "enabled": metronome.enabled,
    }


def _checked_duration(value: int) -> int:
    if not MIN_DURATION_SEC <= value <= MAX_DURATION_SEC:
        raise HTTPException(400, f"计时时长需在 {MIN_DURATION_SEC}–{MAX_DURATION_SEC} 秒之间")
    return value


def _require_uid(uid: int) -> int:
    if not uid:
        raise HTTPException(401, "请先登录")
    return uid


@router.get("")
def list_metronomes(session: DbSession, uid: CurrentUid):
    if not uid:
        return [
            {
                "id": 0,
                "label": "",
                "duration_sec": int(spec["duration_sec"]),
                "sound_key": spec["sound_key"],
                "enabled": 1,
            }
            for spec in DEFAULT_METRONOMES
        ]

    rows = list(
        session.scalars(
            select(Metronome).where(Metronome.user_id == uid).order_by(Metronome.id)
        )
    )
    if not rows:
        user = session.get(User, uid)
        if user is not None and not user.metronomes_seeded:
            seed_metronomes_for(session, uid)
            user.metronomes_seeded = 1
            rows = list(
                session.scalars(
                    select(Metronome).where(Metronome.user_id == uid).order_by(Metronome.id)
                )
            )
    return [_entry(m) for m in rows]


@router.post("")
def create_metronome(payload: MetronomePayload, session: DbSession, uid: CurrentUid):
    _require_uid(uid)
    metronome = Metronome(
        user_id=uid,
        label=payload.label.strip()[:MAX_LABEL_CHARS],
        duration_sec=_checked_duration(payload.duration_sec),
        sound_key=payload.sound_key.strip()[:16] or "chime",
        enabled=1 if payload.enabled else 0,
    )
    session.add(metronome)
    session.flush()
    return _entry(metronome)


@router.put("")
def update_metronome(payload: MetronomeUpdatePayload, session: DbSession, uid: CurrentUid):
    _require_uid(uid)
    metronome = session.scalar(
        select(Metronome).where(Metronome.id == payload.id, Metronome.user_id == uid)
    )
    if metronome is None:
        raise HTTPException(404, "计时器不存在")

    if payload.duration_sec is not None:
        metronome.duration_sec = _checked_duration(payload.duration_sec)
    if payload.label is not None:
        metronome.label = payload.label.strip()[:MAX_LABEL_CHARS]
    if payload.sound_key is not None:
        metronome.sound_key = payload.sound_key.strip()[:16] or metronome.sound_key
    if payload.enabled is not None:
        metronome.enabled = 1 if payload.enabled else 0
    session.flush()
    return _entry(metronome)


@router.delete("")
def delete_metronome(session: DbSession, uid: CurrentUid, metronome_id: int = Query(...)):
    _require_uid(uid)
    result = session.execute(
        delete(Metronome).where(Metronome.id == metronome_id, Metronome.user_id == uid)
    )
    if result.rowcount == 0:
        raise HTTPException(404, "计时器不存在")
    return {"ok": True, "id": metronome_id}
