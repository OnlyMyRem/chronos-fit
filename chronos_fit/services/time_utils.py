"""Beijing-time helpers.

The app is pinned to Asia/Shanghai. A fixed UTC+8 offset is used rather than
``zoneinfo`` because China has observed no DST since 1991, so the offset is exact
and the runtime needs no tz database (handy inside a slim container).
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

BEIJING_TZ = timezone(timedelta(hours=8))

DATE_FMT = "%Y-%m-%d"


def now_bj() -> datetime:
    return datetime.now(BEIJING_TZ)


def now_iso() -> str:
    """Timestamp as stored in the database — keeps the +08:00 offset."""
    return now_bj().isoformat()


def today_bj() -> str:
    return now_bj().strftime(DATE_FMT)


def weekday_en() -> str:
    """English weekday name, the locale-independent key for plan bindings."""
    return now_bj().strftime("%A")


def cutoff_date(days: int) -> str:
    return (now_bj() - timedelta(days=days)).strftime(DATE_FMT)


def parse_stored(value: str | None) -> datetime | None:
    """Read a stored ISO timestamp; malformed legacy rows degrade to None.

    Naive values (written before the offset was stored) are assumed to be Beijing
    time so callers can always compare against ``now_bj()``.
    """
    if not value:
        return None
    try:
        parsed = datetime.fromisoformat(value)
    except ValueError:
        return None
    return parsed.replace(tzinfo=BEIJING_TZ) if parsed.tzinfo is None else parsed
