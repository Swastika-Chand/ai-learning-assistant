from fastapi import APIRouter

from app.services.gemini_service import (
    ask_gemini
)

router = APIRouter(
    prefix="/gemini",
    tags=["Gemini"]
)


@router.get("/test")
def test_gemini():

    answer = ask_gemini(
        "What is an operating system?"
    )

    return {
        "answer": answer
    }