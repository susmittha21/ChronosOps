from sentence_transformers import SentenceTransformer

# Load the embedding model only once
MODEL_NAME = "all-MiniLM-L6-v2"

embedding_model = SentenceTransformer(MODEL_NAME)