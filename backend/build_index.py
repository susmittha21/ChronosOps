"""
Run this once to create the FAISS index.
"""

from backend.app.ai.retrieval.retrieval_service import retrieval_service

print("Building FAISS Index...")

retrieval_service.build_vector_index()

print("Done!")