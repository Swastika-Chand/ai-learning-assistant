from fastapi import (
    APIRouter,
    HTTPException
)

import os

from app.rag.retriever import retrieve_chunks
from app.services.gemini_service import ask_gemini

router = APIRouter(
    prefix="/summary",
    tags=["Summary"]
)


@router.get("/file/{file_id}")
def generate_summary(file_id: int):

    index_path = (
        f"vector_store/file_{file_id}.faiss"
    )

    if not os.path.exists(index_path):

        raise HTTPException(
            status_code=400,
            detail=(
                "Please process content and "
                "build knowledge base first."
            )
        )

    chunks = retrieve_chunks(
        file_id=file_id,
        question="Generate summary",
        top_k=5
    )

    context = "\n\n".join(chunks)

    prompt = f"""
You are an educational assistant.

Create a SHORT executive summary for quick revision.

IMPORTANT:
- Maximum 300-400 words.
- Focus only on the most important ideas.
- Do NOT create detailed study notes.
- Do NOT explain every concept.
- Assume the student has only 1 minute to revise.
- Use simple language.
- Highlight exam-relevant information.

Return in this format:

# Executive Summary

(Short overview)

# Key Concepts

- Concept 1
- Concept 2
- Concept 3
- Concept 4

# Exam Takeaways

- Important point 1
- Important point 2
- Important point 3

Content:

{context}
"""

    summary = ask_gemini(prompt)

    return {
        "summary": summary
    }