---- run celery cmd ----
celery -A worker.celery_app worker --loglevel=info
