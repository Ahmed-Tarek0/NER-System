from fastapi import APIRouter

from ..ner_service import ner_service
from ..schemas import PredictResponse, TextIn

router = APIRouter(prefix="/api", tags=["ner"])


@router.post("/predict", response_model=PredictResponse)
def predict(body: TextIn):
    entities = ner_service.predict(body.text)
    return PredictResponse(text=body.text, entities=entities)


@router.get("/health")
def health():
    return {"status": "ok"}
