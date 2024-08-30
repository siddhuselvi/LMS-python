from celery import Celery

celery_app = Celery(
    "compiler-app",
    broker="redis://localhost:6379/0",  # Redis as the broker
    backend="redis://localhost:6379/0",  # Redis as the backend
)

celery_app.conf.update(
    result_expires=3600,  # Task results expire after 1 hour
)
