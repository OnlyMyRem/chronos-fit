FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Dependencies first so edits to code don't break the layer cache.
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend ./backend
COPY frontend ./frontend
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
CMD ["python", "-m", "backend.main"]
