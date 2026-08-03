from datetime import datetime
from pydantic import BaseModel, ConfigDict


class RecentIncident(BaseModel):
    id: int
    title: str
    service: str
    severity: str
    status: str
    created_at: datetime


class DashboardResponse(BaseModel):
    total_incidents: int
    active_incidents: int
    resolved_incidents: int
    pending_memory_review: int
    knowledge_records: int
    average_mttr_minutes: float
    recent_incidents: list[RecentIncident]

    model_config = ConfigDict(json_schema_extra={
        "example": {
            "total_incidents": 5,
            "active_incidents": 2,
            "resolved_incidents": 3,
            "pending_memory_review": 1,
            "knowledge_records": 2,
            "average_mttr_minutes": 18.5,
            "recent_incidents": [
                {
                    "id": 1,
                    "title": "API latency spike",
                    "service": "auth-service",
                    "severity": "HIGH",
                    "status": "OPEN",
                    "created_at": "2026-08-02T12:00:00",
                }
            ],
        }
    })
