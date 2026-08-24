from pydantic import BaseModel
from typing import Optional


class QuizQuestion(BaseModel):
    question: str
    options: list[str]
    answer: str
    explanation: Optional[str] = ""


class QuizResponse(BaseModel):
    questions: list[QuizQuestion]