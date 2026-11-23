import torch
from transformers import pipeline

from .config import MODEL_PATH
from .schemas import Entity


class NERService:
    """Loads the fine-tuned model once and exposes a simple predict() method."""

    def __init__(self, model_path=MODEL_PATH):
        device = 0 if torch.cuda.is_available() else -1
        self._pipe = pipeline(
            "token-classification",
            model=str(model_path),
            tokenizer=str(model_path),
            # "first": use the first sub-token's label for the whole word.
            # matches training, where only the first sub-token of each word
            # was supervised (the rest were masked with -100) — "simple"
            # tries to merge based on every sub-token's own label, which
            # fragments words like "Cristiano" since the later sub-tokens
            # were never actually trained to predict anything meaningful.
            aggregation_strategy="first",
            device=device,
        )

    def predict(self, text: str) -> list[Entity]:
        if not text.strip():
            return []
        results = self._pipe(text)
        return [
            Entity(
                text=r["word"],
                label=r["entity_group"],
                start=r["start"],
                end=r["end"],
                score=float(r["score"]),
            )
            for r in results
        ]


# created once when the app starts, reused by every request
ner_service = NERService()
