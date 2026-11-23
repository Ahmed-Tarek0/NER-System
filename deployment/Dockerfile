FROM python:3.11-slim

WORKDIR /app

# install deps first so this layer is cached when only code changes
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# backend/ner_distilbert must exist locally before building this image
COPY backend ./backend
COPY frontend ./frontend

WORKDIR /app/backend

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
