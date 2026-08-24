from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.db import engine, Base

from app.api.workspace import router as workspace_router
from app.api.upload import router as upload_router
from app.api.process import router as process_router
from app.api.rag import router as rag_router
from app.api.gemini_test import router as gemini_router
from app.api.chat import router as chat_router
from app.api.notes import router as notes_router
from app.api.quiz import router as quiz_router
from app.api.flashcards import router as flashcards_router
from app.api.image import router as image_router
from app.api.summary import router as summary_router
from app.api.youtube import router as youtube_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Learning Assistant"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(workspace_router)
app.include_router(upload_router)
app.include_router(process_router)
app.include_router(gemini_router)
app.include_router(rag_router)
app.include_router(chat_router)
app.include_router(notes_router)
app.include_router(quiz_router)
app.include_router(flashcards_router)
app.include_router(image_router)
app.include_router(summary_router)
app.include_router(youtube_router)

@app.get("/")
def root():
    return {
        "message": "AI Learning Assistant Backend Running"
    }