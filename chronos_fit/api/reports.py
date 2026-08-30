"""Read-only reports: calendar dots and the history export."""

from __future__ import annotations

import csv
import io
import re
from datetime import date, datetime, timedelta

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy import distinct, select
from sqlalchemy.orm import Session

from ..models import BodyLog, CustomItem, MealItem, WorkoutLog
from ..services.time_utils import now_bj, now_iso
from .deps import AppConfig, CurrentUid, DbSession

router = APIRouter(tags=["reports"])

DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")
EXPORT_FORMATS = {"json", "csv"}
MEAL_LABELS_CN = {"breakfast": "早餐", "lunch": "午餐", "dinner": "晚餐"}
CSV_HEADER = [
    "类型", "日期", "计划", "餐次", "项目", "已完成",
    "目标值", "当前值", "单位", "体重", "体脂",
]


def _completed_dates(session: DbSession, model, uid: int, month: str) -> list[str]:
    """Dates in ``month`` (YYYY-MM) where this table holds a checked-in item."""
    rows = session.scalars(
        select(distinct(model.log_date)).where(
            model.user_id == uid,
            model.log_date.like(f"{month}%"),
            model.is_completed == 1,
        )
    ).all()
    return list(rows)


@router.get("/api/logs/calendar")
def calendar_logs(session: DbSession, uid: CurrentUid, month: str = Query(...)):
    dates = set()
    for model in (WorkoutLog, CustomItem, MealItem):
        dates.update(_completed_dates(session, model, uid, month))
    return {"dates": sorted(dates)}


@router.get("/api/logs/streak")
def checkin_streak(session: DbSession, uid: CurrentUid):
    """打卡统计：连续天数、历史最长、累计天数（供日历的「累计打卡」展示）。

    连续天数以「今天或昨天」为锚点：今天还没打卡时不算断，这样白天查看日历
    不会看到 streak 突然归零。
    """
    dates: set[str] = set()
    for model in (WorkoutLog, CustomItem, MealItem):
        dates.update(
            session.scalars(
                select(distinct(model.log_date)).where(
                    model.user_id == uid, model.is_completed == 1
                )
            ).all()
        )

    total = len(dates)
    best = current = 0
    run = 0
    prev = None
    for day in sorted(_parse_date(d) for d in dates):
        run = run + 1 if prev and (day - prev).days == 1 else 1
        prev = day
        best = max(best, run)

    today = now_bj().date()
    anchor = today if today.isoformat() in dates else today - timedelta(days=1)
    while anchor.isoformat() in dates:
        current += 1
        anchor -= timedelta(days=1)

    return {"current": current, "best": best, "total": total}


def _parse_date(value: str) -> date:
    return datetime.strptime(value, "%Y-%m-%d").date()


def _check_date(value: str, label: str) -> str:
    if not DATE_PATTERN.match(value):
        raise HTTPException(400, f"{label}需为 YYYY-MM-DD 格式")
    return value


def _rows_in_range(session: Session, model, uid: int, start: str, end: str) -> list:
    stmt = select(model).where(model.user_id == uid)
    if start:
        stmt = stmt.where(model.log_date >= start)
    if end:
        stmt = stmt.where(model.log_date <= end)
    return list(session.scalars(stmt.order_by(model.log_date, model.id)).all())


def collect_history(
    session: Session, uid: int, start: str, end: str
) -> tuple[list[WorkoutLog], list[CustomItem], list[MealItem], list[BodyLog]]:
    return (
        _rows_in_range(session, WorkoutLog, uid, start, end),
        _rows_in_range(session, CustomItem, uid, start, end),
        _rows_in_range(session, MealItem, uid, start, end),
        _rows_in_range(session, BodyLog, uid, start, end),
    )


def history_as_json(workouts, customs, meals, bodies, start: str, end: str) -> dict:
    return {
        "导出时间": now_iso(),
        "起始日期": start or None,
        "结束日期": end or None,
        "锻炼记录": [
            {
                "日期": r.log_date,
                "计划": r.schedule_type,
                "项目": r.item_name,
                "已完成": bool(r.is_completed),
            }
            for r in workouts
        ],
        "自定义项目": [
            {
                "日期": r.log_date,
                "项目": r.item_name,
                "已完成": bool(r.is_completed),
                "目标值": r.target_value,
                "当前值": r.current_value,
                "单位": r.target_unit,
            }
            for r in customs
        ],
        "一日三餐": [
            {
                "日期": r.log_date,
                "餐次": MEAL_LABELS_CN.get(r.meal, r.meal),
                "项目": r.item_name,
                "已完成": bool(r.is_completed),
            }
            for r in meals
        ],
        "身体数据": [
            {"日期": r.log_date, "体重": r.weight, "体脂": r.body_fat} for r in bodies
        ],
    }


def history_as_csv(workouts, customs, meals, bodies) -> str:
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(CSV_HEADER)
    for r in workouts:
        writer.writerow(
            ["锻炼记录", r.log_date, r.schedule_type, "", r.item_name,
             "是" if r.is_completed else "否", "", "", "", "", ""]
        )
    for r in customs:
        writer.writerow(
            ["自定义项目", r.log_date, "", "", r.item_name,
             "是" if r.is_completed else "否",
             r.target_value, r.current_value, r.target_unit, "", ""]
        )
    for r in meals:
        writer.writerow(
            ["一日三餐", r.log_date, "", MEAL_LABELS_CN.get(r.meal, r.meal), r.item_name,
             "是" if r.is_completed else "否", "", "", "", "", ""]
        )
    for r in bodies:
        writer.writerow(
            ["身体数据", r.log_date, "", "", "", "", "", "", "",
             r.weight if r.weight is not None else "",
             r.body_fat if r.body_fat is not None else ""]
        )
    # Excel only reads UTF-8 CSV when the file opens with a BOM.
    return "\ufeff" + buffer.getvalue()


@router.get("/api/export")
def export_history(
    session: DbSession,
    uid: CurrentUid,
    cfg: AppConfig,
    start: str | None = Query(default=None),
    end: str | None = Query(default=None),
    format: str = Query(default="json"),
    api_key: str | None = Query(default=None),
):
    """Everything the user logged between two dates, as JSON or Excel-ready CSV."""
    if cfg.auth.secret_key and api_key != cfg.auth.secret_key and not uid:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")
    if format not in EXPORT_FORMATS:
        raise HTTPException(400, "format 仅支持 json 或 csv")
    start = _check_date(start, "起始日期") if start else ""
    end = _check_date(end, "结束日期") if end else ""
    if start and end and start > end:
        raise HTTPException(400, "起始日期不能晚于结束日期")

    workouts, customs, meals, bodies = collect_history(session, uid, start, end)
    if format == "csv":
        text = history_as_csv(workouts, customs, meals, bodies)
        filename = f"chronosfit_{start or 'all'}_{end or 'all'}.csv"
        return Response(
            content=text,
            media_type="text/csv; charset=utf-8",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )
    return history_as_json(workouts, customs, meals, bodies, start, end)
