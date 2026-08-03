from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field

Severity = Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
IncidentStatus = Literal[
    "OPEN",
    "INVESTIGATING",
    "RESOLVED_NOT_SAVED",
    "RESOLVED_SAVED",
]


class IncidentCreate(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    service: str = Field(min_length=2, max_length=100)
    severity: Severity
    category: str | None = Field(default=None, max_length=100)
    description: str = Field(min_length=5)
    error_message: str | None = None
    logs: str | None = None


class IncidentUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=200)
    service: str | None = Field(default=None, min_length=2, max_length=100)
    severity: Severity | None = None
    category: str | None = Field(default=None, max_length=100)
    description: str | None = Field(default=None, min_length=5)
    error_message: str | None = None
    logs: str | None = None
    status: IncidentStatus | None = None


class IncidentResolve(BaseModel):
    root_cause: str = Field(min_length=5)
    resolution: str = Field(min_length=5)
    preventive_action: str = Field(min_length=5)
    recovery_time_minutes: int = Field(ge=0, le=100_000)


class SaveToMemoryRequest(BaseModel):
    root_cause: str | None = Field(default=None, min_length=5)
    resolution: str | None = Field(default=None, min_length=5)
    preventive_action: str | None = Field(default=None, min_length=5)


class IncidentResponse(BaseModel):
    id: int
    title: str
    service: str
    severity: Severity
    category: str | None
    description: str
    error_message: str | None
    logs: str | None
    status: IncidentStatus
    root_cause: str | None
    resolution: str | None
    preventive_action: str | None
    recovery_time_minutes: int | None
    saved_to_memory: bool
    created_at: datetime
    updated_at: datetime
    resolved_at: datetime | None

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "title": "API latency spike",
                "service": "auth-service",
                "severity": "HIGH",
                "category": "Performance",
                "description": "Requests started timing out",
                "error_message": "503 Service Unavailable",
                "logs": "[ERROR] gateway timeouts",
                "status": "OPEN",
                "root_cause": None,
                "resolution": None,
                "preventive_action": None,
                "recovery_time_minutes": None,
                "saved_to_memory": False,
                "created_at": "2026-08-02T12:00:00",
                "updated_at": "2026-08-02T12:00:00",
                "resolved_at": None,
            }
        },
    )
