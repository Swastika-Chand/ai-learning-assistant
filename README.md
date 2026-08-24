#  AI Learning Assistant

### Learn from your own content — smarter, faster, and interactively.

An AI-powered learning platform that transforms **PDFs, images, and YouTube lectures** into interactive study material using **RAG, FAISS, embeddings, and Gemini**.

Instead of reading through an entire document or lecture, students can upload or import their learning material and generate:

**📄 Summaries · 📝 Study Notes · 🧠 Quizzes · 🃏 Flashcards · 💬 AI Q&A**

---

##  What Makes It Different?

The AI Learning Assistant does not simply send an entire document to an LLM.

It uses a **Retrieval-Augmented Generation (RAG)** pipeline to find the most relevant parts of the selected learning source before generating an answer.

This helps the system:

-  Retrieve relevant information from study material
-  Keep AI responses grounded in the selected source
-  Keep different learning sources isolated
-  Avoid sending the entire document for every question
-  Generate study material specific to the selected content

---

##  Features

| Feature | Description |
|---|---|
|  PDF Support | Extract text from PDF documents |
|  Image Support | Extract text from images using OCR |
|  YouTube Support | Import lectures using a YouTube URL and extract transcripts |
|  Semantic Search | Find relevant content using embeddings and FAISS |
|  Summary | Generate short revision-focused summaries |
|  Study Notes | Generate detailed structured notes |
|  Quiz | Generate multiple-choice questions |
|  Flashcards | Generate question-answer flashcards |
|  AI Chat | Ask questions about the selected learning source |
|  File Isolation | Keep retrieval specific to the selected source |

---

#  System Architecture

```text
                    AI LEARNING ASSISTANT
                            │
             ┌──────────────┼──────────────┐
             │              │              │
            PDF           IMAGE         YOUTUBE
             │              │              │
          PyMuPDF        EasyOCR     Transcript API
             │              │              │
             └──────────────┼──────────────┘
                            │
                     Extracted Text
                            │
                       Text Chunking
                            │
                  Sentence Embeddings
                            │
                     FAISS Vector Store
                            │
                 Relevant Context Retrieval
                            │
                    Gemini 2.5 Flash
                            │
       ┌────────────┬───────┼────────┬────────────┐
       │            │       │        │            │
    Summary       Notes    Quiz   Flashcards     Chat

## Screenshots

### Workspace

Upload PDFs and images or import YouTube lectures into a workspace.

![Workspace](screenshots/workspace.png)

### AI-Generated Summary

Generate concise summaries from the selected learning source.

![Summary](screenshots/summary.png)

### Interactive Quiz

Generate and attempt multiple-choice questions based on the learning material.

![Quiz](screenshots/quiz.png)

### AI Q&A

Ask questions and receive answers grounded in the selected learning source.

![Q&A](screenshots/qa.png)

### Interactive Flashcards

Review important concepts using automatically generated flashcards.

![Flashcards](screenshots/flashcard.png)
