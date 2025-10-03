from celery import Celery
import os
from dotenv import load_dotenv

load_dotenv()

def make_celery(app_name=__name__):
    return Celery(
        app_name,
        broker=os.getenv("CELERY_BROKER_URL"),      # Use Redis as broker
        backend=os.getenv("CELERY_RESULT_BACKEND")      # Store results in Redis
    )

celery = make_celery()

# .\.venv\Scripts\activate
# celery -A app.config.celery worker --loglevel=info --pool=solo