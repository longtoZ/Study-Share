from celery import Celery

def make_celery(app_name=__name__):
    return Celery(
        app_name,
        broker="redis://localhost:6379/0",      # Use Redis as broker
        backend="redis://localhost:6379/0"      # Store results in Redis
    )

celery = make_celery()

# To start the worker, run the following command in your terminal:
# .\.venv\Scripts\activate
# celery -A app.config.celery_worker worker --loglevel=info --pool=solo