"""Shared request dependencies and request bodies.

``get_uid`` replaces the old ``get_user_id_from_cookie`` helper: it reuses the request's
own session instead of opening a second database connection per request.
"""

from __future__ import annotations

from typing import Annotated

from fastapi import Cookie, Depends, Request
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import db
from ..config import Config
from ..models import ANONYMOUS_UID, AuthSession
from ..services.security import SESSION_COOKIE


def get_config(request: Request) -> Config:
    return request.app.state.config


def get_uid(
    session: Annotated[Session, Depends(db.get_session)],
    token: Annotated[str | None, Cookie(alias=SESSION_COOKIE)] = None,
) -> int:
    """Signed-in user id, or 0 — the shared bucket anonymous requests write to."""
    if not token:
        return ANONYMOUS_UID
    uid = session.scalar(select(AuthSession.user_id).where(AuthSession.token == token))
    return uid if uid is not None else ANONYMOUS_UID


DbSession = Annotated[Session, Depends(db.get_session)]
CurrentUid = Annotated[int, Depends(get_uid)]
AppConfig = Annotated[Config, Depends(get_config)]
SessionToken = Annotated[str | None, Cookie(alias=SESSION_COOKIE)]


class SendCodePayload(BaseModel):
    email: str
    purpose: str


class RegisterPayload(BaseModel):
    email: str
    password: str
    code: str
    language: str = "zh"


class LoginPayload(BaseModel):
    email: str
    password: str


class ResetPayload(BaseModel):
    email: str
    code: str
    new_password: str


class LangPayload(BaseModel):
    language: str


class ThemePayload(BaseModel):
    theme: str


class ProfilePayload(BaseModel):
    gender: str | None = None
    height_cm: float | None = None


class PasswordPayload(BaseModel):
    old_password: str
    new_password: str


class TogglePayload(BaseModel):
    log_date: str
    schedule_type: str
    item_name: str
    is_completed: bool


class CustomItemPayload(BaseModel):
    log_date: str
    item_name: str
    target_value: float = 0
    target_unit: str = ""


class CustomTogglePayload(BaseModel):
    log_date: str
    item_name: str
    is_completed: bool
    current_value: float | None = None


class MealItemPayload(BaseModel):
    log_date: str
    meal: str
    item_name: str


class MealTogglePayload(BaseModel):
    log_date: str
    meal: str
    item_name: str
    is_completed: bool


class BodyPayload(BaseModel):
    log_date: str
    weight: float | None = None
    body_fat: float | None = None


class BodyTargetPayload(BaseModel):
    weight: float | None = None
    body_fat: float | None = None


class PlanPayload(BaseModel):
    name: str
    items: list[str]
    weekday: str | None = None


class CyclePayload(BaseModel):
    train_days: int
    rest_days: int
    plan_names: list[str]
    anchor_date: str | None = None


class TickerPayload(BaseModel):
    label: str
    target_value: float = 0
    target_unit: str = ""


class TickerResetPayload(BaseModel):
    mode: str = "defaults"


class MetronomePayload(BaseModel):
    duration_sec: int
    label: str = ""
    sound_key: str = "chime"
    enabled: bool = True


class MetronomeUpdatePayload(BaseModel):
    id: int
    duration_sec: int | None = None
    label: str | None = None
    sound_key: str | None = None
    enabled: bool | None = None
