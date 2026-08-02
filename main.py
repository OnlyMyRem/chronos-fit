"""ChronosFit - fullscreen clock & workout check-in dashboard (FastAPI + SQLite)."""

import json
import os
import sqlite3
from datetime import datetime, timedelta, timezone
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "workout.db"
STATIC_DIR = BASE_DIR / "static"

BEIJING_TZ = timezone(timedelta(hours=8))

# Optional API key. Set CHRONOSFIT_API_KEY env var to protect /api/export-logs.
API_KEY = os.environ.get("CHRONOSFIT_API_KEY", "")

PLANS = {
    "Tuesday - Upper Body Power": [
        "4 sets of Pull-ups (max)",
        "4 sets of Push-ups",
        "AB roller (3x20)",
        "40 min Run",
    ],
    "Thursday - Lower Body & Core": [
        "4 sets of 25 Squats (100 total)",
        "AB roller (5x20)",
        "40 min Run",
    ],
    "Saturday - Full Body Burn": [
        "3 sets of Pull-ups",
        "3 sets of Push-ups",
        "50 Squats",
        "40 min Run",
    ],
    "Sunday - Endurance & Core": [
        "2 sets of Pull-ups",
        "AB roller (5x30)",
        "40 min Run (Try a slower pace)",
    ],
}

# Python weekday(): Monday=0 ... Sunday=6
WEEKDAY_PLAN = {
    1: "Tuesday - Upper Body Power",
    3: "Thursday - Lower Body & Core",
    5: "Saturday - Full Body Burn",
    6: "Sunday - Endurance & Core",
}

app = FastAPI(title="ChronosFit", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_conn() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS workout_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                log_date TEXT NOT NULL,
                schedule_type TEXT NOT NULL,
                item_name TEXT NOT NULL,
                is_completed INTEGER NOT NULL DEFAULT 0,
                UNIQUE (log_date, item_name)
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS custom_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                log_date TEXT NOT NULL,
                item_name TEXT NOT NULL,
                is_completed INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                UNIQUE (log_date, item_name)
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS meal_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                log_date TEXT NOT NULL,
                meal TEXT NOT NULL,
                item_name TEXT NOT NULL,
                is_completed INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                UNIQUE (log_date, meal, item_name)
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS plans (
                plan_name TEXT PRIMARY KEY,
                items TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        count = conn.execute("SELECT COUNT(*) AS c FROM plans").fetchone()["c"]
        if count == 0:
            now = datetime.now(BEIJING_TZ).isoformat()
            for name, items in PLANS.items():
                conn.execute(
                    "INSERT INTO plans (plan_name, items, updated_at) VALUES (?, ?, ?)",
                    (name, json.dumps(items, ensure_ascii=False), now),
                )


init_db()


class TogglePayload(BaseModel):
    log_date: str
    schedule_type: str
    item_name: str
    is_completed: bool


class CustomItemPayload(BaseModel):
    log_date: str
    item_name: str


class CustomTogglePayload(BaseModel):
    log_date: str
    item_name: str
    is_completed: bool


class MealItemPayload(BaseModel):
    log_date: str
    meal: str
    item_name: str


class MealTogglePayload(BaseModel):
    log_date: str
    meal: str
    item_name: str
    is_completed: bool


class PlanPayload(BaseModel):
    name: str
    items: list[str]


def load_plans():
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT plan_name, items FROM plans ORDER BY rowid"
        ).fetchall()
    return {r["plan_name"]: json.loads(r["items"]) for r in rows}


@app.get("/api/plans")
def get_plans():
    today = datetime.now(BEIJING_TZ)
    return {
        "plans": load_plans(),
        "weekday_plan": WEEKDAY_PLAN,
        "today": today.strftime("%Y-%m-%d"),
        "weekday": today.strftime("%A"),
    }


@app.post("/api/plans")
def save_plan(payload: PlanPayload):
    name = payload.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Plan name cannot be empty")
    items = [i.strip() for i in payload.items if i.strip()]
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO plans (plan_name, items, updated_at) VALUES (?, ?, ?) "
            "ON CONFLICT (plan_name) DO UPDATE SET items = excluded.items, "
            "updated_at = excluded.updated_at",
            (name, json.dumps(items, ensure_ascii=False),
             datetime.now(BEIJING_TZ).isoformat()),
        )
    return {"ok": True, "name": name}


@app.delete("/api/plans")
def delete_plan(name: str = Query(...)):
    with get_conn() as conn:
        cur = conn.execute("DELETE FROM plans WHERE plan_name = ?", (name,))
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Plan not found")
    return {"ok": True, "name": name}


@app.get("/", include_in_schema=False)
def index():
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/api/logs")
def get_logs(log_date: str = Query(..., description="Date in YYYY-MM-DD (Beijing)")):
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT schedule_type, item_name, is_completed FROM workout_logs "
            "WHERE log_date = ?",
            (log_date,),
        ).fetchall()
    return [dict(r) for r in rows]


@app.post("/api/toggle")
def toggle_item(payload: TogglePayload):
    is_completed = 1 if payload.is_completed else 0
    with get_conn() as conn:
        conn.execute(
            """
            INSERT INTO workout_logs (log_date, schedule_type, item_name, is_completed)
            VALUES (?, ?, ?, ?)
            ON CONFLICT (log_date, item_name)
            DO UPDATE SET
                schedule_type = excluded.schedule_type,
                is_completed = excluded.is_completed
            """,
            (payload.log_date, payload.schedule_type, payload.item_name, is_completed),
        )
    return {"ok": True, "log_date": payload.log_date, "item_name": payload.item_name,
            "is_completed": is_completed}


@app.get("/api/custom/logs")
def custom_logs(log_date: str = Query(..., description="Date in YYYY-MM-DD (Beijing)")):
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT item_name, is_completed FROM custom_items "
            "WHERE log_date = ? ORDER BY id",
            (log_date,),
        ).fetchall()
    return [dict(r) for r in rows]


@app.post("/api/custom/add")
def custom_add(payload: CustomItemPayload):
    item_name = payload.item_name.strip()
    if not item_name:
        raise HTTPException(status_code=400, detail="Item name cannot be empty")
    with get_conn() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO custom_items (log_date, item_name, created_at) "
            "VALUES (?, ?, ?)",
            (payload.log_date, item_name, datetime.now(BEIJING_TZ).isoformat()),
        )
    return {"ok": True, "log_date": payload.log_date, "item_name": item_name}


@app.post("/api/custom/toggle")
def custom_toggle(payload: CustomTogglePayload):
    is_completed = 1 if payload.is_completed else 0
    with get_conn() as conn:
        conn.execute(
            "UPDATE custom_items SET is_completed = ? "
            "WHERE log_date = ? AND item_name = ?",
            (is_completed, payload.log_date, payload.item_name),
        )
    return {"ok": True, "item_name": payload.item_name, "is_completed": is_completed}


@app.delete("/api/custom")
def custom_delete(log_date: str = Query(...), item_name: str = Query(...)):
    with get_conn() as conn:
        conn.execute(
            "DELETE FROM custom_items WHERE log_date = ? AND item_name = ?",
            (log_date, item_name),
        )
    return {"ok": True, "log_date": log_date, "item_name": item_name}


@app.get("/api/meals/logs")
def meals_logs(log_date: str = Query(..., description="Date in YYYY-MM-DD (Beijing)")):
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT meal, item_name, is_completed FROM meal_items "
            "WHERE log_date = ? ORDER BY id",
            (log_date,),
        ).fetchall()
    return [dict(r) for r in rows]


@app.post("/api/meals/add")
def meals_add(payload: MealItemPayload):
    item_name = payload.item_name.strip()
    if not item_name:
        raise HTTPException(status_code=400, detail="Item name cannot be empty")
    with get_conn() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO meal_items (log_date, meal, item_name, created_at) "
            "VALUES (?, ?, ?, ?)",
            (payload.log_date, payload.meal, item_name, datetime.now(BEIJING_TZ).isoformat()),
        )
    return {"ok": True, "log_date": payload.log_date, "meal": payload.meal,
            "item_name": item_name}


@app.post("/api/meals/toggle")
def meals_toggle(payload: MealTogglePayload):
    is_completed = 1 if payload.is_completed else 0
    with get_conn() as conn:
        conn.execute(
            "UPDATE meal_items SET is_completed = ? "
            "WHERE log_date = ? AND meal = ? AND item_name = ?",
            (is_completed, payload.log_date, payload.meal, payload.item_name),
        )
    return {"ok": True, "item_name": payload.item_name, "is_completed": is_completed}


@app.delete("/api/meals")
def meals_delete(log_date: str = Query(...), meal: str = Query(...),
                 item_name: str = Query(...)):
    with get_conn() as conn:
        conn.execute(
            "DELETE FROM meal_items WHERE log_date = ? AND meal = ? AND item_name = ?",
            (log_date, meal, item_name),
        )
    return {"ok": True, "log_date": log_date, "meal": meal, "item_name": item_name}


@app.get("/api/export-logs")
def export_logs(api_key: str | None = Query(default=None)):
    if API_KEY and api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT log_date, schedule_type, item_name, is_completed "
            "FROM workout_logs ORDER BY log_date, id"
        ).fetchall()
    return [dict(r) for r in rows]


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=18000, reload=False)
