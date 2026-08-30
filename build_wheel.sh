#!/usr/bin/env bash
# Build the ChronosFit wheel into dist/.
#
# Usage:
#   ./build_wheel.sh              # build the wheel
#   pip install dist/*.whl        # install it elsewhere
#
# Publish to PyPI (one-time setup: pypi.org account + API token):
#   pip install twine
#   twine upload dist/*
set -euo pipefail
cd "$(dirname "$0")"

python -m pip show build >/dev/null 2>&1 || python -m pip install --quiet build

rm -rf dist build *.egg-info
python -m build --wheel

echo
ls -lh dist/*.whl
echo "Install with:   pip install $(ls dist/*.whl)"
echo "Publish to PyPI: twine upload dist/*"
