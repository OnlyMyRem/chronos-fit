"""Entry point — ``chronosfit``, ``python -m chronos_fit`` or ``uvicorn chronos_fit.main:app``."""

from __future__ import annotations

from .app import create_app

app = create_app()


def main() -> None:
    import uvicorn

    cfg = app.state.config
    uvicorn.run(app, host=cfg.server.host, port=cfg.server.port)


if __name__ == "__main__":
    main()
