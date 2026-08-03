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
import faiss
import numpy as np

from pathlib import Path


class VectorStore:

    def __init__(self, dimension=384):

        self.dimension = dimension

        self.index = faiss.IndexFlatIP(dimension)

        self.incident_ids = []

    ##########################################################

    def normalize(self, vector):

        vector = np.asarray(vector).astype("float32")

        faiss.normalize_L2(vector.reshape(1, -1))

        return vector

    ##########################################################

    def add_embedding(
        self,
        incident_id,
        embedding
    ):

        embedding = self.normalize(embedding)

        self.index.add(
            embedding.reshape(1, -1)
        )

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

        faiss.normalize_L2(vectors)

        self.index.add(vectors)

        self.incident_ids.extend(incident_ids)

    ##########################################################

    def search(
        self,
        embedding,
        top_k=3
    ):

        embedding = self.normalize(embedding)

        scores, indices = self.index.search(
            embedding.reshape(1, -1),
            top_k
        )

        results = []

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

    ##########################################################

    def save(self, folder="faiss_index"):

        folder = Path(folder)

        folder.mkdir(
            parents=True,
            exist_ok=True
        )

        faiss.write_index(
            self.index,
            str(folder / "incidents.index")
        )

        np.save(
            folder / "incident_ids.npy",
            np.array(self.incident_ids)
        )

    ##########################################################

    def load(self, folder="faiss_index"):

        folder = Path(folder)

        index_file = folder / "incidents.index"

        ids_file = folder / "incident_ids.npy"

        if not index_file.exists():

            raise FileNotFoundError(
                "FAISS index not found."
            )

        self.index = faiss.read_index(
            str(index_file)
        )

        self.incident_ids = np.load(
            ids_file,
            allow_pickle=True
        ).tolist()

    ##########################################################

    def total_vectors(self):

        return self.index.ntotal


##############################################################

vector_store = VectorStore()