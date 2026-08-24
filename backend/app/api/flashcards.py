from fastapi import APIRouter, HTTPException
import json
import os

from app.schemas.flashcards import FlashcardResponse

from app.rag.retriever import retrieve_chunks

from app.services.gemini_service import ask_gemini

router = APIRouter(
    prefix="/flashcards",
    tags=["Flashcards"]
)


@router.get(
    "/file/{file_id}",
    response_model=FlashcardResponse
)
def generate_flashcards(
    file_id: int
):

    index_path = f"vector_store/file_{file_id}.faiss"
    if not os.path.exists(index_path):
        raise HTTPException(
            status_code=400,
            detail="Please build the Knowledge Base first."
        )

    chunks = retrieve_chunks(
    file_id,
    "Generate flashcards",
    top_k=5
    )

    context = "\n\n".join(chunks)

    prompt = f"""
You are an educational assistant.

Generate study flashcards.

Return ONLY valid JSON.

Example:

[
  {{
    "front": "What is DBMS?",
    "back": "Database Management System"
  }},
  {{
    "front": "What is Normalization?",
    "back": "Process of reducing redundancy in a database."
  }}
]

Rules:
- Generate between 5 and 15 flashcards.
- Use only the provided content.
- Do not invent information.
- Do not repeat concepts.
- Keep answers concise.
- Return ONLY JSON.
- No markdown.
- No explanations outside JSON.

Content:

{context}
"""

    response = ask_gemini(prompt)

    try:

        response = response.strip()

        response = response.replace(
            "```json",
            ""
        )

        response = response.replace(
            "```",
            ""
        )

        cards_data = json.loads(response)

        return FlashcardResponse(
            cards=cards_data
        )

    except Exception as e:

        print("=" * 50)
        print("FLASHCARD ERROR")
        print(e)
        print()
        print("RAW GEMINI RESPONSE:")
        print(response)
        print("=" * 50)

        return FlashcardResponse(
            cards=[]
        )