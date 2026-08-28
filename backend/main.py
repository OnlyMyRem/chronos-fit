"""Entry point — ``python -m backend.main`` or ``uvicorn backend.main:app``."""

from __future__ import annotations

from .app import create_app

app = create_app()


def main() -> None:
    import uvicorn

    cfg = app.state.config
    uvicorn.run(app, host=cfg.server.host, port=cfg.server.port)


if __name__ == "__main__":
    main()
