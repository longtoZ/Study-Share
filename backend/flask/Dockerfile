# Stage 1: Build the Flask application
from python:3.11-slim

workdir /app
copy requirements.txt ./
run pip install -r requirements.txt
copy . .
expose 5000