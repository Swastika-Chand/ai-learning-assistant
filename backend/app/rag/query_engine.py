from app.rag.retriever import (
    retrieve_chunks
)

from app.services.gemini_service import (
    ask_gemini
)


def answer_question(
    file_id: int,
    question: str
):

    chunks = retrieve_chunks(
        file_id,
        question
    )

    context = "\n\n".join(chunks)

    prompt = f"""
You are an educational AI assistant.

IMPORTANT RULES:
- Answer ONLY using the provided context.
- Do NOT invent information.
- If the answer is not present in the context, say:
  "The answer is not available in the provided study material."

Format your response using Markdown:

# Topic

## Explanation
Provide a clear and detailed explanation.

## Key Points
- Point 1
- Point 2
- Point 3

## Example
Provide an example if applicable.

## Important Notes
- Important exam-oriented points

## Summary
Provide a short summary.

Context:
{context}

Question:
{question}
"""

    return ask_gemini(prompt)