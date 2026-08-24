from fastapi import APIRouter, HTTPException
import os
from app.schemas.notes import NotesResponse
from app.rag.retriever import retrieve_chunks
from app.services.gemini_service import ask_gemini

router = APIRouter(
    prefix="/notes",
    tags=["Notes"]
)

@router.get(
    "/file/{file_id}",
    response_model=NotesResponse
)
def generate_notes(
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
        "Generate comprehensive study notes",
        top_k=5
    )

    context = "\n\n".join(chunks)

    prompt = f"""
You are an educational assistant.

Create detailed study notes from the content.

Format:

1. Overview
2. Key Concepts
3. Important Definitions
4. Important Points for Exams
5. Summary

Content:
{context}
"""

    notes = ask_gemini(prompt)

    return NotesResponse(
        notes=notes
    )