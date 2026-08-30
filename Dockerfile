FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Install the released wheel: prefer PyPI, fall back to the locally built
# wheel in dist/ (run ./build_wheel.sh first when PyPI is unreachable or the
# release does not exist yet). Pin with --build-arg CHRONOSFIT_VERSION=x.y.z.
ARG CHRONOSFIT_VERSION=
COPY dist/*.whl /tmp/wheels/
RUN pkg=chronos-fit; \
    [ -z "$CHRONOSFIT_VERSION" ] || pkg="chronos-fit==$CHRONOSFIT_VERSION"; \
    pip install --no-cache-dir "$pkg" || pip install --no-cache-dir /tmp/wheels/*.whl; \
    rm -rf /tmp/wheels

COPY data/config.example.yaml docker-entrypoint.sh ./

RUN useradd --create-home --shell /bin/sh appuser \
    && mkdir -p /app/data \
    && chmod +x /app/docker-entrypoint.sh \
    && chown -R appuser:appuser /app

USER appuser

# Everything stateful — the SQLite file and config.yaml — lives here. Mount a
# host directory (or a named volume) on this path and the data outlives the
# container, the image and even `docker compose down`.
VOLUME ["/app/data"]
EXPOSE 18000

ENV CHRONOSFIT_CONFIG=/app/data/config.yaml

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["chronos-fit"]
