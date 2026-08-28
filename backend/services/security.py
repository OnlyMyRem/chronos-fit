"""Passwords, session tokens, cookies and email-address rules."""

from __future__ import annotations

import hashlib
import hmac
import re
import secrets

from fastapi import Response

SESSION_COOKIE = "chronosfit_session"

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def hash_password(password: str, salt: str | None = None) -> str:
    """Keep the legacy ``salt:hexdigest`` shape so existing rows still verify."""
    salt = salt or secrets.token_hex(16)
    digest = hashlib.sha256((salt + password).encode("utf-8")).hexdigest()
    return f"{salt}:{digest}"


def verify_password(password: str, stored: str | None) -> bool:
    if not stored:
        return False
    salt, sep, digest = stored.partition(":")
    if not sep or not salt or not digest:
        return False
    candidate = hashlib.sha256((salt + password).encode("utf-8")).hexdigest()
    return hmac.compare_digest(candidate, digest)


def new_session_token() -> str:
    return secrets.token_hex(32)


def new_code() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"


def is_valid_email(email: str | None) -> bool:
    return bool(EMAIL_RE.match(email or ""))


def normalize_email(email: str) -> str:
    return email.strip().lower()


def username_from_email(email: str) -> str:
    return email.split("@", 1)[0][:30]


def set_session_cookie(response: Response, token: str, days: int) -> None:
    response.set_cookie(
        key=SESSION_COOKIE,
        value=token,
        max_age=days * 24 * 60 * 60,
        httponly=True,
        samesite="lax",
    )


def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(SESSION_COOKIE)
