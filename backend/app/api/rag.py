from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.database.models import (
    ExtractedText,
    File
)

from app.rag.build_index import (
    build_file_index
)

router = APIRouter(
    prefix="/rag",
    tags=["RAG"]
)


@router.post(
    "/build/file/{file_id}"
)
def build_rag_index(
    file_id: int,
    db: Session = Depends(get_db)
):

    file = (
        db.query(File)
        .filter(File.id == file_id)
        .first()
    )

    if not file:
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    text = (
        db.query(ExtractedText)
        .filter(
            ExtractedText.file_id == file_id
        )
        .first()
    )

    if not text:
        raise HTTPException(
            status_code=400,
            detail="No extracted text found"
        )

    chunk_count = build_file_index(
        file_id,
        text.content
    )

    return {
        "message": "Vector index created",
        "file_id": file_id,
        "chunks": chunk_count
    }