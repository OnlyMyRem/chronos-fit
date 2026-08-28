"""Verification-code delivery: real SMTP when configured, dev mode otherwise.

Dev mode keeps the app usable with zero setup — the code is returned to the caller
and echoed to the server log instead of being mailed.
"""

from __future__ import annotations

import smtplib
from email.message import EmailMessage

from ..config import Config
from .time_utils import now_bj

SUBJECTS = {
    "register": "ChronosFit 注册验证码",
    "reset": "ChronosFit 密码重置验证码",
}


def _body(code: str, ttl_minutes: int) -> str:
    return f"您的验证码是 {code}，{ttl_minutes} 分钟内有效。\n如非本人操作，请忽略此邮件。"


def _mail(cfg: Config, email: str, code: str, purpose: str) -> None:
    msg = EmailMessage()
    msg["From"] = cfg.smtp.from_addr
    msg["To"] = email
    msg["Subject"] = SUBJECTS.get(purpose, SUBJECTS["register"])
    msg.set_content(_body(code, cfg.auth.code_ttl_minutes))

    if cfg.smtp.port == 465:
        with smtplib.SMTP_SSL(cfg.smtp.host, cfg.smtp.port, timeout=15) as server:
            server.login(cfg.smtp.user, cfg.smtp.password)
            server.send_message(msg)
    else:
        with smtplib.SMTP(cfg.smtp.host, cfg.smtp.port, timeout=15) as server:
            server.starttls()
            server.login(cfg.smtp.user, cfg.smtp.password)
            server.send_message(msg)


def send_verification_code(cfg: Config, email: str, code: str, purpose: str) -> dict:
    """Return ``{"sent", "dev_code"}``; ``dev_code`` is non-null only in dev mode."""
    if not cfg.smtp.enabled:
        print(
            f"[ChronosFit][dev] code for {email} ({purpose}): {code} "
            f"at {now_bj().isoformat()}",
            flush=True,
        )
        return {"sent": False, "dev_code": code}
    _mail(cfg, email, code, purpose)
    return {"sent": True, "dev_code": None}
