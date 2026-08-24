from fastapi import (
    APIRouter,
    UploadFile,
    File
)

import easyocr

from app.services.gemini_service import (
    ask_gemini
)

router = APIRouter(
    prefix="/image",
    tags=["Image"]
)

reader = easyocr.Reader(["en"])


@router.post("/summarize")
async def summarize_image(
    file: UploadFile = File(...)
):

    image_path = "temp_image.png"

    with open(image_path, "wb") as f:
        f.write(await file.read())

    result = reader.readtext(
        image_path,
        detail=0
    )

    extracted_text = "\n".join(result)

    prompt = f"""
You are an educational assistant.

Create structured study notes from:

{extracted_text}

Include:

- Main Topics
- Important Concepts
- Key Points
- Exam Notes
"""

    summary = ask_gemini(prompt)

    return {
        "extracted_text": extracted_text,
        "summary": summary
    }