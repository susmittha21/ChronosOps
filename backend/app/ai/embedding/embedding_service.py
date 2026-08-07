"""
embedding_service.py

Responsible for:
1. Creating embeddings from incident text
2. Batch embedding generation
3. Calculating similarity
4. Preparing text for vector search
"""

from typing import List
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from .model_loader import embedding_model


class EmbeddingService:

    def __init__(self):
        self.model = embedding_model

    ######################################################
    # Generate embedding for one incident
    ######################################################
    def generate_embedding(self, text: str):

        """
        Converts text into a semantic vector.

        Input:
            "Payment API timeout due to PostgreSQL"

        Output:
            numpy array (384 dimensions)
        """

        embedding = self.model.encode(
            text,
            convert_to_numpy=True
        )

        return embedding

    ######################################################
    # Generate embeddings for multiple incidents
    ######################################################
    def generate_batch_embeddings(self, texts: List[str]):

        """
        Input:
            List of incident descriptions

        Output:
            List of embeddings
        """

        embeddings = self.model.encode(
            texts,
            convert_to_numpy=True
        )

        return embeddings

    ######################################################
    # Calculate cosine similarity
    ######################################################
    def calculate_similarity(
        self,
        embedding1,
        embedding2
    ):

        similarity = cosine_similarity(
            [embedding1],
            [embedding2]
        )[0][0]

        return float(similarity)

    ######################################################
    # Prepare incident as searchable text
    ######################################################
    def build_incident_text(self, incident: dict):

        """
        Combines all important fields into one paragraph.

        This improves semantic search.
        """

        text = f"""
        Title: {incident.get('title','')}

        Service: {incident.get('service','')}

        Severity: {incident.get('severity','')}

        Symptoms:
        {incident.get('symptoms','')}

        Error:
        {incident.get('error_message','')}

        Root Cause:
        {incident.get('root_cause','')}

        Resolution:
        {incident.get('resolution','')}
        """

        return text.strip()

    ######################################################
    # Generate embedding directly from incident object
    ######################################################
    def embed_incident(self, incident: dict):

        text = self.build_incident_text(incident)

        return self.generate_embedding(text)

    ######################################################
    # Get embedding dimension
    ######################################################
    def embedding_dimension(self):

        embedding = self.generate_embedding("test")

        return len(embedding)


##########################################################
# Singleton object
##########################################################

embedding_service = EmbeddingService()