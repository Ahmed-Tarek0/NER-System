from pydantic import BaseModel


class TextIn(BaseModel):
    text: str


class Entity(BaseModel):
    text: str
    label: str
    start: int
    end: int
    score: float


class PredictResponse(BaseModel):
    text: str
    entities: list[Entity]
