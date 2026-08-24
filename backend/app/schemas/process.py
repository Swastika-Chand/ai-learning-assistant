from pydantic import BaseModel


class ProcessResponse(BaseModel):
    message: str
    file_id: int
    extracted_characters: int