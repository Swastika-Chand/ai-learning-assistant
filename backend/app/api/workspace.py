from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models import Workspace
from app.schemas.workspace import (
    WorkspaceCreate,
    WorkspaceResponse
)

router = APIRouter(
    prefix="/workspace",
    tags=["Workspace"]
)


@router.post("/", response_model=WorkspaceResponse)
def create_workspace(
    workspace: WorkspaceCreate,
    db: Session = Depends(get_db)
):
    new_workspace = Workspace(
        name=workspace.name
    )

    db.add(new_workspace)
    db.commit()
    db.refresh(new_workspace)

    return new_workspace


@router.get("/", response_model=list[WorkspaceResponse])
def get_workspaces(
    db: Session = Depends(get_db)
):
    return db.query(Workspace).all()


@router.delete("/{workspace_id}")
def delete_workspace(
    workspace_id: int,
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

    db.delete(workspace)
    db.commit()

    return {
        "message": "Workspace deleted successfully"
    }