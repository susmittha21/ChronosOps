"""
vector_store.py

ChronosOps AI

Responsibilities
----------------
1. Create FAISS index
2. Store embeddings
3. Search similar incidents
4. Save index
5. Load index
"""

import os
import numpy as np

from pathlib import Path

# Absolute path to the project-root faiss_index directory.
# Resolves to <project_root>/faiss_index regardless of the working directory.
_FAISS_INDEX_DIR = Path(__file__).resolve().parents[4] / "faiss_index"

try:
    import faiss
except Exception:  # pragma: no cover - optional dependency
    faiss = None


class VectorStore:

    def __init__(self, dimension=384):

        self.dimension = dimension

        self.index = faiss.IndexFlatIP(dimension) if faiss is not None else None

        self.incident_ids = []
        self._vectors = []

    ##########################################################

    def normalize(self, vector):

        vector = np.asarray(vector).astype("float32")

        if faiss is not None:
            faiss.normalize_L2(vector.reshape(1, -1))
        else:
            norm = np.linalg.norm(vector)
            if norm:
                vector = vector / norm

        return vector

    ##########################################################

    def add_embedding(
        self,
        incident_id,
        embedding
    ):

        embedding = self.normalize(embedding)

        if self.index is not None:
            self.index.add(
                embedding.reshape(1, -1)
            )
        else:
            self._vectors.append(embedding.reshape(-1))

        self.incident_ids.append(incident_id)

    ##########################################################

    def add_embeddings(
        self,
        incident_ids,
        embeddings
    ):

        vectors = np.asarray(
            embeddings,
            dtype="float32"
        )

        if faiss is not None:
            faiss.normalize_L2(vectors)
            self.index.add(vectors)
        else:
            self._vectors.extend([vector.reshape(-1) for vector in vectors])

        self.incident_ids.extend(incident_ids)

    ##########################################################

    def search(
        self,
        embedding,
        top_k=3
    ):

        embedding = self.normalize(embedding)

        results = []

        if self.index is not None:
            scores, indices = self.index.search(
                embedding.reshape(1, -1),
                top_k
            )

            for score, idx in zip(scores[0], indices[0]):

                if idx == -1:
                    continue

                results.append(
                    {
                        "incident_id":
                            self.incident_ids[idx],

                        "similarity":
                            round(float(score), 4)
                    }
                )

            return results

        if not self._vectors:
            return results

        stored_vectors = np.vstack(self._vectors)
        similarity_scores = np.dot(stored_vectors, embedding.reshape(-1))
        top_indices = np.argsort(similarity_scores)[::-1][:top_k]

        for idx in top_indices:
            results.append(
                {
                    "incident_id": self.incident_ids[int(idx)],
                    "similarity": round(float(similarity_scores[int(idx)]), 4),
                }
            )

        return results

    ##########################################################

    def save(self, folder=None):

        folder = Path(folder) if folder is not None else _FAISS_INDEX_DIR

        folder.mkdir(
            parents=True,
            exist_ok=True
        )

        if self.index is not None:
            faiss.write_index(
                self.index,
                str(folder / "incidents.index")
            )

        np.save(
            folder / "incident_ids.npy",
            np.array(self.incident_ids)
        )

        if self.index is None:
            np.save(
                folder / "incident_embeddings.npy",
                np.array(self._vectors, dtype="float32")
            )

    ##########################################################

    def load(self, folder=None):

        folder = Path(folder) if folder is not None else _FAISS_INDEX_DIR

        index_file = folder / "incidents.index"

        ids_file = folder / "incident_ids.npy"

        if not index_file.exists():

            raise FileNotFoundError(
                "FAISS index not found."
            )

        if faiss is not None and index_file.exists():
            self.index = faiss.read_index(
                str(index_file)
            )
        else:
            self.index = None

        self.incident_ids = np.load(
            ids_file,
            allow_pickle=True
        ).tolist()

        embeddings_file = folder / "incident_embeddings.npy"
        if self.index is None and embeddings_file.exists():
            self._vectors = np.load(embeddings_file, allow_pickle=True).tolist()

    ##########################################################

    def total_vectors(self):

        if self.index is None:
            return len(self._vectors)

        return self.index.ntotal


##############################################################

vector_store = VectorStore()