from app.celery_config import celery_app
from app.tasks import execute_code_task

if __name__ == "__main__":
    celery_app.start()
