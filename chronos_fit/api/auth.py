"""Sign in / sign up / password reset, verification codes and lockout."""

from __future__ import annotations

from datetime import timedelta

from fastapi import APIRouter, HTTPException, Response
from sqlalchemy import delete, select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..models import AuthSession, EmailCode, User
from ..services.email_service import send_verification_code
from ..services.security import (
    clear_session_cookie,
    hash_password,
    is_valid_email,
    new_code,
    new_session_token,
    normalize_email,
    set_session_cookie,
    username_from_email,
    verify_password,
)
from ..services.time_utils import now_bj, now_iso, parse_stored
from .deps import (
    AppConfig,
    CurrentUid,
    DbSession,
    LangPayload,
    LoginPayload,
    PasswordPayload,
    ProfilePayload,
    RegisterPayload,
    ResetPayload,
    SendCodePayload,
    SessionToken,
    ThemePayload,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])

PURPOSES = ("register", "reset")


def _language(value: str | None) -> str:
    return "en" if value == "en" else "zh"


def _user_by_email(session: Session, email: str) -> User | None:
    return session.scalar(select(User).where(User.email == email))


def _last_code(session: Session, email: str, purpose: str) -> EmailCode | None:
    return session.scalar(
        select(EmailCode)
        .where(EmailCode.email == email, EmailCode.purpose == purpose)
        .order_by(EmailCode.id.desc())
        .limit(1)
    )


def _store_code(session: Session, email: str, code: str, purpose: str, ttl_minutes: int) -> None:
    now = now_bj()
    session.add(
        EmailCode(
            email=email,
            code=code,
            purpose=purpose,
            created_at=now.isoformat(),
            expires_at=(now + timedelta(minutes=ttl_minutes)).isoformat(),
            consumed=0,
        )
    )
    session.flush()


def _consume_code(session: Session, email: str, code: str, purpose: str) -> None:
    """Validate the newest code for this email+purpose and burn it.

    Checks stay in the original order: missing/used, then mismatch, then expiry.
    The write commits with the rest of the request, so a failed register no longer
    burns a code the user still needs in order to retry.
    """
    row = _last_code(session, email, purpose)
    if row is None or row.consumed == 1:
        raise HTTPException(400, "验证码无效或已使用")
    if row.code != (code or "").strip():
        raise HTTPException(400, "验证码错误")
    expires = parse_stored(row.expires_at)
    if expires is None or expires < now_bj():
        raise HTTPException(400, "验证码已过期，请重新获取")
    row.consumed = 1
    session.flush()


def _create_session(session: Session, user_id: int) -> str:
    token = new_session_token()
    session.add(AuthSession(token=token, user_id=user_id, created_at=now_iso()))
    session.flush()
    return token


def _check_resend_cooldown(session: Session, email: str, purpose: str, resend_seconds: int) -> None:
    last = _last_code(session, email, purpose)
    created = parse_stored(last.created_at) if last is not None else None
    if created and (now_bj() - created).total_seconds() < resend_seconds:
        raise HTTPException(429, f"请 {resend_seconds} 秒后再次发送验证码")


def _unique_username(session: Session, base: str) -> str:
    """Two addresses sharing a local part must not collide on the unique username."""
    candidate = base
    suffix = 1
    while session.scalar(select(User.id).where(User.username == candidate)) is not None:
        candidate = f"{base}-{suffix}"
        suffix += 1
    return candidate


@router.post("/send-code")
def send_code(payload: SendCodePayload, session: DbSession, cfg: AppConfig):
    email = normalize_email(payload.email)
    purpose = payload.purpose.strip()
    if not is_valid_email(email):
        raise HTTPException(400, "请输入有效邮箱地址")
    if purpose not in PURPOSES:
        raise HTTPException(400, "无效的验证码类型")
    exists = _user_by_email(session, email) is not None
    if purpose == "register" and exists:
        raise HTTPException(400, "该邮箱已注册，请直接登录")
    if purpose == "reset" and not exists:
        raise HTTPException(400, "该邮箱尚未注册")
    _check_resend_cooldown(session, email, purpose, cfg.auth.resend_seconds)

    code = new_code()
    _store_code(session, email, code, purpose, cfg.auth.code_ttl_minutes)
    return {"ok": True, **send_verification_code(cfg, email, code, purpose)}


@router.post("/register")
def register(payload: RegisterPayload, response: Response, session: DbSession, cfg: AppConfig):
    email = normalize_email(payload.email)
    if not is_valid_email(email):
        raise HTTPException(400, "请输入有效邮箱地址")
    if len(payload.password) < 6:
        raise HTTPException(400, "密码至少6个字符")
    if _user_by_email(session, email) is not None:
        raise HTTPException(400, "该邮箱已注册，请直接登录")
    _consume_code(session, email, payload.code, "register")

    lang = _language(payload.language)
    username = _unique_username(session, username_from_email(email))
    try:
        user = User(
            username=username,
            password_hash=hash_password(payload.password),
            created_at=now_iso(),
            email=email,
            failed_attempts=0,
            language=lang,
            is_admin=1 if email in cfg.auth.admin_emails else 0,
        )
        session.add(user)
        session.flush()
    except IntegrityError:
        raise HTTPException(400, "该邮箱已注册，请直接登录")

    token = _create_session(session, user.id)
    set_session_cookie(response, token, cfg.auth.session_days)
    return {"ok": True, "email": email, "username": username, "language": lang}


@router.post("/login")
def login(payload: LoginPayload, response: Response, session: DbSession, cfg: AppConfig):
    email = normalize_email(payload.email)
    now = now_bj()
    user = _user_by_email(session, email)
    if user is None:
        raise HTTPException(401, "邮箱或密码错误")

    locked_until = parse_stored(user.locked_until)
    if locked_until and locked_until > now:
        mins = max(1, int((locked_until - now).total_seconds() // 60) + 1)
        raise HTTPException(423, f"账号已临时锁定，请 {mins} 分钟后重试，或重置密码")

    if not verify_password(payload.password, user.password_hash):
        fails = (user.failed_attempts or 0) + 1
        if fails >= cfg.auth.max_login_failures:
            user.failed_attempts = 0
            user.locked_until = (now + timedelta(minutes=cfg.auth.lockout_minutes)).isoformat()
            # A raised HTTPException unwinds into the session dependency and rolls it
            # back, so the strike that triggers the lock has to be committed here.
            session.commit()
            raise HTTPException(
                423,
                f"密码错误次数过多，账号已锁定 {cfg.auth.lockout_minutes} 分钟，可重置密码解锁",
            )
        user.failed_attempts = fails
        session.commit()
        remaining = cfg.auth.max_login_failures - fails
        raise HTTPException(401, f"邮箱或密码错误（还可尝试 {remaining} 次）")

    user.failed_attempts = 0
    user.locked_until = None
    session.flush()
    token = _create_session(session, user.id)
    set_session_cookie(response, token, cfg.auth.session_days)
    return {"ok": True, "email": email, "username": username_from_email(email)}


@router.post("/reset")
def reset_password(payload: ResetPayload, session: DbSession, cfg: AppConfig):
    email = normalize_email(payload.email)
    if len(payload.new_password) < 6:
        raise HTTPException(400, "密码至少6个字符")
    user = _user_by_email(session, email)
    if user is None:
        raise HTTPException(400, "该邮箱尚未注册")
    _consume_code(session, email, payload.code, "reset")
    user.password_hash = hash_password(payload.new_password)
    user.failed_attempts = 0
    user.locked_until = None
    session.flush()
    return {"ok": True}


@router.post("/logout")
def logout(response: Response, session: DbSession, token: SessionToken = None):
    if token:
        session.execute(delete(AuthSession).where(AuthSession.token == token))
    clear_session_cookie(response)
    return {"ok": True}


@router.get("/me")
def auth_me(uid: CurrentUid, session: DbSession):
    if not uid:
        return {"user": None}
    user = session.get(User, uid)
    if user is None:
        return {"user": None}
    return {
        "user": {
            "id": uid,
            "username": user.username,
            "email": user.email,
            "language": _language(user.language),
            "theme": user.theme or "eye",
            "is_admin": bool(user.is_admin),
            "gender": user.gender,
            "height_cm": user.height_cm,
            "target_weight": user.target_weight,
            "target_body_fat": user.target_body_fat,
        }
    }


@router.post("/password")
def change_password(payload: PasswordPayload, uid: CurrentUid, session: DbSession):
    if not uid:
        raise HTTPException(401, "请先登录")
    if len(payload.new_password) < 6:
        raise HTTPException(400, "密码至少6个字符")
    user = session.get(User, uid)
    if user is None:
        raise HTTPException(401, "请先登录")
    if not verify_password(payload.old_password, user.password_hash):
        raise HTTPException(400, "原密码不正确")
    user.password_hash = hash_password(payload.new_password)
    user.failed_attempts = 0
    user.locked_until = None
    session.flush()
    return {"ok": True}


@router.post("/language")
def set_language(payload: LangPayload, uid: CurrentUid, session: DbSession):
    if not uid:
        raise HTTPException(401, "请先登录")
    lang = _language(payload.language)
    session.execute(update(User).where(User.id == uid).values(language=lang))
    return {"ok": True, "language": lang}


@router.post("/theme")
def set_theme(payload: ThemePayload, uid: CurrentUid, session: DbSession):
    if not uid:
        raise HTTPException(401, "请先登录")
    theme = (payload.theme or "").strip()
    if theme not in ("system", "dark", "light", "eye"):
        raise HTTPException(400, "主题仅支持 system / dark / light / eye")
    session.execute(update(User).where(User.id == uid).values(theme=theme))
    return {"ok": True, "theme": theme}


@router.post("/profile")
def set_profile(payload: ProfilePayload, uid: CurrentUid, session: DbSession):
    """性别 / 身高：BMI 的输入项。传 null 表示清除该项。"""
    if not uid:
        raise HTTPException(401, "请先登录")
    gender = payload.gender
    if gender not in (None, "", "male", "female"):
        raise HTTPException(400, "性别仅支持 male / female")
    height = payload.height_cm
    if height is not None and not 50.0 <= float(height) <= 250.0:
        raise HTTPException(400, "身高需在 50–250 cm 之间")
    session.execute(
        update(User).where(User.id == uid).values(
            gender=gender or None,
            height_cm=round(float(height), 1) if height is not None else None,
        )
    )
    return {"ok": True, "gender": gender or None, "height_cm": height}
