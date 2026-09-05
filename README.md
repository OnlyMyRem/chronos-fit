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
| 身体数据 | 体重 / 体脂选填，历史曲线可切换 1 周 / 2 周 / 30 / 60 / 90 天 / 全部（按最近 N 个**有记录的日子**取窗口，断档几天也不会把大半周切没），点圆点跳到当天记录；删除按钮右侧显示当前区间内的累计变化（降绿升红）与目标进度，目标体重 / 体脂支持 BMI 边界快选，并按当前所选时段的平均速度估算还需多久达成；设置里填身高后自动算 BMI 彩色徽章 |
| 日历 | 左侧常驻月视图，标记有打卡的日期，点任意日期回看 / 补记录 |
| 倒计时胶囊 | 右侧常驻，进入页面即全部从头自动开始，到点响铃自动重来；可新增、改名、改时长、暂停、删除，按账号保存 |
| 侧栏自由摆放 | 日历与倒计时面板可拖到任意位置，位置刷新不丢 |
| 数据导入导出 | 锻炼 / 三餐 / 身体数据按时间范围导出 JSON / CSV，也可从 CSV / Excel 导回，无损往返 |
| 账号体系 | 邮箱注册 / 登录，验证码走邮件，连续失败临时锁定；登录后可设语言、主题、身体信息 |
| 后台管理 | 管理员（配置 `auth.admin_emails`）可查看用户统计与列表，锁定 / 解锁账号、授予 / 收回管理员；密码只存哈希 |
| 中英双语 / 主题 | 右上角图标一键循环 护眼 / 浅色 / 深色 / 跟随系统，默认护眼；不登录也能换（偏好存本机），登录后写入账号、跨设备保留；语言同样一键切换 |

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

### 本地运行（源码）

需要 Python 3.10+，建议先建虚拟环境：

```bash
python -m venv .venv
source .venv/bin/activate     # Windows 用 .venv\Scripts\activate
pip install -e .
chronos-fit                   # 或 python -m chronos_fit
```

打开 <http://localhost:18000>。首次启动自动建表并写入默认计划与词条，数据库默认落在 `data/workout.db`。监听地址和端口可用 `--addr` / `--port` 覆盖（如 `chronos-fit --addr 127.0.0.1 --port 8080`），数据目录可用 `--data-dir` 指定（如 `chronos-fit --data-dir /home/user/chronos-fit/data`），不传则用配置里的值 / 当前目录下的 `data/`。

### 打包成 wheel 安装运行

```bash
./build_wheel.sh              # 产物：dist/chronos_fit-<版本>-py3-none-any.whl
pip install dist/chronos_fit-*.whl
```

装好后任意目录运行 `chronos-fit` 即可：前端资源随包安装，配置与数据库默认生成在工作目录的 `data/` 下，无需源码。要沿用旧目录里的数据就加 `--data-dir /path/to/old/data`（或设环境变量 `CHRONOSFIT_DATA_DIR`），配置查找、相对路径的 SQLite 文件都跟着它走。

### 发布到 PyPI

PyPI 项目名为 **chronos-fit**（导入名 `chronos_fit`，命令 `chronos-fit`）。在 pypi.org 注册账号并创建 API token 后，手工分步执行：

```bash
pip install twine
# 1. 改 chronos_fit/__init__.py 里的 __version__（PyPI 永不允许覆盖同一版本号）
# 2. 构建 wheel（改完版本号再构建）
./build_wheel.sh
# 3. 校验并上传
python -m twine check dist/*
twine upload dist/*           # 提示 Username 填 __token__，Password 填 token
```

发布成功后任意机器 `pip install chronos-fit` 即可。

## 部署

### systemd（裸机）

两种装法，装好后都提供 `chronos-fit` 命令：

```bash
# 方式一：直接从 PyPI 安装，不需要源码（推荐）
mkdir -p /opt/chronos-fit && cd /opt/chronos-fit
python -m venv .venv
.venv/bin/pip install chronos-fit

# 方式二：拉源码可编辑安装（想改代码或用未发布版本时，改完代码重启即生效）
git clone <repo-url> /opt/chronos-fit && cd /opt/chronos-fit
python -m venv .venv
.venv/bin/pip install -e .
```

两种装法都把下面的单元写到 `/etc/systemd/system/chronosfit.service`，按装法选一份：

**方式一（whl 安装）**：部署目录无源码，数据默认生成在 `/opt/chronos-fit/data/`；沿用旧数据目录就加 `--data-dir`（不需要可去掉），改端口同理加 `--addr` / `--port`。

```ini
[Unit]
Description=ChronosFit dashboard
After=network.target

[Service]
WorkingDirectory=/opt/chronos-fit
ExecStart=/opt/chronos-fit/.venv/bin/chronos-fit --data-dir /home/admin/chronos-fit/data
Restart=always

[Install]
WantedBy=multi-user.target
```

**方式二（源码安装）**：`git pull` 更新代码后重启服务即可，数据默认落在仓库的 `data/` 下。

```ini
[Unit]
Description=ChronosFit dashboard
After=network.target

[Service]
WorkingDirectory=/opt/chronos-fit
ExecStart=/opt/chronos-fit/.venv/bin/chronos-fit
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now chronosfit
```

前面挂 Nginx 反向代理即可对外提供 HTTPS。

**更新到新版本**：换程序本体 + 重启服务即可，表结构在启动时自动升级，命令见下文「更新到新版本」。

### Docker

```bash
docker compose up -d --build
```

镜像内 `pip install chronos-fit` 从 PyPI 取包，取不到时自动回退到构建上下文里的 `dist/*.whl`——离线或尚未发布时先 `./build_wheel.sh` 再构建即可，也可用 `--build-arg CHRONOSFIT_VERSION=x.y.z` 锁版本。配置与 SQLite 都在 `./data`（bind mount `./data:/app/data`），不随容器重建丢失；容器首次启动自动从模板生成配置。MySQL 两种接法：

- **外部 MySQL**：`.env` 里设 `DATABASE_URL=mysql+pymysql://user:密码@host.docker.internal:3306/chronosfit?charset=utf8mb4`（`host.docker.internal` 指向宿主机，远程机器换成内网 IP）。
- **compose 自带**：`docker compose --profile mysql up -d --build`，并用 `.env` 设好 `DATABASE_URL`。

## 更新到新版本

表结构在每次启动时自动升级（见「从旧版本升级」），所以升级只有两步：换程序、重启服务。先 `stop` 再装，避免进程正握着被替换的文件。

```bash
# 裸机 systemd（whl 安装）
sudo systemctl stop chronosfit
cd /opt/chronos-fit && sudo .venv/bin/pip install -U chronos-fit -i https://pypi.org/simple/
sudo systemctl start chronosfit
systemctl status chronosfit        # 确认已起来；启动日志看 journalctl -u chronosfit -n 20
```

- 锁版本：把 `chronos-fit` 写成 `chronos-fit==x.y.z`。
- 官方源 `-i https://pypi.org/simple/`：国内镜像（阿里云等）同步新包常有几小时延迟，不加会报 `Could not find a version`。
- 源码安装（`pip install -e .`）：中间一行换成 `cd /opt/chronos-fit && git pull`，只有 `pyproject.toml` 的依赖变了才需要再跑一次 `sudo .venv/bin/pip install -e .`。
- Docker：`docker compose up -d --build` 即可，镜像内 pip 自动取最新版；锁版本加 `--build-arg CHRONOSFIT_VERSION=x.y.z`，镜像源取不到包时先在仓库执行 `./build_wheel.sh`，构建会自动回退用本地 `dist/*.whl`。

## 从旧版本升级

无需任何手工操作，直接启动新版本即可：

- **数据库自动接管**：目标库文件不存在而项目根有旧版 `workout.db` 时，启动时自动复制到 `data/workout.db`；旧文件保留为备份，确认数据无误后可自行删除。
- **表结构自动升级**：建缺失的表、补缺失的列（如 `users.theme`、`users.is_admin`）、修正索引格式，均在每次启动时自动完成（`chronos_fit/bootstrap.py`），SQLite 与 MySQL 通用；带星期前缀的旧默认计划会自动改名，打卡记录一并跟上。
- 启动命令由 `uvicorn main:app` 改为 `chronos-fit`（或 `python -m chronos_fit`）；包名由 `backend` 改为 `chronos_fit`，uvicorn 用户相应改为 `uvicorn chronos_fit.main:app`。
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
├── chronos_fit/          # Python 包：FastAPI 后端 + 前端静态资源，随 wheel 一起安装
├── data/                 # 运行时目录：config.yaml、SQLite 数据库、配置模板
├── pyproject.toml        # 打包配置：依赖、版本号、chronos-fit 命令
├── build_wheel.sh        # 一键构建 wheel 到 dist/
├── Dockerfile            # 镜像构建（Python 3.12 slim，PyPI 装包、本地 wheel 兜底）
├── docker-compose.yml    # 编排：应用 + 可选 MySQL（profile）
├── docker-entrypoint.sh  # 容器入口：首次启动写出配置模板
├── .env.example          # Docker 环境变量模板
└── README.md             # 本文档
```
