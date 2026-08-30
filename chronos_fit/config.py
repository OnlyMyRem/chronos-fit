"""Configuration: config.yaml plus environment-variable overrides.

Missing config.yaml is not an error — the defaults below keep
`python -m chronos_fit` working with zero setup.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

import yaml

PACKAGE_DIR = Path(__file__).resolve().parent
# Frontend ships inside the package so an installed wheel finds it too.
FRONTEND_DIR = PACKAGE_DIR / "frontend"


def _data_dir() -> Path:
    """Stateful files (config.yaml, SQLite db) live next to where the app is
    launched, never inside site-packages — that keeps a pip-installed wheel
    writable and backups easy. CHRONOSFIT_DATA_DIR overrides the location."""
    raw = os.environ.get("CHRONOSFIT_DATA_DIR", "").strip()
    path = Path(raw) if raw else Path.cwd() / "data"
    return path if path.is_absolute() else (Path.cwd() / path).resolve()


DATA_DIR = _data_dir()

DEFAULT_DB_URL = "sqlite:///./data/workout.db"

# env var -> (section, key); wins over config.yaml so secrets stay out of the image.
_ENV_OVERRIDES = {
    "CHRONOSFIT_HOST": ("server", "host"),
    "CHRONOSFIT_PORT": ("server", "port"),
    "DATABASE_URL": ("database", "url"),
    "CHRONOSFIT_SQL_ECHO": ("database", "echo_sql"),
    "CHRONOSFIT_API_KEY": ("auth", "secret_key"),
    "CHRONOSFIT_ADMIN_EMAILS": ("auth", "admin_emails"),
    "SMTP_HOST": ("smtp", "host"),
    "SMTP_PORT": ("smtp", "port"),
    "SMTP_USER": ("smtp", "user"),
    "SMTP_PASSWORD": ("smtp", "password"),
    "SMTP_FROM": ("smtp", "sender"),
}


@dataclass(frozen=True)
class ServerConfig:
    host: str = "0.0.0.0"
    port: int = 18000


@dataclass(frozen=True)
class DatabaseConfig:
    url: str = DEFAULT_DB_URL
    echo_sql: bool = False
    pool_recycle_seconds: int = 3600

    @property
    def dialect(self) -> str:
        return self.url.split(":", 1)[0].split("+", 1)[0]


@dataclass(frozen=True)
class AuthConfig:
    secret_key: str = ""
    session_days: int = 30
    code_ttl_minutes: int = 10
    resend_seconds: int = 60
    max_login_failures: int = 5
    lockout_minutes: int = 15
    admin_emails: tuple[str, ...] = ()


@dataclass(frozen=True)
class SmtpConfig:
    host: str = ""
    port: int = 465
    user: str = ""
    password: str = ""
    sender: str = ""

    @property
    def enabled(self) -> bool:
        """Blank credentials keep the app in dev mode: codes are returned to the browser."""
        return bool(self.host and self.user and self.password)

    @property
    def from_addr(self) -> str:
        return self.sender or self.user


@dataclass(frozen=True)
class Config:
    server: ServerConfig = field(default_factory=ServerConfig)
    database: DatabaseConfig = field(default_factory=DatabaseConfig)
    auth: AuthConfig = field(default_factory=AuthConfig)
    smtp: SmtpConfig = field(default_factory=SmtpConfig)
    source: Path | None = None


def _as_int(value: object, default: int) -> int:
    try:
        return int(str(value).strip())
    except (TypeError, ValueError):
        return default


def _as_bool(value: object, default: bool) -> bool:
    if isinstance(value, bool):
        return value
    if value is None:
        return default
    return str(value).strip().lower() in {"1", "true", "yes", "on"}


def _as_str(value: object, default: str) -> str:
    if value is None:
        return default
    text = str(value).strip()
    return text or default


def _admin_emails(value: object) -> tuple[str, ...]:
    """Accept a YAML list or a comma-separated string, normalized to lowercase."""
    if isinstance(value, (list, tuple)):
        raw = value
    else:
        raw = str(value or "").split(",")
    return tuple(
        email.strip().lower()
        for email in raw
        if isinstance(email, str) and email.strip()
    )


def _read_yaml(path: Path) -> dict:
    try:
        raw = yaml.safe_load(path.read_text(encoding="utf-8"))
    except yaml.YAMLError as exc:
        raise ValueError(f"配置文件 {path} 解析失败：{exc}") from exc
    return raw if isinstance(raw, dict) else {}


def _resolve_path(path: Path) -> Path:
    return path if path.is_absolute() else (Path.cwd() / path).resolve()


def config_path(explicit: str | os.PathLike[str] | None = None) -> Path | None:
    """Explicit argument > CHRONOSFIT_CONFIG > ./data/config.yaml > ./config.yaml (legacy).

    Both the local run and the Docker image read data/config.yaml by default —
    the config, the SQLite file and the template live side by side. A
    config.yaml beside the data directory stays as a compatibility fallback
    for older deployments.
    """
    for candidate in (
        explicit,
        os.environ.get("CHRONOSFIT_CONFIG"),
        DATA_DIR / "config.yaml",
        DATA_DIR.parent / "config.yaml",
    ):
        if not candidate:
            continue
        path = _resolve_path(Path(candidate))
        if path.is_file():
            return path
    return None


def load_config(explicit: str | os.PathLike[str] | None = None) -> Config:
    path = config_path(explicit)
    sections: dict[str, dict] = {}
    if path is not None:
        loaded = _read_yaml(path)
        sections = {k: v for k, v in loaded.items() if isinstance(v, dict)}

    values: dict[str, dict] = {
        "server": dict(sections.get("server") or {}),
        "database": dict(sections.get("database") or {}),
        "auth": dict(sections.get("auth") or {}),
        "smtp": dict(sections.get("smtp") or {}),
    }

    for env_name, (section, key) in _ENV_OVERRIDES.items():
        env_value = os.environ.get(env_name)
        if env_value is not None and env_value.strip() != "":
            values[section][key] = env_value.strip()

    server = values["server"]
    database = values["database"]
    auth = values["auth"]
    smtp = values["smtp"]

    return Config(
        server=ServerConfig(
            host=_as_str(server.get("host"), ServerConfig.host),
            port=_as_int(server.get("port"), ServerConfig.port),
        ),
        database=DatabaseConfig(
            url=_as_str(database.get("url"), DEFAULT_DB_URL),
            echo_sql=_as_bool(database.get("echo_sql"), False),
            pool_recycle_seconds=_as_int(
                database.get("pool_recycle_seconds"), DatabaseConfig.pool_recycle_seconds
            ),
        ),
        auth=AuthConfig(
            secret_key=str(auth.get("secret_key") or ""),
            session_days=_as_int(auth.get("session_days"), AuthConfig.session_days),
            code_ttl_minutes=_as_int(auth.get("code_ttl_minutes"), AuthConfig.code_ttl_minutes),
            resend_seconds=_as_int(auth.get("resend_seconds"), AuthConfig.resend_seconds),
            max_login_failures=_as_int(
                auth.get("max_login_failures"), AuthConfig.max_login_failures
            ),
            lockout_minutes=_as_int(auth.get("lockout_minutes"), AuthConfig.lockout_minutes),
            admin_emails=_admin_emails(auth.get("admin_emails")),
        ),
        smtp=SmtpConfig(
            host=str(smtp.get("host") or ""),
            port=_as_int(smtp.get("port"), SmtpConfig.port),
            user=str(smtp.get("user") or ""),
            password=str(smtp.get("password") or ""),
            sender=str(smtp.get("sender") or ""),
        ),
        source=path,
    )
