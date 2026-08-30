"""Application factory: config, lifespan migration, routers, static frontend."""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from . import __version__ as VERSION
from . import db
from .api import admin, auth, body, imports, meals, metronomes, plans, reports, ticker, workouts
from .bootstrap import bootstrap
from .config import FRONTEND_DIR, Config, load_config


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Schema + seed data are prepared when the server starts, not at import time."""
    bootstrap(app.state.config)
    yield
    db.dispose()


def create_app(cfg: Config | None = None) -> FastAPI:
    cfg = cfg or load_config()
    app = FastAPI(title="ChronosFit", version=VERSION, lifespan=lifespan)
    app.state.config = cfg

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    for module in (admin, auth, plans, workouts, meals, body, ticker, metronomes, reports, imports):
        app.include_router(module.router)

    # 前端是单文件无构建的纯静态资源，且迭代频繁。给它 no-cache 而不是
    # StaticFiles 默认的启发式缓存，否则改完代码后浏览器会继续跑旧版 app.js，
    # 表现成「代码没问题但页面行为对不上」这种极难排查的状态。
    @app.middleware("http")
    async def disable_static_cache(request, call_next):
        response = await call_next(request)
        if request.url.path == "/" or request.url.path.startswith("/static/"):
            response.headers["Cache-Control"] = "no-cache"
        return response

    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

    @app.get("/", include_in_schema=False)
    def index():
        return FileResponse(FRONTEND_DIR / "index.html")

    return app
