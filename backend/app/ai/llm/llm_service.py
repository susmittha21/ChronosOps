"""
ChronosOps AI
LLM Service (Google GenAI SDK)
"""

import os

from dotenv import load_dotenv

try:
    from google import genai
except Exception:  # pragma: no cover - optional dependency
    genai = None

from backend.app.ai.llm.prompts import SYSTEM_PROMPT

load_dotenv()


class LLMService:

    def __init__(self):

        self.client = None

        if genai is None:
            return

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            return

        self.client = genai.Client(
            api_key=api_key
        )

    ###########################################################

    def create_prompt(
        self,
        current_incident,
        similar_incidents
    ):

        prompt = SYSTEM_PROMPT

        prompt += "\n\n"

        prompt += "========== CURRENT INCIDENT ==========\n\n"

        prompt += f"""
Title:
{current_incident.get("title","")}

Service:
{current_incident.get("service","")}

Severity:
{current_incident.get("severity","")}

Category:
{current_incident.get("category","")}

Symptoms:
{current_incident.get("symptoms","")}

Error Message:
{current_incident.get("error_message","")}
"""

        prompt += "\n\n"

        prompt += "========== HISTORICAL INCIDENTS ==========\n"

        for i, incident in enumerate(similar_incidents, start=1):

            prompt += f"""

Historical Incident {i}

Incident ID:
{incident.get("incident_id","")}

Similarity:
{incident.get("similarity","")}

Title:
{incident.get("title","")}

Service:
{incident.get("service","")}

Root Cause:
{incident.get("root_cause","")}

Resolution:
{incident.get("resolution","")}

Recovery Time:
{incident.get("recovery_time_minutes","")} minutes

Preventive Action:
{incident.get("preventive_action","")}
"""

        prompt += """

Generate:

Likely Root Cause

Evidence

Recommended Remediation

Preventive Actions

Do NOT mention that you are an AI.
"""

        return prompt

    ###########################################################

    def analyse_incident(
        self,
        current_incident,
        similar_incidents
    ):

        prompt = self.create_prompt(
            current_incident,
            similar_incidents
        )

        if self.client is None:
            return "AI analysis is unavailable because the optional Gemini SDK is not configured."

        response = self.client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        return response.text


###############################################################

llm_service = LLMService()