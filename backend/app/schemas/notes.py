from pydantic import BaseModel


class NotesResponse(BaseModel):
    notes: str