"""
ai_service.py

ChronosOps AI Orchestrator

Responsibilities
----------------
1. Analyse a new incident
2. Retrieve similar incidents
3. Generate AI analysis
4. Save resolved incidents into memory
"""

from backend.app.ai.retrieval.retrieval_service import retrieval_service
from backend.app.ai.llm.llm_service import llm_service
from backend.app.ai.memory.memory_service import memory_service


class AIService:

    ##########################################################

    def analyse_incident(self, current_incident: dict):

        """
        Complete AI workflow

        Input:
            Current Incident

        Output:
            Similar Incidents
            AI Analysis
        """

        # Retrieve similar incidents
        similar_incidents = retrieval_service.retrieve_similar_incidents(
            current_incident,
            top_k=3
        )

        # Generate LLM explanation
        analysis = llm_service.analyse_incident(
            current_incident=current_incident,
            similar_incidents=similar_incidents
        )

        return {

            "current_incident": current_incident,

            "similar_incidents": similar_incidents,

            "analysis": analysis

        }

    ##########################################################

    def resolve_incident(self, resolved_incident: dict):

        """
        Saves a resolved incident into institutional memory.
        """

        return memory_service.save_to_memory(
            resolved_incident
        )

    ##########################################################

    def analyse_and_store(
        self,
        current_incident,
        resolved_incident=None
    ):

        """
        Convenience function.

        Analyse first.

        Optionally save after resolution.
        """

        result = self.analyse_incident(
            current_incident
        )

        if resolved_incident:

            result["memory"] = memory_service.save_to_memory(
                resolved_incident
            )

        return result


##########################################################

ai_service = AIService()