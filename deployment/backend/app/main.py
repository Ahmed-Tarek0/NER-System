from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import CORS_ORIGINS, FRONTEND_DIR
from .routers import ner

app = FastAPI(title="NER System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ner.router)

# serves frontend/index.html at "/" and the rest of the static files alongside it
app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")
