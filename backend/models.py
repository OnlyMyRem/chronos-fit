"""Database schema — every table definition lives here (SQLAlchemy 2.0 declarative).

Dialect notes, in one place:
  * Timestamps are stored as ISO strings carrying the +08:00 offset, exactly as the
    original sqlite3 schema did, so an existing workout.db stays byte-compatible and
    every comparison keeps working on MySQL too.
  * Uniqueness is expressed with UniqueConstraint (part of CREATE TABLE) rather than
    column-level unique=True, because SQLite materialises those as unnamed
    sqlite_autoindex_* entries that a model-driven migration cannot address.
  * MySQL has no partial indexes, so users.email is plain UNIQUE and the application
    stores NULL (never an empty string) for "no email".
"""

from __future__ import annotations

from sqlalchemy import (
    Float,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

ANONYMOUS_UID = 0

MEAL_KEYS: tuple[str, ...] = ("breakfast", "lunch", "dinner")


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        UniqueConstraint("username", name="uq_users_username"),
        Index("idx_users_email", "email", unique=True),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(80), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(160), nullable=False)
    created_at: Mapped[str] = mapped_column(String(32), nullable=False)
    email: Mapped[str | None] = mapped_column(String(160))
    failed_attempts: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    locked_until: Mapped[str | None] = mapped_column(String(32))
    language: Mapped[str] = mapped_column(String(8), nullable=False, default="zh")
    gender: Mapped[str | None] = mapped_column(String(8))
    height_cm: Mapped[float | None] = mapped_column(Float)
    metronomes_seeded: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    ticker_cleared: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class AuthSession(Base):
    __tablename__ = "sessions"

    token: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, nullable=False, default=ANONYMOUS_UID)
    created_at: Mapped[str] = mapped_column(String(32), nullable=False)


class EmailCode(Base):
    __tablename__ = "email_codes"
    __table_args__ = (Index("ix_email_codes_lookup", "email", "purpose", "id"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(160), nullable=False)
    code: Mapped[str] = mapped_column(String(8), nullable=False)
    purpose: Mapped[str] = mapped_column(String(16), nullable=False)
    created_at: Mapped[str] = mapped_column(String(32), nullable=False)
    expires_at: Mapped[str] = mapped_column(String(32), nullable=False)
    consumed: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class WorkoutLog(Base):
    __tablename__ = "workout_logs"
    __table_args__ = (
        UniqueConstraint("user_id", "log_date", "item_name", name="uq_workout_logs_key"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, nullable=False, default=ANONYMOUS_UID)
    log_date: Mapped[str] = mapped_column(String(10), nullable=False)
    schedule_type: Mapped[str] = mapped_column(String(80), nullable=False)
    item_name: Mapped[str] = mapped_column(String(200), nullable=False)
    is_completed: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class CustomItem(Base):
    __tablename__ = "custom_items"
    __table_args__ = (
        UniqueConstraint("user_id", "log_date", "item_name", name="uq_custom_items_key"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, nullable=False, default=ANONYMOUS_UID)
    log_date: Mapped[str] = mapped_column(String(10), nullable=False)
    item_name: Mapped[str] = mapped_column(String(200), nullable=False)
    is_completed: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    target_value: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    current_value: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    target_unit: Mapped[str] = mapped_column(String(10), nullable=False, default="")
    created_at: Mapped[str] = mapped_column(String(32), nullable=False)


class MealItem(Base):
    __tablename__ = "meal_items"
    __table_args__ = (
        UniqueConstraint("user_id", "log_date", "meal", "item_name", name="uq_meal_items_key"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, nullable=False, default=ANONYMOUS_UID)
    log_date: Mapped[str] = mapped_column(String(10), nullable=False)
    meal: Mapped[str] = mapped_column(String(16), nullable=False)
    item_name: Mapped[str] = mapped_column(String(200), nullable=False)
    is_completed: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[str] = mapped_column(String(32), nullable=False)


class BodyLog(Base):
    __tablename__ = "body_logs"
    __table_args__ = (UniqueConstraint("user_id", "log_date", name="uq_body_logs_key"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, nullable=False, default=ANONYMOUS_UID)
    log_date: Mapped[str] = mapped_column(String(10), nullable=False)
    weight: Mapped[float | None] = mapped_column(Float)
    body_fat: Mapped[float | None] = mapped_column(Float)
    updated_at: Mapped[str] = mapped_column(String(32), nullable=False)


class Plan(Base):
    __tablename__ = "plans"
    __table_args__ = (UniqueConstraint("plan_name", "user_id", name="uq_plans_key"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    plan_name: Mapped[str] = mapped_column(String(80), nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, nullable=False, default=ANONYMOUS_UID)
    items: Mapped[str] = mapped_column(Text, nullable=False)
    updated_at: Mapped[str] = mapped_column(String(32), nullable=False)
    weekday: Mapped[str | None] = mapped_column(String(10))


class TickerItem(Base):
    __tablename__ = "ticker_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, nullable=False, default=ANONYMOUS_UID)
    label: Mapped[str] = mapped_column(String(80), nullable=False)
    target_value: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    target_unit: Mapped[str] = mapped_column(String(10), nullable=False, default="")
    is_system: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class Metronome(Base):
    """Interval timers: an empty label means "caption me from my duration"."""

    __tablename__ = "metronomes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, nullable=False, default=ANONYMOUS_UID)
    label: Mapped[str] = mapped_column(String(40), nullable=False, default="")
    duration_sec: Mapped[int] = mapped_column(Integer, nullable=False, default=120)
    sound_key: Mapped[str] = mapped_column(String(16), nullable=False, default="chime")
    enabled: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
