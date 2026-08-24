from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models import (
    File,
    ExtractedText
)

from app.schemas.process import (
    ProcessResponse
)

from app.services.pdf_service import (
    extract_text_from_pdf
)

from app.services.ocr_service import (
    extract_text_from_image
)

router = APIRouter(
    prefix="/process",
    tags=["Processing"]
)


@router.post(
    "/content/{file_id}",
    response_model=ProcessResponse
)
def process_content(
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

    file_type = file.file_type.lower()

    if file_type == "pdf":

        extracted_text = (
            extract_text_from_pdf(
                file.file_path
            )
        )

    elif file_type in [
        "jpg",
        "jpeg",
        "png",
        "webp"
    ]:

        extracted_text = (
            extract_text_from_image(
                file.file_path
            )
        )

    else:

        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Allowed types: PDF, JPG, JPEG, PNG, WEBP."
        )

    record = ExtractedText(
        workspace_id=file.workspace_id,
        file_id=file.id,
        content=extracted_text
    )

    db.add(record)
    db.commit()

    return ProcessResponse(
        message="Content processed successfully",
        file_id=file.id,
        extracted_characters=len(
            extracted_text
        )
    )