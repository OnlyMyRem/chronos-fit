"""Entry point — ``chronos-fit``, ``python -m chronos_fit`` or ``uvicorn chronos_fit.main:app``."""

from __future__ import annotations

from .app import create_app

app = create_app()


def main() -> None:
    import argparse

    import uvicorn

    cfg = app.state.config
    parser = argparse.ArgumentParser(prog="chronos-fit", description="ChronosFit dashboard server")
    parser.add_argument("--addr", default=cfg.server.host, help=f"listen address (default: {cfg.server.host})")
    parser.add_argument("--port", type=int, default=cfg.server.port, help=f"listen port (default: {cfg.server.port})")
    args = parser.parse_args()
    uvicorn.run(app, host=args.addr, port=args.port)


if __name__ == "__main__":
    main()
