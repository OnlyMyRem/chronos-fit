"""Startup schema handling: create tables, absorb a legacy database, seed defaults.

Called from the FastAPI lifespan, so importing the app no longer performs DDL as a
side effect (the old module ran ``init_db()`` at import time).
"""

from __future__ import annotations

from sqlalchemy import Engine, text, update
from sqlalchemy.orm import Session

from . import db
from .config import Config
from .models import Base, User
from .seeds import seed_defaults

EMAIL_INDEX = "idx_users_email"


def _literal(value: object) -> str:
    if isinstance(value, bool):
        return "1" if value else "0"
    if isinstance(value, (int, float)):
        return str(value)
    return "'" + str(value).replace("'", "''") + "'"


def _zero_for(type_sql: str) -> object:
    upper = type_sql.upper()
    if "INT" in upper:
        return 0
    if any(token in upper for token in ("REAL", "FLOA", "DOUB", "NUM", "DEC")):
        return 0
    return ""


def _column_ddl(engine: Engine, column: object) -> str:
    preparer = engine.dialect.identifier_preparer
    type_sql = column.type.compile(dialect=engine.dialect)  # type: ignore[attr-defined]
    parts = [preparer.quote(column.name)]  # type: ignore[attr-defined]
    default = column.default  # type: ignore[attr-defined]
    literal = default.arg if (default is not None and default.is_scalar) else None  # type: ignore[attr-defined]
    if not column.nullable:  # type: ignore[attr-defined]
        if literal is None:
            literal = _zero_for(type_sql)
        parts.append("NOT NULL")
    if literal is not None:
        parts.append(f"DEFAULT {_literal(literal)}")
    return " ".join(parts)


def _add_missing_columns(engine: Engine, session: Session) -> None:
    """Bring an older database up to the model: add columns absent from the table."""
    preparer = engine.dialect.identifier_preparer
    for table in Base.metadata.sorted_tables:
        if not db.table_exists(session, table.name):
            continue  # create_all() just built it with every column
        present = db.existing_columns(session, table.name)
        for column in table.columns:
            if column.name in present or column.primary_key:
                continue
            session.execute(
                text(
                    f"ALTER TABLE {preparer.quote(table.name)} "
                    f"ADD COLUMN {_column_ddl(engine, column)}"
                )
            )


def _normalize_blank_emails(session: Session) -> None:
    """NULL, not '', means "no email" — a plain UNIQUE index allows many NULLs."""
    session.execute(text("UPDATE users SET email = NULL WHERE email = ''"))


def _email_index_present(engine: Engine, session: Session) -> bool:
    """Also replaces the legacy SQLite *partial* index, which MySQL cannot express."""
    if engine.dialect.name == "sqlite":
        stored = session.execute(
            text("SELECT sql FROM sqlite_master WHERE type='index' AND name=:name"),
            {"name": EMAIL_INDEX},
        ).first()
        if stored is None:
            return False
        if stored[0] and "WHERE" in stored[0].upper():
            session.execute(text(f"DROP INDEX {EMAIL_INDEX}"))
            return False
        return True
    return EMAIL_INDEX in db.existing_indexes(session, "users")


def _ensure_email_index(engine: Engine, session: Session) -> None:
    if _email_index_present(engine, session):
        return
    preparer = engine.dialect.identifier_preparer
    session.execute(
        text(
            f"CREATE UNIQUE INDEX {EMAIL_INDEX} "
            f"ON {preparer.quote('users')} (email)"
        )
    )


def _sync_admins(session: Session, cfg: Config) -> None:
    """Config-listed emails become admins on every startup; re-adding an email
    to the config re-promotes the account even if it was demoted meanwhile."""
    if not cfg.auth.admin_emails:
        return
    session.execute(
        update(User)
        .where(User.email.in_(cfg.auth.admin_emails))
        .values(is_admin=1)
    )


def bootstrap(cfg: Config) -> Engine:
    engine = db.configure(cfg)
    Base.metadata.create_all(engine, checkfirst=True)
    with db.session_scope() as session:
        _add_missing_columns(engine, session)
        _normalize_blank_emails(session)
        session.flush()
        _ensure_email_index(engine, session)
        _sync_admins(session, cfg)
        seed_defaults(session)
    return engine
