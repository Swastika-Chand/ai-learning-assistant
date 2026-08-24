import faiss
import pickle
import numpy as np

from app.rag.embeddings import create_embeddings


def retrieve_chunks(
    file_id: int,
    question: str,
    top_k: int = 3
):

    index = faiss.read_index(
        f"vector_store/file_{file_id}.faiss"
    )

    with open(
        f"vector_store/file_{file_id}_chunks.pkl",
        "rb"
    ) as f:
        chunks = pickle.load(f)

    query_vector = create_embeddings(
        [question]
    )

    distances, indices = index.search(
        np.array(query_vector).astype("float32"),
        top_k
    )

    results = []

    for idx in indices[0]:
        if idx < len(chunks):
            results.append(chunks[idx])

    return results