#!/usr/bin/env bash
# Release ChronosFit: bump version -> build wheel -> upload to PyPI -> commit + push to GitHub.
#
# Usage:
#   ./release.sh                        # interactive: prints the current version, asks for the next one
#   ./release.sh 3.5.0 "Fix the chart"  # non-interactive
#   ./release.sh --dry-run 3.5.0 "..."  # print every step, change nothing
set -euo pipefail
cd "$(dirname "$0")"

VERSION_FILE="chronos_fit/__init__.py"
PKG="chronos-fit"

usage() {
  cat <<'EOF'
用法：
  ./release.sh                      交互式：显示当前版本号，再询问新版本号与 commit message
  ./release.sh 3.5.0 "消息"         免交互：命令行直接传版本号与 commit message
  ./release.sh --dry-run [同上]     预演：打印将要执行的命令，不改文件、不构建、不上传、不推送

流程：改 chronos_fit/__init__.py 的 __version__ -> build_wheel.sh 构建 wheel
      -> twine 上传 PyPI（版本号一旦发布不可覆盖）-> git add -A + commit + push
EOF
}

die() { echo "错误：$*" >&2; exit 1; }
run() {
  if [ -n "$DRY" ]; then
    echo "  [dry-run] $*"
  else
    echo "+ $*"
    "$@"
  fi
}

# ---------- 参数 ----------
DRY=""
NEW=""
MSG=""
while [ $# -gt 0 ]; do
  case "$1" in
    -h | --help)
      usage
      exit 0
      ;;
    --dry-run | -n)
      DRY="1"
      shift
      ;;
    -*) die "未知参数：$1" ;;
    *)
      if [ -z "$NEW" ]; then NEW="$1"
      elif [ -z "$MSG" ]; then MSG="$1"
      else die "多余的参数：$1"
      fi
      shift
      ;;
  esac
done

[ -f "$VERSION_FILE" ] || die "找不到 $VERSION_FILE，请在仓库根目录运行"
CUR=$(sed -n -E 's/^__version__[[:space:]]*=[[:space:]]*"([^"]*)".*/\1/p' "$VERSION_FILE")
[ -n "$CUR" ] || die "没能从 $VERSION_FILE 读出 __version__"

# ---------- 交互补齐 ----------
echo "当前版本：$CUR"
if [ -z "$NEW" ]; then
  read -r -p "新版本号（直接回车取消）：" NEW || {
    echo "已取消"
    exit 0
  }
  NEW=${NEW%$'\r'}
  [ -n "$NEW" ] || {
    echo "已取消"
    exit 0
  }
fi
if [ -z "$MSG" ]; then
  read -r -p "commit message：" MSG || {
    echo "已取消"
    exit 0
  }
  MSG=${MSG%$'\r'}
  [ -n "$MSG" ] || {
    echo "已取消"
    exit 0
  }
fi

# ---------- 校验 ----------
echo "$NEW" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+[0-9A-Za-z.]*$' || die "版本号格式不对：$NEW（形如 3.5.0）"
[ "$NEW" != "$CUR" ] || die "新版本号与当前版本相同：$CUR"
if [ "$(printf '%s\n%s\n' "$CUR" "$NEW" | sort -V | head -n1)" = "$NEW" ]; then
  die "新版本号 $NEW 低于当前版本 $CUR"
fi
[ -n "$MSG" ] || die "commit message 不能为空"

git rev-parse --git-dir >/dev/null 2>&1 || die "这里不是 git 仓库"
BRANCH=$(git rev-parse --abbrev-ref HEAD)

code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "https://pypi.org/pypi/$PKG/$NEW/json" 2>/dev/null || echo 000)
case "$code" in
  404) : ;;
  200) die "$NEW 已存在于 PyPI，PyPI 不允许重复上传同一个版本号" ;;
  *) echo "提醒：无法联网确认 $NEW 是否已发布（HTTP $code），继续执行" ;;
esac

WHEEL="dist/${PKG//-/_}-${NEW}-py3-none-any.whl"

echo
echo "发布计划："
echo "  版本号   $CUR -> $NEW"
echo "  commit   $MSG"
echo "  分支     $BRANCH"
echo "  产物     $WHEEL"
PENDING=$(git status --porcelain)
if [ -n "$PENDING" ]; then
  echo "  待提交（git add -A 会全部纳入）："
  echo "$PENDING" | sed 's/^/      /'
else
  echo "  待提交：工作区干净，只提交版本号改动"
fi
echo

if [ -z "$DRY" ] && [ -t 0 ]; then
  printf '确认发布？输入 yes 继续（PyPI 上传后不可撤回），其他任意输入取消：'
  read -r ans || ans=""
  if [ "$ans" != "yes" ]; then
    echo "已取消"
    exit 0
  fi
fi

# ---------- 1. 版本号 ----------
echo
echo "== 1/4 更新版本号"
run sed -i.bak -E "s/^__version__[[:space:]]*=[[:space:]]*\"[^\"]*\"/__version__ = \"${NEW}\"/" "$VERSION_FILE"
run rm -f "${VERSION_FILE}.bak"
if [ -z "$DRY" ]; then
  grep -qE "^__version__[[:space:]]*=[[:space:]]*\"${NEW}\"$" "$VERSION_FILE" ||
    die "版本号写入失败，请检查 $VERSION_FILE"
fi

# ---------- 2. 构建 wheel ----------
echo
echo "== 2/4 构建 wheel"
run bash build_wheel.sh
if [ -z "$DRY" ]; then
  [ -f "$WHEEL" ] || die "构建产物缺失：$WHEEL"
  python - "$WHEEL" "$NEW" <<'PY'
import sys
import zipfile

wheel, ver = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(wheel) as z:
    init = z.read("chronos_fit/__init__.py").decode("utf-8")
if f'__version__ = "{ver}"' not in init:
    sys.exit(f"wheel 内的版本号与 {ver} 不一致")
print(f"wheel 校验通过：{ver}，共 {len(z.namelist())} 个文件")
PY
fi

# ---------- 3. 上传 PyPI ----------
echo
echo "== 3/4 上传 PyPI"
if [ -z "$DRY" ]; then
  echo "+ python -m twine check $WHEEL"
  python -m twine check "$WHEEL"
fi
# PYTHONUTF8：Windows GBK 控制台下 twine 的进度条会崩在 UnicodeEncodeError 上
run env PYTHONUTF8=1 PYTHONIOENCODING=utf-8 python -m twine upload --disable-progress-bar "$WHEEL"

# ---------- 4. 提交并推送 ----------
echo
echo "== 4/4 提交并推送到 GitHub"
if [ -n "$DRY" ]; then
  echo "  [dry-run] git add -A && git commit -m \"$MSG\" && git push origin $BRANCH"
else
  git add -A
  git commit -m "$MSG"
  echo "+ git push origin $BRANCH"
  if GIT_TERMINAL_PROMPT=0 git push origin "$BRANCH"; then
    echo "已推送 origin/$BRANCH"
  else
    echo "提醒：推送失败（多为 127.0.0.1:10808 的代理未运行）。"
    echo "     提交已在本地完成，代理起来后只需补推：git push origin $BRANCH"
    exit 1
  fi
fi

echo
if [ -n "$DRY" ]; then
  echo "预演结束：以上命令均未真正执行。"
else
  echo "发布完成：$PKG $NEW -> https://pypi.org/project/$PKG/$NEW/"
fi
