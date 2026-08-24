import faiss
import numpy as np


def create_faiss_index(vectors):

    if len(vectors) == 0:
        raise ValueError(
            "No vectors received for FAISS index creation"
        )

    vectors = np.array(
        vectors,
        dtype="float32"
    )

    dimension = len(vectors[0])

    index = faiss.IndexFlatL2(
        dimension
    )

    index.add(vectors)

    return index