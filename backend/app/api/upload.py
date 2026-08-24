import os
import shutil

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models import (
    Workspace,
    File as FileModel
)

from app.schemas.upload import FileResponse


router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

UPLOAD_DIR = "uploads"


@router.post(
    "/{workspace_id}",
    response_model=FileResponse
)
async def upload_file(
    workspace_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    workspace = (
        db.query(Workspace)
        .filter(Workspace.id == workspace_id)
        .first()
    )

    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )

    workspace_folder = os.path.join(
        UPLOAD_DIR,
        f"workspace_{workspace_id}"
    )

    os.makedirs(
        workspace_folder,
        exist_ok=True
    )

    file_path = os.path.join(
        workspace_folder,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    file_record = FileModel(
        workspace_id=workspace_id,
        file_name=file.filename,
        file_type=file.filename.split(".")[-1],
        file_path=file_path
    )

    db.add(file_record)
    db.commit()
    db.refresh(file_record)

    return file_record

# List Files
@router.get(
    "/files/{workspace_id}",
    response_model=list[FileResponse]
)
def get_workspace_files(
    workspace_id: int,
    db: Session = Depends(get_db)
):

    files = (
        db.query(FileModel)
        .filter(
            FileModel.workspace_id == workspace_id
        )
        .all()
    )

    return files
    
@router.delete("/file/{file_id}")
def delete_file(
    file_id: int,
    db: Session = Depends(get_db)
):

    file = (
        db.query(FileModel)
        .filter(FileModel.id == file_id)
        .first()
    )

    if not file:
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    if os.path.exists(file.file_path):
        os.remove(file.file_path)

    db.delete(file)
    db.commit()

    return {
        "message": "File deleted successfully"
    }