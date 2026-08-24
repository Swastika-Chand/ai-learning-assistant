from pydantic import BaseModel
from datetime import datetime


class FileResponse(BaseModel):
    id: int
    workspace_id: int
    file_name: str
    file_type: str
    file_path: str
    created_at: datetime

    class Config:
        from_attributes = True