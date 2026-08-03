from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict

Severity = Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]


class KnowledgeResponse(BaseModel):
    id: int
    incident_id: int
    title: str
    service: str
    severity: Severity
    category: str | None
    root_cause: str
    resolution: str
    preventive_action: str
    recovery_time_minutes: int | None
    saved_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "incident_id": 1,
                "title": "API latency spike",
                "service": "auth-service",
                "severity": "HIGH",
                "category": "Performance",
                "root_cause": "Database connection pool exhaustion",
                "resolution": "Restarted the worker pool",
                "preventive_action": "Add autoscaling rules",
                "recovery_time_minutes": 18,
                "saved_at": "2026-08-02T12:15:00",
            }
        },
    )
