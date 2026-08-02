# ChronosFit

极简、现代的网页 Dashboard：全屏数字时钟屏保 + 每日运动计划打卡。打卡数据持久化存储于 SQLite，并提供对外 API 供数据分析 / 导出。

## 功能

- **全屏数字时钟**：实时显示日期、星期、北京时间（固定 `Asia/Shanghai`，精确到秒）。
- **一键全屏**：基于 HTML5 `requestFullscreen` API，适合平板 / 备用屏常亮屏保。
- **预设运动计划**：内置 4 套计划（周二 / 周四 / 周六 / 周日），页面加载时按当天自动选中；当日无计划则默认选中最近的计划。
- **实时打卡**：勾选后自动加删除线变灰，并通过 Fetch API 实时保存到 SQLite（Upsert，同一天同一动作不产生重复数据）。
- **导出 API**：`GET /api/export-logs` 返回 JSON 打卡历史，支持可选 API Key 校验。

## 快速开始

```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

访问 http://localhost:8000

首次启动会自动生成 `workout.db`。

## 设置 API Key（可选）

若需要保护导出接口，设置环境变量后重启服务：

```bash
export CHRONOSFIT_API_KEY="your-secret-key"
uvicorn main:app --host 0.0.0.0 --port 8000
```

之后访问导出接口需携带 key：

```
GET /api/export-logs?api_key=your-secret-key
```

未设置环境变量时导出接口可直接访问。

## API 一览

| Method | Path                    | 说明                                        |
| ------ | ----------------------- | ------------------------------------------- |
| GET    | `/api/plans`            | 预设计划、星期映射、当前北京时间            |
| GET    | `/api/logs?log_date=YYYY-MM-DD` | 某日打卡状态                    |
| POST   | `/api/toggle`           | 打卡 / 取消打卡（Upsert）                   |
| GET    | `/api/export-logs`      | 导出全部打卡历史（JSON，可加 `api_key`）    |

`POST /api/toggle` 请求体：

```json
{
  "log_date": "2026-08-02",
  "schedule_type": "Tuesday - Upper Body Power",
  "item_name": "4 sets of Pull-ups (max)",
  "is_completed": true
}
```

## 数据表结构

| 列名          | 类型 | 说明                          |
| ------------- | ---- | ----------------------------- |
| id            | INT  | 主键，自增                    |
| log_date      | TEXT | 打卡日期 `YYYY-MM-DD`         |
| schedule_type | TEXT | 计划类型                      |
| item_name     | TEXT | 动作名称                      |
| is_completed  | INT  | 0 / 1                         |

唯一约束 `(log_date, item_name)`，保证 Upsert 语义。

## 数据分析示例（Pandas）

```python
import pandas as pd

df = pd.read_json("http://localhost:8000/api/export-logs?api_key=your-secret-key")
df["log_date"] = pd.to_datetime(df["log_date"])
print(df.groupby("schedule_type")["is_completed"].mean())
```

## 部署（Ubuntu/Debian + systemd 示例）

`/etc/systemd/system/chronosfit.service`：

```ini
[Unit]
Description=ChronosFit dashboard
After=network.target

[Service]
WorkingDirectory=/opt/chronos-fit
Environment="CHRONOSFIT_API_KEY=your-secret-key"
ExecStart=/opt/chronos-fit/.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now chronosfit
```

配合 Nginx 反向代理即可对外提供 HTTPS 访问。

## 项目结构

```
ChronosFit/
├── main.py              # FastAPI 后端服务入口及路由定义
├── requirements.txt     # Python 依赖
├── workout.db           # SQLite 数据库文件（自动生成）
├── static/              # 前端静态资源
│   ├── index.html
│   ├── style.css
│   └── app.js
└── README.md
```
