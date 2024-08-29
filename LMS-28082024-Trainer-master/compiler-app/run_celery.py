from celery import Celery
from worker import celery_app  # Adjust the import according to your project structure

if __name__ == "__main__":
    celery_app.worker_main(argv=['worker', '--loglevel=info'])
