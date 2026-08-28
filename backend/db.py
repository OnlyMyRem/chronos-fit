"""Engine, session and the shared upsert helper.

Every database access in the app goes through SQLAlchemy 2.0; nothing else imports
sqlite3 or issues raw driver calls.
"""

from __future__ import annotations

from collections.abc import Iterator
from contextlib import contextmanager
from pathlib import Path
from typing import Any

from sqlalchemy import Engine, create_engine, inspect, select
from sqlalchemy.orm import Session, sessionmaker

from .config import ROOT_DIR, Config
from .models import Base

_SQLITE_ABS = "sqlite:////"
_SQLITE_PREFIX = "sqlite:///"

_engine: Engine | None = None
_session_factory: sessionmaker[Session] | None = None


def normalize_sqlite_url(url: str) -> str:
    """Resolve relative SQLite paths against the project root, never the cwd.

    Without this, launching from another directory silently creates a second, empty
    database and the user appears to lose their data.
    """
    if not url.startswith("sqlite"):
        return url
    if url.startswith(_SQLITE_ABS) or url == "sqlite://" or url.startswith("sqlite:///:memory:"):
        return url
    if not url.startswith(_SQLITE_PREFIX):
        return url
    raw = url[len(_SQLITE_PREFIX):]
    if not raw:
        return url
    path = Path(raw.replace("\\", "/"))
    if path.is_absolute():
        return url
    resolved = (ROOT_DIR / path).resolve()
    return f"{_SQLITE_PREFIX}{resolved.as_posix()}"


def sqlite_file(url: str) -> Path | None:
    """Filesystem path behind a SQLite URL, or None for memory/other dialects."""
    if not url.startswith("sqlite") or ":memory:" in url:
        return None
    if url.startswith(_SQLITE_ABS):
        return Path(url[len("sqlite://"):])
    if url.startswith(_SQLITE_PREFIX):
        raw = url[len(_SQLITE_PREFIX):]
        return None if not raw else Path(raw)
    return None


def create_engine_for(cfg: Config) -> Engine:
    url = normalize_sqlite_url(cfg.database.url)
    target = sqlite_file(url)
    if target is not None:
        target.parent.mkdir(parents=True, exist_ok=True)
    kwargs: dict[str, Any] = {
        "echo": cfg.database.echo_sql,
        "pool_pre_ping": True,
        "pool_recycle": cfg.database.pool_recycle_seconds,
        "future": True,
    }
    if url.startswith("sqlite"):
        # FastAPI serves each request on its own thread; SQLite's default check forbids it.
        kwargs["connect_args"] = {"check_same_thread": False}
    return create_engine(url, **kwargs)


def configure(cfg: Config) -> Engine:
    global _engine, _session_factory
    engine = create_engine_for(cfg)
    set_engine(engine)
    return engine


def set_engine(engine: Engine) -> None:
    global _engine, _session_factory
    _engine = engine
    _session_factory = sessionmaker(bind=engine, expire_on_commit=False)


def engine() -> Engine:
    if _engine is None:
        raise RuntimeError("database engine not configured; call db.configure() first")
    return _engine


def session_factory() -> sessionmaker[Session]:
    if _session_factory is None:
        raise RuntimeError("database engine not configured; call db.configure() first")
    return _session_factory


def dispose() -> None:
    if _engine is not None:
        _engine.dispose()


@contextmanager
def session_scope() -> Iterator[Session]:
    """Commit on success, roll back on error, always close (the old sqlite3 code leaked)."""
    session = session_factory()()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def get_session() -> Iterator[Session]:
    """FastAPI dependency."""
    session = session_factory()()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def upsert(
    session: Session,
    model: type[Any],
    key: dict[str, Any],
    insert: dict[str, Any],
    update: dict[str, Any] | None = None,
) -> Any:
    """Insert-or-update on a unique key, portable across SQLite and MySQL.

    Replaces the dialect-specific ``INSERT OR IGNORE`` / ``ON CONFLICT DO UPDATE``
    statements the raw sqlite3 version relied on. ``update=None`` means "apply
    insert"; pass a filtered dict to keep COALESCE-style "don't overwrite with None"
    semantics (see POST /api/body).
    """
    row = session.scalar(select(model).filter_by(**key))
    if row is None:
        row = model(**{**key, **insert})
        session.add(row)
    else:
        for column, value in (insert if update is None else update).items():
            setattr(row, column, value)
    session.flush()
    return row


def existing_columns(session: Session, table: str) -> set[str]:
    bind = session.get_bind()
    return {column["name"] for column in inspect(bind).get_columns(table)}


def existing_indexes(session: Session, table: str) -> set[str]:
    bind = session.get_bind()
    return {idx["name"] for idx in inspect(bind).get_indexes(table) if idx["name"]}


def table_exists(session: Session, table: str) -> bool:
    return table in set(inspect(session.get_bind()).get_table_names())
