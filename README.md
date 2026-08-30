# ChronosFit

一个自托管的北京时间 Dashboard：全屏数字时钟 + 每日锻炼打卡 + 三餐记录 + 体重体脂曲线 + 右侧常驻倒计时胶囊，数据保存在自己的 SQLite 或 MySQL 里。后端 FastAPI + SQLAlchemy 2.0，前端零构建（原生 HTML/CSS/JS）。

## 功能

| 模块 | 说明 |
| --- | --- |
| 数字时钟 | 日期 / 星期 / 时分秒，固定北京时间 `UTC+8`，一键全屏当屏保 |
| 锻炼计划 | 计划可增删改，可按星期绑定、每周自动切换；内置 4 套默认计划 |
| 打卡 | 勾选即时保存、自动划掉变灰；同一天同一动作 Upsert 不重复 |
| 自定义项目 | 在计划里临时加动作，支持目标值 / 当前值 / 单位（如 俯卧撑 20 个） |
| 三餐记录 | 早 / 中 / 晚三列，每列默认推荐最常记录的 3 样，跟随所选日期变化 |
| 身体数据 | 体重 / 体脂选填，历史曲线可切换区间、点圆点跳到当天记录；设置里填身高后自动算 BMI 彩色徽章 |
| 日历 | 左侧常驻月视图，标记有打卡的日期，点任意日期回看 / 补记录 |
| 倒计时胶囊 | 右侧常驻，到点响铃自动重来；可新增、改名、改时长、暂停、删除，按账号保存 |
| 侧栏自由摆放 | 日历与倒计时面板可拖到任意位置，位置刷新不丢 |
| 数据导入导出 | 锻炼 / 三餐 / 身体数据按时间范围导出 JSON / CSV，也可从 CSV / Excel 导回，无损往返 |
| 账号体系 | 邮箱注册 / 登录，验证码走邮件，连续失败临时锁定；登录后可设语言、主题、身体信息 |
| 后台管理 | 管理员（配置 `auth.admin_emails`）可查看用户统计与列表，锁定 / 解锁账号、授予 / 收回管理员；密码只存哈希 |
| 中英双语 / 日夜主题 | 一键切换，偏好写入账号、跨设备保留；访客默认跟随系统明暗 |

不登录也能用：数据写在 `user_id = 0` 下（部分存浏览器 localStorage），适合单机自用；注册后各账号数据互相隔离。

## 使用方法

### 配置

复制模板按需修改（`config.yaml` 已被 gitignore）：

```bash
cp data/config.example.yaml data/config.yaml
```

配置优先级：**环境变量 > `data/config.yaml` > 内置默认值**，零配置也能启动（SQLite + 邮件开发者模式）。改完配置需**重启服务**才生效。

- **数据库**：只由 `database.url` 决定，一行切换。MySQL 需先手工建库（`CREATE DATABASE chronosfit CHARACTER SET utf8mb4`），表由启动时自动创建。

  ```yaml
  database:
    url: sqlite:///./data/workout.db
    # url: mysql+pymysql://user:password@127.0.0.1:3306/chronosfit?charset=utf8mb4
  ```

- **邮箱（验证码）**：填 `smtp:` 的 `host / port / user / password`，QQ 邮箱用 SMTP 授权码而非登录密码。任一留空则走**开发者模式**：验证码直接显示在页面弹窗和服务端日志，不真实发信，适合本地自测。生产建议用 `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_FROM` 环境变量注入。

### 本地运行

```bash
pip install -r requirements.txt
python -m backend.main
```

打开 <http://localhost:18000>。首次启动自动建表并写入默认计划与词条，数据库默认落在 `data/workout.db`。

## 部署

### systemd（裸机）

`/etc/systemd/system/chronosfit.service`：

```ini
[Unit]
Description=ChronosFit dashboard
After=network.target

[Service]
WorkingDirectory=/opt/chronos-fit
Environment="CHRONOSFIT_API_KEY=your-secret-key"
ExecStart=/opt/chronos-fit/.venv/bin/python -m backend.main
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now chronosfit
```

前面挂 Nginx 反向代理即可对外提供 HTTPS。

### Docker

```bash
docker compose up -d --build
```

配置与 SQLite 都在 `./data`（bind mount `./data:/app/data`），不随容器重建丢失；容器首次启动自动从模板生成配置。MySQL 两种接法：

- **外部 MySQL**：`.env` 里设 `DATABASE_URL=mysql+pymysql://user:密码@host.docker.internal:3306/chronosfit?charset=utf8mb4`（`host.docker.internal` 指向宿主机，远程机器换成内网 IP）。
- **compose 自带**：`docker compose --profile mysql up -d --build`，并用 `.env` 设好 `DATABASE_URL`。

## 从旧版本升级

无需任何手工操作，直接启动新版本即可：

- **数据库自动接管**：目标库文件不存在而项目根有旧版 `workout.db` 时，启动时自动复制到 `data/workout.db`；旧文件保留为备份，确认数据无误后可自行删除。
- **表结构自动升级**：建缺失的表、补缺失的列（如 `users.theme`、`users.is_admin`）、修正索引格式，均在每次启动时自动完成（`backend/bootstrap.py`），SQLite 与 MySQL 通用；带星期前缀的旧默认计划会自动改名，打卡记录一并跟上。
- 启动命令由 `uvicorn main:app` 改为 `python -m backend.main`（或 `uvicorn backend.main:app`）。
- 配置文件统一为 `data/config.yaml`；旧的项目根 `config.yaml` 仍会被读取，兼容老部署。

## 备份

```bash
# SQLite：直接拷文件（服务停止时最稳妥）
cp data/workout.db backup/workout-$(date +%F).db

# MySQL
docker compose exec mysql sh -c 'mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" chronosfit' > backup.sql
```

## API

交互文档（Swagger）：<http://localhost:18000/docs>。所有写接口以 Cookie 识别用户，未登录归入 `user_id = 0`。

## 目录结构

```
chronos-fit/
├── backend/              # FastAPI 后端：路由、模型、启动时自动迁移表结构与播种默认数据
├── frontend/             # 零构建前端（index.html / style.css / app.js），由后端挂载到 /static
├── data/                 # 运行时目录：config.yaml、SQLite 数据库、配置模板
├── Dockerfile            # 镜像构建（Python 3.12 slim）
├── docker-compose.yml    # 编排：应用 + 可选 MySQL（profile）
├── docker-entrypoint.sh  # 容器入口：首次启动写出配置模板
├── .env.example          # Docker 环境变量模板
├── requirements.txt      # Python 依赖清单
└── README.md             # 本文档
```
