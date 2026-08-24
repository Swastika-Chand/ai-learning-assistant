from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models import (
    Workspace,
    File,
    ExtractedText
)

from app.services.youtube_service import (
    get_youtube_transcript
)

from app.rag.build_index import build_file_index

router = APIRouter(
    prefix="/youtube",
    tags=["YouTube"]
)


class YoutubeRequest(BaseModel):
    workspace_id: int
    url: str


@router.post("/import")
def import_youtube_video(
    request: YoutubeRequest,
    db: Session = Depends(get_db)
):

    workspace = (
        db.query(Workspace)
        .filter(
            Workspace.id == request.workspace_id
        )
        .first()
    )

    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )

    try:
        title, transcript = get_youtube_transcript(request.url)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    if not transcript or len(transcript.strip()) == 0:
        raise HTTPException(
            status_code=400,
            detail="No transcript text extracted from YouTube video."
        )

    file_record = File(
        workspace_id=request.workspace_id,
        file_name=title,
        file_type="youtube",
        file_path=request.url
    )

    db.add(file_record)
    db.commit()
    db.refresh(file_record)

    extracted_text = ExtractedText(
        workspace_id=request.workspace_id,
        file_id=file_record.id,
        content=transcript
    )

    db.add(extracted_text)
    db.commit()

    # Auto-build FAISS index immediately so the YouTube file is
    # AI-ready without a separate "Build Knowledge Base" step.
    try:
        chunk_count = build_file_index(file_record.id, transcript)
        print(
            f"[YouTube] Auto-built FAISS for file_id={file_record.id}"
            f" — {chunk_count} chunks"
        )
    except Exception as e:
        print(f"[YouTube] Warning: auto-FAISS build failed: {e}")
        chunk_count = 0

    return {
        "message": "YouTube video imported successfully",
        "file_id": file_record.id,
        "file_name": file_record.file_name,
        "characters": len(transcript),
        "chunks": chunk_count
    }