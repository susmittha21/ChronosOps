"""
retrieval_service.py

ChronosOps AI

Responsibilities
----------------
1. Build the FAISS index from the incident dataset.
2. Retrieve the most similar historical incidents.
"""

from app.ai.preprocessing.data_loader import data_loader
from app.ai.preprocessing.text_builder import text_builder
from app.ai.embedding.embedding_service import embedding_service
from app.ai.retrieval.vector_store import vector_store


class RetrievalService:

    def __init__(self):
        self.df = data_loader.get_dataframe()

    ############################################################

    def build_vector_index(self):

        """
        Build FAISS index from the CSV.
        Run this once when the application starts.
        """

        if vector_store.total_vectors() > 0:
            print("Vector index already exists.")
            return

        incidents = data_loader.get_all_incidents()

        incident_ids = []
        embeddings = []

        print("Generating embeddings...")

        for incident in incidents:

            text = text_builder.build_incident_text(incident)

            embedding = embedding_service.generate_embedding(text)

            incident_ids.append(incident["incident_id"])
            embeddings.append(embedding)

        vector_store.add_embeddings(
            incident_ids,
            embeddings
        )

        vector_store.save()

        print(f"{len(incident_ids)} incidents indexed successfully.")

    ############################################################

    def retrieve_similar_incidents(
        self,
        title,
        service,
        severity,
        category,
        symptoms,
        error_message,
        top_k=3
    ):

        """
        Returns the top similar incidents.
        """

        query = text_builder.build_query_text(
            title,
            service,
            severity,
            category,
            symptoms,
            error_message
        )

        query_embedding = embedding_service.generate_embedding(query)

        search_results = vector_store.search(
            query_embedding,
            top_k
        )

        final_results = []

        for result in search_results:

            incident = self.df[
                self.df["incident_id"] == result["incident_id"]
            ]

            if incident.empty:
                continue

            incident = incident.iloc[0].to_dict()

            incident["similarity"] = result["similarity"]

            final_results.append(incident)

        return final_results

    ############################################################

    def search_by_text(
        self,
        query,
        top_k=5
    ):

        """
        Search directly using free-form text.
        """

        embedding = embedding_service.generate_embedding(query)

        results = vector_store.search(
            embedding,
            top_k
        )

        incidents = []

        for item in results:

            incident = self.df[
                self.df["incident_id"] == item["incident_id"]
            ]

            if incident.empty:
                continue

            incident = incident.iloc[0].to_dict()

            incident["similarity"] = item["similarity"]

            incidents.append(incident)

        return incidents


###############################################################

retrieval_service = RetrievalService()