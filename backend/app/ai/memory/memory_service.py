"""
memory_service.py

ChronosOps AI

Responsibilities
----------------
1. Convert a resolved incident into semantic text.
2. Generate an embedding.
3. Add it to the FAISS vector store.
4. Persist the updated FAISS index.
5. Make the incident immediately searchable.
"""

from datetime import datetime

from backend.app.ai.preprocessing.text_builder import text_builder
from backend.app.ai.embedding.embedding_service import embedding_service
from backend.app.ai.retrieval.vector_store import vector_store


class MemoryService:

    ##########################################################

    def save_to_memory(self, resolved_incident: dict):

        """
        Adds a newly resolved incident to the AI memory.

        Parameters
        ----------
        resolved_incident : dict

        Must contain:
        incident_id
        title
        service
        severity
        category
        symptoms
        error_message
        root_cause
        resolution
        preventive_action
        recovery_time_minutes
        """

        # Convert incident into semantic text
        incident_text = text_builder.build_incident_text(
            resolved_incident
        )

        # Generate MiniLM embedding
        embedding = embedding_service.generate_embedding(
            incident_text
        )

        # Add to FAISS
        vector_store.add_embedding(
            resolved_incident["incident_id"],
            embedding
        )

        # Persist updated index
        vector_store.save()

        return {

            "success": True,

            "message":
                "Incident successfully added to institutional memory.",

            "incident_id":
                resolved_incident["incident_id"],

            "saved_at":
                datetime.utcnow().isoformat()

        }

    ##########################################################

    def batch_add(self, incidents):

        """
        Adds multiple incidents to memory.

        Useful when importing historical incidents.
        """

        count = 0

        for incident in incidents:

            self.save_to_memory(incident)

            count += 1

        return {

            "success": True,

            "total_added": count

        }

    ##########################################################

    def memory_statistics(self):

        """
        Returns current memory statistics.
        """

        return {

            "stored_vectors":
                vector_store.total_vectors(),

            "vector_dimension":
                vector_store.dimension

        }

    ##########################################################

    def rebuild_memory(self):

        """
        Clears and rebuilds the vector memory.

        Normally this is only required if the
        incident dataset changes completely.
        """

        raise NotImplementedError(
            "Use build_index.py to rebuild the entire vector store."
        )


memory_service = MemoryService()