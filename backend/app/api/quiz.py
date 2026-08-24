from fastapi import APIRouter, HTTPException
import json
import os

from app.schemas.quiz import (
    QuizResponse,
    QuizQuestion
)

from app.rag.retriever import retrieve_chunks
from app.services.gemini_service import ask_gemini

router = APIRouter(
    prefix="/quiz",
    tags=["Quiz"]
)


@router.get(
    "/file/{file_id}",
    response_model=QuizResponse
)
def generate_quiz(
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
    "Generate quiz questions",
    top_k=5
)

    context = "\n\n".join(chunks)

    prompt = f"""
You are an educational assistant.

Generate a multiple-choice quiz.

IMPORTANT:

Return ONLY a valid JSON array.

DO NOT use markdown.

DO NOT use:

```json

Provide a short explanation for each answer.

The output must start with:

[

and end with:

]

Example:

[
  {{
    "question": "What is DBMS?",
    "options": [
      "Database Management System",
      "Data Backup Management System",
      "Database Monitoring Service",
      "Data Mapping System"
    ],
    "answer": "Database Management System"
    "explanation": "Why this answer is correct"
  }}
]

Rules:
- Generate 5 to 10 questions.
- Use only the provided content.
- Do not invent information.
- Do not repeat questions.
- Every question must have exactly 4 options.
- The answer must exactly match one option.

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

        questions_data = json.loads(response)

        questions = [
            QuizQuestion(
                question=q["question"],
                options=q["options"],
                answer=q["answer"],
                explanation=q.get(
                    "explanation",
                    ""
                )
            )
            for q in questions_data
        ]

        print("=" * 50)
        print(
            f"QUIZ GENERATED: {len(questions)} questions"
        )
        print("=" * 50)

        return QuizResponse(
            questions=questions
        )

    except Exception as e:

        print("=" * 50)
        print("QUIZ ERROR")
        print(e)
        print()
        print("RAW GEMINI RESPONSE:")
        print(response)
        print("=" * 50)

        return QuizResponse(
            questions=[]
        )