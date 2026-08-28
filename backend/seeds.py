"""Defaults — workout plans, ticker chips, interval timers: the literals *and* the code
that persists them live together here, so there is exactly one place to edit.

Plan and chip seeding is idempotent per name and only ever touches ``user_id = 0``
(system) rows. The previous implementation seeded only when a table was completely
empty, so a single user-created plan permanently suppressed the whole system set.
"""

from __future__ import annotations

import json

from sqlalchemy import select, update
from sqlalchemy.orm import Session

from .models import ANONYMOUS_UID, Metronome, Plan, TickerItem, WorkoutLog
from .services.time_utils import now_iso

VALID_WEEKDAYS = {
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
}

# English weekday names are the locale-independent binding key the frontend matches on.
# The weekday lives in ``weekday`` only — plan names stay clean so the card header
# does not repeat the day it is bound to.
DEFAULT_PLANS: dict[str, dict] = {
    "Upper Body Power": {
        "weekday": "Tuesday",
        "items": [
            "4 sets of Pull-ups (max)",
            "4 sets of Push-ups",
            "AB roller (3x20)",
            "40 min Run",
        ],
    },
    "Lower Body & Core": {
        "weekday": "Thursday",
        "items": [
            "4 sets of 25 Squats (100 total)",
            "AB roller (5x20)",
            "40 min Run",
        ],
    },
    "Full Body Burn": {
        "weekday": "Saturday",
        "items": [
            "3 sets of Pull-ups",
            "3 sets of Push-ups",
            "50 Squats",
            "40 min Run",
        ],
    },
    "Endurance & Core": {
        "weekday": "Sunday",
        "items": [
            "2 sets of Pull-ups",
            "AB roller (5x30)",
            "40 min Run (Try a slower pace)",
        ],
    },
}

# Names seeded before the weekday moved into its own column.
LEGACY_PLAN_NAMES = {
    "Tuesday - Upper Body Power": "Upper Body Power",
    "Thursday - Lower Body & Core": "Lower Body & Core",
    "Saturday - Full Body Burn": "Full Body Burn",
    "Sunday - Endurance & Core": "Endurance & Core",
}

DEFAULT_TICKER_ITEMS: list[dict] = [
    {"label": "跑步 5km", "target_value": 5, "target_unit": "km"},
    {"label": "跑步 10km", "target_value": 10, "target_unit": "km"},
    {"label": "俯卧撑 20", "target_value": 20, "target_unit": "个"},
    {"label": "仰卧起坐 30", "target_value": 30, "target_unit": "个"},
    {"label": "深蹲 25", "target_value": 25, "target_unit": "个"},
    {"label": "平板支撑 60秒", "target_value": 60, "target_unit": "秒"},
    {"label": "引体向上 10", "target_value": 10, "target_unit": "个"},
    {"label": "跳绳 500", "target_value": 500, "target_unit": "个"},
]

# Handed to a user once, into their own rows, so editing or deleting sticks.
DEFAULT_METRONOMES: list[dict] = [
    {"duration_sec": 120, "sound_key": "chime"},
    {"duration_sec": 300, "sound_key": "chime"},
]


def seed_metronomes_for(session: Session, user_id: int) -> None:
    for spec in DEFAULT_METRONOMES:
        session.add(
            Metronome(
                user_id=user_id,
                label="",
                duration_sec=int(spec["duration_sec"]),
                sound_key=spec["sound_key"],
                enabled=1,
            )
        )
    session.flush()


def _rename_legacy_plans(session: Session) -> None:
    """Migrate pre-rename plan rows in place instead of seeding a duplicate next to them."""
    existing = {row.plan_name for row in session.scalars(select(Plan))}
    for legacy, name in LEGACY_PLAN_NAMES.items():
        if legacy not in existing or name in existing:
            continue
        session.execute(update(Plan).where(Plan.plan_name == legacy).values(plan_name=name))
        session.execute(
            update(WorkoutLog).where(WorkoutLog.schedule_type == legacy).values(schedule_type=name)
        )


def seed_defaults(session: Session) -> None:
    _rename_legacy_plans(session)
    system_plans = {
        row.plan_name
        for row in session.scalars(select(Plan).where(Plan.user_id == ANONYMOUS_UID))
    }
    for name, spec in DEFAULT_PLANS.items():
        if name in system_plans:
            # Backfill the weekday binding on rows seeded before bindings existed.
            unbound = session.scalar(
                select(Plan).where(
                    Plan.user_id == ANONYMOUS_UID,
                    Plan.plan_name == name,
                    Plan.weekday.is_(None),
                )
            )
            if unbound is not None and spec.get("weekday"):
                unbound.weekday = spec["weekday"]
            continue
        session.add(
            Plan(
                plan_name=name,
                user_id=ANONYMOUS_UID,
                items=json.dumps(spec["items"], ensure_ascii=False),
                updated_at=now_iso(),
                weekday=spec.get("weekday"),
            )
        )

    system_labels = {
        row.label
        for row in session.scalars(select(TickerItem).where(TickerItem.is_system == 1))
    }
    for item in DEFAULT_TICKER_ITEMS:
        if item["label"] in system_labels:
            continue
        session.add(
            TickerItem(
                user_id=ANONYMOUS_UID,
                label=item["label"],
                target_value=float(item["target_value"]),
                target_unit=item["target_unit"],
                is_system=1,
            )
        )
    session.flush()
