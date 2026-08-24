from pydantic import BaseModel
from typing import List


class Flashcard(BaseModel):
    front: str
    back: str


class FlashcardResponse(BaseModel):
    cards: List[Flashcard]