import os
import faiss
import pickle

from app.rag.chunking import chunk_text
from app.rag.embeddings import create_embeddings
from app.rag.vector_store import create_faiss_index


def build_file_index(
    file_id: int,
    text: str
):

    print("=" * 50)
    print("BUILDING FILE INDEX")
    print("TEXT LENGTH:", len(text))
    print("=" * 50)

    chunks = chunk_text(text)

    if len(chunks) == 0:
        raise ValueError(
            "No chunks created"
        )

    vectors = create_embeddings(chunks)

    if len(vectors) == 0:
        raise ValueError(
            "No embeddings generated"
        )

    index = create_faiss_index(vectors)

    os.makedirs(
        "vector_store",
        exist_ok=True
    )

    faiss.write_index(
        index,
        f"vector_store/file_{file_id}.faiss"
    )

    with open(
        f"vector_store/file_{file_id}_chunks.pkl",
        "wb"
    ) as f:
        pickle.dump(chunks, f)

    return len(chunks)