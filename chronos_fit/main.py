"""Entry point — ``chronos-fit``, ``python -m chronos_fit`` or ``uvicorn chronos_fit.main:app``."""

from __future__ import annotations


def _build_app():
    from .app import create_app

    return create_app()


def __getattr__(name):
    # Lazily expose `app` so `uvicorn chronos_fit.main:app` keeps working,
    # while the CLI can set --data-dir before config is first loaded.
    if name == "app":
        return _build_app()
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


def main() -> None:
    import argparse
    import os
    from pathlib import Path

    import uvicorn

    parser = argparse.ArgumentParser(prog="chronos-fit", description="ChronosFit dashboard server")
    parser.add_argument("--addr", default=None, help="listen address (default: from config, 0.0.0.0)")
    parser.add_argument("--port", type=int, default=None, help="listen port (default: from config, 18000)")
    parser.add_argument(
        "--data-dir",
        default=None,
        help="data directory for config.yaml and SQLite (default: ./data or $CHRONOSFIT_DATA_DIR)",
    )
    args = parser.parse_args()

    if args.data_dir:
        os.environ["CHRONOSFIT_DATA_DIR"] = str(Path(args.data_dir).resolve())

    app = _build_app()
    cfg = app.state.config
    uvicorn.run(app, host=args.addr or cfg.server.host, port=args.port or cfg.server.port)


if __name__ == "__main__":
    main()
