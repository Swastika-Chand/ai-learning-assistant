from fastapi import (
    APIRouter,
    HTTPException
)

import os

from app.schemas.chat import (
    ChatRequest,
    ChatResponse
)

from app.rag.query_engine import (
    answer_question
)

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)

@router.post(
    "/file/{file_id}",
    response_model=ChatResponse
)
def chat_with_file(
    file_id: int,
    request: ChatRequest
):

    index_path = f"vector_store/file_{file_id}.faiss"
    if not os.path.exists(index_path):
        raise HTTPException(
            status_code=400,
            detail="Please build the Knowledge Base first."
        )

    answer = answer_question(
        file_id,
        request.question
    )

    return ChatResponse(
        answer=answer
    )