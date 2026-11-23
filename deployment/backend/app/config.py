from pathlib import Path

# backend/app/config.py -> parent.parent = backend/
BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "ner_distilbert"
FRONTEND_DIR = BASE_DIR.parent / "frontend"

# loosen this if the frontend is ever served from a different origin
CORS_ORIGINS = ["*"]
