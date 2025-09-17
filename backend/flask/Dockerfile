# Stage 1: Build the Flask application
from python:3.11-slim

workdir /app
copy requirements.txt ./
run pip install --no-cache-dir -r requirements.txt
copy . .
expose 5000
cmd ["gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app"]