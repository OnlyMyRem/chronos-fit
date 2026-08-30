# ChronosFit

一个自托管的北京时间 Dashboard：全屏数字时钟 + 每日锻炼打卡 + 三餐记录 + 体重体脂曲线 + 右侧常驻倒计时胶囊，数据保存在自己的 SQLite 或 MySQL 里。后端 FastAPI + SQLAlchemy 2.0，前端零构建（原生 HTML/CSS/JS）。

---

## 一、项目说明

### 功能

| 模块 | 说明 |
| --- | --- |
| 数字时钟 | 日期 / 星期 / 时分秒，居中排布，固定北京时间 `UTC+8`，可一键全屏当屏保 |
| 锻炼计划 | 计划可增删改，可按星期绑定（每周自动切换）；内置 4 套默认计划只按名字区分（`Upper Body Power` 等），星期只记在绑定里；周二 / 周四 / 周六 / 周日各有计划，其余日子沿用前一天的，四套默认循环铺满一周 |
| 打卡 | 勾选即时保存，自动划掉变灰；同一一天同一动作 Upsert 不产生重复 |
| 自定义项目 | 在计划里临时加动作，支持目标值 / 当前值 / 单位（如 俯卧撑 20 个） |
| 运动词条 | 计划编辑弹窗里的横向气泡，点一下加入计划项目（保存后才同步到页面），可新增自定义词条；计划项目与词条各自带「清空」和「恢复默认」 |
| 悬挂顶栏 | 常驻页面最上方，滚动也不动；右侧依次是全屏、数据（导入 / 导出下拉）、主题、中英文与头像按钮。大时钟划走后，顶栏里淡入一枚紧凑的日期 · 星期 · 时分秒 |
| 两页滑动 | 第 1 页锻炼计划 + 三餐，第 2 页身体数据；大时钟头两页共用、固定在顶部，翻页时只有下方内容横向滑动（宽屏为滑动轨道，窄屏退回显隐）。滚轮 / 触摸板一划即翻页，浏览器滚动条被刻意隐藏；左侧常驻日历栏与右侧倒计时胶囊遥相呼应，窄屏下两者退回正文流 |
| 三餐记录 | 早 / 中 / 晚三列，固定在身体数据上方（身体历史会拉得很长），跟随所选日期变化；每列默认列出你最常记录的 3 样，勾一下即记为今日已完成，不想要可点 ✕ 隐藏 |
| 身体数据 | 体重 + 体脂，两个输入框均为选填（留空表示不记该项），内联 SVG 历史曲线、区间切换（30/90/全部）；点曲线上的圆点即跳到那天的记录，与录入框、删除联动；没有记录时图表就是一片空白表格线，不写提示语；下方历史逐行可改——填数值点 ✓（或回车）即保存，留空表示该项不动，✕ 删除整天记录 |
| BMI | 设置里填了身高后，按当前查看日期的体重自动计算，依中国成人标准分四档显示彩色徽章：偏低（<18.5 蓝）/ 标准（18.5–23.9 绿）/ 超重（24.0–27.9 橙）/ 肥胖（≥28 红） |
| 日历 | 左侧常驻月视图，◀ ▶ 翻月、「今天」一键回到当下；标记有打卡的日期，点任意日期回看 / 补记录，未来日期只读 |
| 弹窗虚化 | 计划编辑、登录、导出、设置四个弹窗一律用原生 `<dialog>`，打开时背景加一层毛玻璃浓雾（深浅主题各一档），页面上只留下当前这一件事 |
| 倒计时胶囊 | 页面右侧常驻胶囊，进页面即从 2 分钟 / 5 分钟开始走，到点响铃并自动重来；可新增、改名、改时长、暂停、删除，每个账号各存各的。点 ✎ 编辑时，对应的胶囊就地拉长，编辑表单直接显示在这只胶囊里面；新增计时器则多出一只虚线草稿胶囊承载表单，到点脉冲也不会撑出横向滚动条 |
| 侧栏自由摆放 | 日历（左）与倒计时（右）两个常驻侧栏可随意拖动：按住面板头部（标题旁的 ⠿ 抓手）拖到哪里松手就固定在哪，位置保存在浏览器里、刷新不丢；若落到对侧面板上（目标面板高亮提示）则互相交换回标准布局。宽屏浮动布局生效，窄屏退回正文流时自动禁用 |
| 提示音 | 三音叮咚 / 清铃 / 电子蜂鸣（本地合成，离线可用）+ 两个在线音效，编辑气泡里可试听 |
| 中英双语 | 右上角一键切换，语言写入账号（登录后跨设备保留） |
| 日夜主题 | 深浅双主题，全部表单控件随主题变色。未登录访客**默认跟随系统明暗**（`prefers-color-scheme`，系统切换时实时跟随）；登录用户可在设置里三选一（跟随系统 / 深色 / 浅色），偏好写入账号、跨设备保留 |
| 账号体系 | 邮箱注册 / 登录，验证码走邮件，密码连续错误临时锁定；登录后右上角只剩一枚圆形头像，点开是「设置」和「退出」两项菜单，设置里可改语言、主题、密码，并填写身体信息（性别 / 身高，用于 BMI）；管理员账号（见配置 `auth.admin_emails`）在设置里多一枚「后台管理」入口 |
| 后台管理 | 管理员可查看注册用户统计（总数 / 今日新增 / 管理员数 / 锁定数）与用户列表（邮箱、注册时间、角色状态、密码哈希），并可直接锁定 / 解锁账号、授予 / 收回管理员权限；密码只存哈希，后台同样看不到明文 |
| 数据导出 | 顶栏「数据」按钮里打开导出弹窗，选时间范围（近 7 / 30 天、本月、全部或自定义起止），一键下载 JSON 或 CSV：锻炼打卡 + 自定义项目 + 三餐 + 身体数据全在里面。CSV 带 BOM，Excel 双击即开 |
| 数据导入 | 「数据」按钮里点「导入数据…」，选一个 `.csv` 或 `.xlsx` 文件，把锻炼记录、自定义项目、三餐、体重体脂一次性导回（与导出格式完全对齐，导出再导入是无损往返）；认不出的行会被跳过并计数，不会让整个导入失败 |

### 未登录能用吗

能。不登录时数据写在 `user_id = 0` 这一行下（三餐 / 身体数据 / 身体信息存在浏览器 localStorage），适合单机自用；注册后各账号数据互相隔离，计划与词条按账号保存。倒计时栏在未登录时只显示内置的 2 / 5 分钟两只胶囊（只读，不落库），点「＋」会提示先登录。三餐推荐在未登录时改从本地最近 14 天的数据里取；导出弹窗则直接提示先登录——游客记录只存在浏览器里，服务端无从导出。

### 目录结构

版本库中的全部文件：

```
chronos-fit/
├── backend/                 # 后端（Python 包）
│   ├── __init__.py          # 包标记
│   ├── main.py              # 入口：python -m backend.main
│   ├── app.py               # 应用工厂：路由装配、静态资源、启动钩子
│   ├── config.py            # config.yaml + 环境变量 → Config 数据类
│   ├── models.py            # 全部表定义（SQLAlchemy 2.0 声明式）
│   ├── db.py                # 引擎 / 会话 / 跨方言 upsert 助手
│   ├── bootstrap.py         # 启动时建表、补列、修索引、写种子数据
│   ├── seeds.py             # 默认计划、默认词条与默认倒计时（唯一定义处）
│   ├── api/                 # 路由层，按业务域拆分
│   │   ├── __init__.py      # 包标记
│   │   ├── deps.py          # 依赖注入 + 请求体模型
│   │   ├── auth.py          # 注册 / 登录 / 验证码 / 锁定 / 身体信息
│   │   ├── admin.py         # 后台管理：统计、用户列表、管理员 / 锁定管理
│   │   ├── plans.py         # 计划增删改查
│   │   ├── workouts.py      # 打卡与自定义项目
│   │   ├── meals.py         # 三餐
│   │   ├── body.py          # 体重体脂
│   │   ├── ticker.py        # 运动词条
│   │   ├── metronomes.py    # 倒计时胶囊（含首次登录时的默认播种）
│   │   ├── reports.py       # 日历标记与导出
│   │   └── imports.py       # CSV / Excel 导入（导出的逆向）
│   └── services/            # 与 HTTP 无关的能力
│       ├── __init__.py      # 包标记
│       ├── time_utils.py    # 北京时间助手
│       ├── security.py      # 口令散列、会话令牌、Cookie
│       └── email_service.py # 验证码投递（SMTP / 开发者模式）
├── frontend/                # 前端静态资源（由后端挂载到 /static）
│   ├── index.html           # 页面结构（两页滑动 + 共用时钟头）
│   ├── style.css            # 全部样式（深浅主题、CSS 变量）
│   └── app.js               # 全部交互逻辑（零依赖原生 JS）
├── data/                    # 运行时数据与配置（数据库 / config.yaml / 模板）
│   ├── .gitkeep             # 占位，保证空目录进版本库
│   └── config.example.yaml  # 配置模板，逐项带注释
├── Dockerfile               # 镜像构建（Python 3.12 slim）
├── docker-compose.yml       # 编排：应用 + 可选 MySQL（profile）
├── docker-entrypoint.sh     # 容器入口：首次启动把配置模板写进 /app/data
├── .env.example             # Docker 环境变量模板（密钥用）
├── .dockerignore            # 构建镜像时排除 data/、venv 等
├── .gitignore               # 忽略 data/ 下的运行时文件、config.yaml、.env
├── .gitattributes           # 统一换行符与文本属性
├── requirements.txt         # Python 依赖清单
└── README.md                # 本文档
```

---

## 二、使用说明

### 1. 本地跑起来

```bash
pip install -r requirements.txt
python -m backend.main
```

打开 <http://localhost:18000>。首次启动会自动建表并写入默认计划与词条，数据库文件默认落在 `data/workout.db`；账号第一次读取倒计时时会拿到一对 2 / 5 分钟的默认胶囊（只发一次，删掉就不会再回来）。

也可以用 uvicorn（便于热重载）：

```bash
uvicorn backend.main:app --host 0.0.0.0 --port 18000
```

### 2. 配置

复制模板按需修改，`config.yaml` 已被 gitignore，密码不会进版本库：

```bash
cp data/config.example.yaml data/config.yaml    # Windows PowerShell: Copy-Item data/config.example.yaml data/config.yaml
```

> **配置文件在哪**：本地直接运行（`python -m backend.main`）与 Docker 部署读的都是 **`data/config.yaml`**（Docker 里容器路径 `/app/data/config.yaml`，由 `./data:/app/data` 挂载映射；首次启动自动从模板生成，已存在则不覆盖）。配置、SQLite 数据库、模板都放在 `data/` 同一个目录里，不会再改错文件。改完配置要**重启服务**才生效（配置只在启动时读一次）：本地重启进程，Docker 执行 `docker compose restart chronosfit`。
>
> 为兼容旧版本，项目根目录的 `config.yaml` 仍会被读取（优先级低于 `data/config.yaml`），新部署请直接使用 `data/config.yaml`。

配置优先级：**环境变量 > `config.yaml` > 内置默认值**。查找 `config.yaml` 的顺序是 `CHRONOSFIT_CONFIG` 指向的路径 → `data/config.yaml` → 项目根 `config.yaml`（兼容旧部署）；都没有就用默认值直接启动（SQLite + 开发者模式邮箱），所以「零配置跑起来」是支持的。

#### 2.1 数据库（SQLite / MySQL 二选一）

只由 `database.url` 决定，改一行即可切换：

```yaml
database:
  # SQLite（默认）
  url: sqlite:///./data/workout.db

  # MySQL（先手工建库，表由程序启动时自动创建）
  # url: mysql+pymysql://user:password@127.0.0.1:3306/chronosfit?charset=utf8mb4
```

MySQL 建库语句：

```sql
CREATE DATABASE chronosfit CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

> 相对路径的 SQLite 文件一律按**项目根目录**解析，与你在哪个目录敲命令无关，避免误建一个空的数据库。

#### 2.2 邮箱服务器（验证码投递）

以 QQ 邮箱为例：

1. 网页登录 `mail.qq.com` → 设置 → 账号与安全 → 开启 **IMAP/SMTP 服务**；
2. 按提示验证后生成一枚 **授权码**（16 位字母）——填进配置的是授权码，不是 QQ 登录密码。Gmail 用「应用专用密码」，163/126 同理；
3. 填好下面三项并重启服务，即改为真实发信：

```yaml
smtp:
  host: smtp.qq.com
  port: 465              # 465 = SSL 直连；587 等其他端口会自动改用 STARTTLS
  user: 123456789@qq.com # SMTP 登录账号（用于连接认证）
  password: 你的SMTP授权码
  sender: ""             # 邮件发件人地址（From），一般与 user 相同；留空则等于 user
```

**留白会怎样**：`host` / `user` / `password` 任一为空 → 走**开发者模式**：不发邮件，验证码随接口返回并显示在前端弹窗，同时打印在服务端日志（`[ChronosFit][dev] code for ...`）。本地开发和自测就用这个模式。

生产环境建议用环境变量注入密码，不要写进文件：`SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_FROM`。

#### 2.3 其他可调项

```yaml
server:   { host: 0.0.0.0, port: 18000 }
auth:
  secret_key: ""          # 导出接口的可选访问密钥（CHRONOSFIT_API_KEY）
  session_days: 30        # 登录态有效期
  code_ttl_minutes: 10    # 验证码有效期
  resend_seconds: 60      # 同邮箱同用途的重发冷却
  max_login_failures: 5   # 连续失败多少次后临时锁定
  lockout_minutes: 15     # 临时锁定时长（分钟）
  admin_emails: []        # 后台管理员邮箱列表（见下文「后台管理」），环境变量 CHRONOSFIT_ADMIN_EMAILS（逗号分隔）可覆盖
database:
  echo_sql: false         # true = 打印每条 SQL，排查用
  pool_recycle_seconds: 3600   # MySQL 空闲超时前主动重连
```

### 3. 注册、登录与安全

- **注册**：Sign up → 填邮箱 + 密码（≥6 位）→ 获取验证码 → 填 6 位码。验证码 10 分钟有效，同一邮箱 60 秒内只能发一次。
- **登录**：只需邮箱 + 密码，登录态用 HttpOnly Cookie 维持 30 天。
- **锁定**：密码连续错 5 次 → 账号临时锁定 15 分钟，提示会写明还剩几次机会。
- **解锁 / 忘记密码**：登录框里点「忘记密码?」→ 用邮箱验证码设置新密码，成功后立即解除锁定。
- **改密码**：登录后点右上角头像 → 设置 → 填原密码与新密码。改成功同样会清掉锁定与失败计数。
- **后台管理**：把管理员邮箱写进配置 `auth.admin_emails`（列表，或环境变量 `CHRONOSFIT_ADMIN_EMAILS` 逗号分隔），重启后对应邮箱的账号即为管理员——设置弹窗里出现「后台管理」入口：注册用户统计（总数 / 今日新增 / 管理员数 / 锁定数）、用户列表（邮箱、注册时间、角色状态、密码哈希），支持授予 / 收回管理员、锁定 / 解锁账号。**密码始终只存 `salt:sha256` 哈希**，管理面板里展示的也是哈希而非明文，任何角色（包括管理员）都无法还原真实密码。启动时会自动把列表中的邮箱标记为管理员，注册时同样即时生效；从列表移除邮箱后，需重启并手动在后台收回其权限。
- 密码以 `salt:sha256` 形式存储，不保存明文；会话令牌是 64 位随机十六进制。

### 4. Docker 部署

```bash
cp .env.example .env                    # 可选，需要放密钥时才建
docker compose up -d --build
```

访问 <http://localhost:18000>。日志与停止：`docker compose logs -f`、`docker compose down`。

**数据不会随容器消失**，这是设计的核心：

| 内容 | 位置 | 挂载方式 |
| --- | --- | --- |
| SQLite 数据库 | `./data/workout.db` | bind mount `./data:/app/data` |
| 配置文件 | `./data/config.yaml` | 同上（首次启动自动从镜像内模板写入） |
| 配置模板 | `./data/config.example.yaml` | 同上（进版本库，clone 即自带） |
| MySQL 数据 | 命名卷 `mysql-data` | `docker compose down` 不会删，`down -v` 才会 |

容器第一次启动时，入口脚本会把镜像内的 `config.example.yaml` 复制成 `/app/data/config.yaml`（已存在则绝不覆盖），因此在宿主机上直接编辑 `data/config.yaml` 就能改配置，重建镜像也不丢。

#### 4.1 连容器外的 MySQL

宿主机装了 MySQL，容器要访问它 —— `docker-compose.yml` 已注入 `host.docker.internal:host-gateway`，在 `.env` 里写：

```bash
DATABASE_URL=mysql+pymysql://chronosfit:你的密码@host.docker.internal:3306/chronosfit?charset=utf8mb4
```

远程机器上的 MySQL 同理，把地址换成内网 IP 即可。

#### 4.2 用 compose 自带的 MySQL

```bash
docker compose --profile mysql up -d --build
```

并在 `.env` 里设 `DATABASE_URL=mysql+pymysql://chronosfit:chronosfit@mysql:3306/chronosfit?charset=utf8mb4`。
若应用比 MySQL 先起来，它会因连不上而退出，`restart: unless-stopped` 会自动重试到成功为止（`docker compose restart chronosfit` 也可以）。

#### 4.3 连宿主机上的 SQLite 文件

想把数据库文件放在宿主机某个固定位置以便备份：

```yaml
volumes:
  - /srv/chronos:/mnt/chronos
environment:
  DATABASE_URL: sqlite:////mnt/chronos/workout.db
```

> 提示：Docker Desktop 上把 SQLite 文件放在 bind mount 里，跨文件系统锁可能不稳。要跑 MySQL 请用 MySQL；只想稳定跑 SQLite，可把 `./data` 换成命名卷（代价是宿主机上不方便直接看文件）。

#### 4.4 邮箱配置（本地文件映射）

SMTP 配置和数据库一样走 `data/config.yaml`（模板见 `data/config.example.yaml`）—— 它随 `./data:/app/data` 一起映射在宿主机上，直接编辑 `data/config.yaml` 的 `smtp:` 段再 `docker compose restart` 即可，不必进容器、不必重建镜像：

```yaml
smtp:
  host: smtp.qq.com
  port: 465
  user: 123456789@qq.com
  password: 你的SMTP授权码
```

不想把密码写进文件时，改用 `.env` 注入环境变量（优先级更高）：`SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_FROM`。三项留空则保持开发者模式（验证码直接显示在页面上）。

### 5. systemd 部署（裸机）

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

### 6. 备份

```bash
# SQLite：直接拷文件（服务停止时最稳妥）
cp data/workout.db backup/workout-$(date +%F).db

# MySQL
docker compose exec mysql sh -c 'mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" chronosfit' > backup.sql
```

---

## 三、API 一览

所有写接口都以 Cookie 识别用户，未登录归入 `user_id = 0`。

### 账号

| Method | Path | 请求体 / 参数 |
| --- | --- | --- |
| POST | `/api/auth/send-code` | `{email, purpose}`，`purpose` 为 `register` \| `reset`；开发者模式额外返回 `dev_code` |
| POST | `/api/auth/register` | `{email, password, code, language?}` |
| POST | `/api/auth/login` | `{email, password}` |
| POST | `/api/auth/reset` | `{email, code, new_password}` |
| POST | `/api/auth/logout` | — |
| GET | `/api/auth/me` | — |
| POST | `/api/auth/password` | `{old_password, new_password}`，需登录；新密码 ≥6 位，原密码不符返回 400 |
| POST | `/api/auth/language` | `{language}`，`zh` \| `en` |
| POST | `/api/auth/theme` | `{theme}`，`system` \| `dark` \| `light`，需登录；持久化到账号，`/api/auth/me` 一并返回 |
| POST | `/api/auth/profile` | `{gender?, height_cm?}`，需登录；性别 `male` \| `female` \| null，身高 50–250 cm 或 null；用于 BMI 计算 |

### 后台管理（需管理员）

管理员身份：登录用户邮箱命中 `auth.admin_emails`（或环境变量 `CHRONOSFIT_ADMIN_EMAILS`）。非管理员一律 `403`。

| Method | Path | 请求体 / 参数 |
| --- | --- | --- |
| GET | `/api/admin/stats` | 返回 `{total, today_new, admins, locked}`（总数 / 今日新增 / 管理员数 / 锁定数） |
| GET | `/api/admin/users` | 用户列表（倒序）：`id, username, email, created_at, language, theme, is_admin, locked, failed_attempts, password_hash`（哈希而非明文） |
| POST | `/api/admin/users/{id}/toggle-admin` | 授予 / 收回管理员，不能操作自己 |
| POST | `/api/admin/users/{id}/lock` | 锁定账号（期间无法登录） |
| POST | `/api/admin/users/{id}/unlock` | 解锁并清空失败计数 |

### 计划与词条

| Method | Path | 请求体 / 参数 |
| --- | --- | --- |
| GET | `/api/plans` | 返回 `{plans, weekday_plan, default_plans, today, weekday}`（系统计划与本人计划已合并；`default_plans` 是 `seeds.py` 里的出厂项目，供弹窗「恢复默认」使用） |
| POST | `/api/plans` | `{name, items[], weekday?}`，需登录 |
| DELETE | `/api/plans?name=` | 需登录 |
| GET | `/api/ticker` | 系统词条 + 本人词条；点过「清空」的账号不再返回系统词条 |
| POST | `/api/ticker` | `{label, target_value?, target_unit?}`，需登录 |
| POST | `/api/ticker/reset` | `{mode}`，`mode` 为 `clear` \| `defaults`，需登录；返回重置后的词条列表 |
| DELETE | `/api/ticker?ticker_id=` | 只能删自己的词条 |

### 倒计时

| Method | Path | 请求体 / 参数 |
| --- | --- | --- |
| GET | `/api/metronomes` | 返回 `[{id, label, duration_sec, sound_key, enabled}]`；登录用户首次调用会自动播种 2 / 5 分钟两只（之后不再补）；未登录返回只读默认，`id` 为 0 |
| POST | `/api/metronomes` | `{duration_sec, label?, sound_key?, enabled?}`，需登录；`label` 留空则前端按时长命名 |
| PUT | `/api/metronomes` | `{id, duration_sec?, label?, sound_key?, enabled?}`，只改传入的字段；不是自己的 `id` 返回 404 |
| DELETE | `/api/metronomes?metronome_id=` | 需登录，只能删自己的 |

`duration_sec` 取值范围 1–3600，超出返回 400。默认时长与提示音定义在 `backend/seeds.py` 的 `DEFAULT_METRONOMES`。

### 打卡、三餐、身体数据

| Method | Path | 请求体 / 参数 |
| --- | --- | --- |
| GET | `/api/logs?log_date=YYYY-MM-DD` | 返回数组 |
| POST | `/api/toggle` | `{log_date, schedule_type, item_name, is_completed}` |
| GET | `/api/custom/logs?log_date=` | 返回数组 |
| POST | `/api/custom/add` | `{log_date, item_name, target_value?, target_unit?}` |
| POST | `/api/custom/toggle` | `{log_date, item_name, is_completed, current_value?}` |
| DELETE | `/api/custom?log_date=&item_name=` | — |
| GET | `/api/meals/logs?log_date=` | 返回数组 |
| GET | `/api/meals/recent?limit=3` | 该用户各餐最常记录的条目（按次数、再按最近使用排序），作为三餐列的默认推荐 |
| POST | `/api/meals/add` | `{log_date, meal, item_name}`，`meal` 为 `breakfast` \| `lunch` \| `dinner` |
| POST | `/api/meals/toggle` | `{log_date, meal, item_name, is_completed}` |
| DELETE | `/api/meals?log_date=&meal=&item_name=` | — |
| GET | `/api/body/history?days=0` | `days=0` 为全部；返回 `[{log_date, weight, body_fat}]` |
| POST | `/api/body` | `{log_date, weight?, body_fat?}`，只填一项不会抹掉另一项 |
| DELETE | `/api/body?log_date=` | — |

### 报表

| Method | Path | 说明 |
| --- | --- | --- |
| GET | `/api/logs/calendar?month=YYYY-MM` | 该月有打卡的日期，供日历打点 |
| GET | `/api/export?start=&end=&format=json\|csv` | 锻炼 + 自定义项目 + 三餐 + 身体数据。`start` / `end` 均为 `YYYY-MM-DD` 且可留空（留空即不限）；`csv` 直接以带 BOM 的附件下载。未登录时：实例配了 `auth.secret_key` 则需要 `?api_key=`，否则导出 `user_id = 0` 的数据 |
| POST | `/api/import` | multipart 上传 `file`（`.csv` / `.xlsx`），按导出格式逆向写回四张表并 Upsert 去重；返回 `{ok, imported:{workout,custom,meal,body}, skipped}`，认不出的行计入 `skipped` 而不报错 |

JSON 结构（中文键，便于直接丢给 AI 分析）：

```json
{
  "导出时间": "2026-08-28T07:08:14+08:00",
  "起始日期": "2026-08-01",
  "结束日期": "2026-08-28",
  "锻炼记录": [{"日期": "2026-08-28", "计划": "Full Body Burn", "项目": "40 min Run", "已完成": true}],
  "自定义项目": [{"日期": "2026-08-28", "项目": "飞鸟", "已完成": false, "目标值": 5, "当前值": 3, "单位": "个"}],
  "一日三餐": [{"日期": "2026-08-28", "餐次": "午餐", "项目": "米饭", "已完成": false}],
  "身体数据": [{"日期": "2026-08-28", "体重": 70.5, "体脂": 18.2}]
}
```

`POST /api/toggle` 示例：

```json
{
  "log_date": "2026-08-28",
  "schedule_type": "Upper Body Power",
  "item_name": "4 sets of Pull-ups (max)",
  "is_completed": true
}
```

### 用 Pandas 分析

```python
import io
import pandas as pd
import requests

# 带 BOM 的 CSV 一行一条记录，登录态换成 session 即可
raw = requests.get("http://localhost:18000/api/export", params={"format": "csv"}).content
df = pd.read_csv(io.BytesIO(raw), encoding="utf-8-sig")
done = df[df["类型"] == "锻炼记录"]
print(done.groupby("计划")["已完成"].apply(lambda s: (s == "是").mean()))
```

交互文档：<http://localhost:18000/docs>

---

## 四、数据表

建表与后续补列都在启动时自动完成（`backend/bootstrap.py`），SQLite 与 MySQL 通用。

| 表 | 用途 | 关键约束 |
| --- | --- | --- |
| `users` | 账号 | `username` 唯一；`email` 唯一（无邮箱时存 NULL，不存空串）；`failed_attempts` / `locked_until` 支撑锁定；`metronomes_seeded` 记录默认倒计时是否已发放；`ticker_cleared` 记录该账号是否清空过系统词条；`gender` / `height_cm` 为身体信息（BMI 输入项）；`theme` 为主题偏好（`system` / `dark` / `light`，默认 `system`，游客不受影响）；`is_admin` 为后台管理员标记（0 / 1） |
| `sessions` | 登录态 | `token` 主键 |
| `email_codes` | 验证码 | `email + purpose + id` 索引，只取最新一条 |
| `plans` | 计划 | `(plan_name, user_id)` 唯一；`items` 为 JSON 文本 |
| `ticker_items` | 运动词条 | `is_system = 1` 为系统词条，人人可见 |
| `metronomes` | 倒计时胶囊 | 按 `id` 定位，允许同名与留空名称（留空由前端按时长命名）；`label` 最长 40 字符 |
| `workout_logs` | 锻炼打卡 | `(user_id, log_date, item_name)` 唯一 → Upsert |
| `custom_items` | 自定义项目 | `(user_id, log_date, item_name)` 唯一 |
| `meal_items` | 三餐条目 | `(user_id, log_date, meal, item_name)` 唯一 |
| `body_logs` | 体重体脂 | `(user_id, log_date)` 唯一 |

所有时间戳按 `Asia/Shanghai`（固定 +08:00）以 ISO 文本存储，与旧版本数据库完全兼容；日期列统一为 `YYYY-MM-DD` 文本。

---

## 五、从旧版本升级

- `workout.db` 移到 `data/workout.db`：把旧文件放进 `data/` 即可，启动时自动补上新增列与索引（含把旧的 `users.email` 部分索引替换为 MySQL 兼容的普通唯一索引）。
- 启动方式由 `uvicorn main:app` 改为 `python -m backend.main`（或 `uvicorn backend.main:app`），默认端口 18000。
- 默认计划、运动词条与倒计时现在定义在 `backend/seeds.py`，改这里就能换种子数据；种子按名称幂等补齐，已存在的计划不会被覆盖。
- 旧库里带星期前缀的默认计划（`Tuesday - Upper Body Power` 等）会在启动时**就地改名**为不带前缀的新名字，打卡记录里的计划标签一并跟上，不会留下一份重名的双胞胎；星期信息只存在 `plans.weekday` 绑定里。
- 三处行为修正：验证码填错不再作废（原先失败会永久烧掉验证码）；本人计划的星期绑定不再被同名系统计划抢走；历史脏口令散列不会再让登录接口 500。
- 新增列 `users.theme`（主题偏好）与 `users.is_admin`（后台管理员标记）启动时自动补齐，老库无需手工迁移；在配置里加 `auth.admin_emails` 并重启即可启用后台管理。
