"""Admin panel: instance stats, user list, admin / lockout management.

Only users whose ``email`` is listed in ``auth.admin_emails`` (config.yaml or the
``CHRONOSFIT_ADMIN_EMAILS`` environment variable) can reach these endpoints —
the frontend hides the entry point unless ``/api/auth/me`` reports ``is_admin``.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..models import User
from ..services.time_utils import now_bj
from .deps import CurrentUid, DbSession

router = APIRouter(prefix="/api/admin", tags=["admin"])

# 后台允许的「锁定」时长：管理员解锁前，该账号一直处于锁定状态。
LOCKOUT_FOREVER_DAYS = 3650


def get_admin(uid: CurrentUid, session: DbSession) -> User:
    """Reject anonymous and non-admin callers."""
    if not uid:
        raise HTTPException(401, "请先登录")
    user = session.get(User, uid)
    if user is None or not user.is_admin:
        raise HTTPException(403, "需要管理员权限")
    return user


AdminUser = Annotated[User, Depends(get_admin)]


@router.get("/stats")
def admin_stats(admin: AdminUser, session: DbSession):
    total = session.scalar(select(func.count(User.id))) or 0
    today = now_bj().date().isoformat()
    today_new = (
        session.scalar(
            select(func.count(User.id)).where(User.created_at.startswith(today))
        )
        or 0
    )
    admins = (
        session.scalar(select(func.count(User.id)).where(User.is_admin == 1)) or 0
    )
    locked = (
        session.scalar(
            select(func.count(User.id)).where(User.locked_until.is_not(None))
        )
        or 0
    )
    return {
        "total": total,
        "today_new": today_new,
        "admins": admins,
        "locked": locked,
    }


@router.get("/users")
def admin_users(admin: AdminUser, session: DbSession):
    rows = session.scalars(select(User).order_by(User.id.desc())).all()
    return {
        "users": [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "created_at": user.created_at,
                "language": user.language or "zh",
                "theme": user.theme or "system",
                "is_admin": bool(user.is_admin),
                "locked": bool(user.locked_until),
                "failed_attempts": user.failed_attempts or 0,
                # 密码只存 salt:sha256 哈希，永远无法从这里还原明文。
                "password_hash": user.password_hash,
            }
            for user in rows
        ]
    }


@router.post("/users/{user_id}/toggle-admin")
def toggle_admin(user_id: int, admin: AdminUser, session: DbSession):
    if user_id == admin.id:
        raise HTTPException(400, "不能取消自己的管理员权限")
    target = session.get(User, user_id)
    if target is None:
        raise HTTPException(404, "用户不存在")
    is_admin = 0 if target.is_admin else 1
    target.is_admin = is_admin
    session.flush()
    return {"ok": True, "is_admin": bool(is_admin)}


@router.post("/users/{user_id}/lock")
def lock_user(user_id: int, admin: AdminUser, session: DbSession):
    target = session.get(User, user_id)
    if target is None:
        raise HTTPException(404, "用户不存在")
    if target.id == admin.id:
        raise HTTPException(400, "不能锁定自己的账号")
    target.locked_until = (
        now_bj() + timedelta(days=LOCKOUT_FOREVER_DAYS)
    ).isoformat()
    session.flush()
    return {"ok": True, "locked": True}


@router.post("/users/{user_id}/unlock")
def unlock_user(user_id: int, admin: AdminUser, session: DbSession):
    target = session.get(User, user_id)
    if target is None:
        raise HTTPException(404, "用户不存在")
    target.locked_until = None
    target.failed_attempts = 0
    session.flush()
    return {"ok": True, "locked": False}
