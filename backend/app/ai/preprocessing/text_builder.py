"""
text_builder.py

Converts structured incident records into natural language
so that Sentence Transformers can generate high-quality embeddings.

Author: ChronosOps AI Team
"""

from typing import Dict


class TextBuilder:

    @staticmethod
    def build_incident_text(incident: Dict) -> str:
        """
        Converts an incident dictionary into a semantic paragraph.
        """

        text = f"""
Incident Title: {incident.get("title", "")}

Service: {incident.get("service", "")}

Severity: {incident.get("severity", "")}

Category: {incident.get("category", "")}

Symptoms:
{incident.get("symptoms", "")}

Error Message:
{incident.get("error_message", "")}

Root Cause:
{incident.get("root_cause", "")}

Resolution:
{incident.get("resolution", "")}

Recovery Time:
{incident.get("recovery_time_minutes", "")} minutes

Status:
{incident.get("status", "")}

Engineer Notes:
{incident.get("engineer_notes", "")}

Preventive Action:
{incident.get("preventive_action", "")}

Tags:
{incident.get("tags", "")}
"""

        return " ".join(text.split())

    @staticmethod
    def build_query_text(
        title: str,
        service: str,
        severity: str,
        category: str,
        symptoms: str,
        error_message: str
    ) -> str:
        """
        Converts a NEW incident submitted by the engineer
        into searchable text.
        """

        text = f"""
Incident Title: {title}

Service: {service}

Severity: {severity}

Category: {category}

Symptoms:
{symptoms}

Error Message:
{error_message}
"""

        return " ".join(text.split())

    @staticmethod
    def build_short_text(incident: Dict) -> str:
        """
        Creates a lightweight version used for previews.
        """

        return (
            f"{incident.get('title','')} "
            f"{incident.get('service','')} "
            f"{incident.get('symptoms','')} "
            f"{incident.get('error_message','')}"
        )


# Singleton object
text_builder = TextBuilder()