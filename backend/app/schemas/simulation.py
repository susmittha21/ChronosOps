from typing import Literal
from pydantic import BaseModel, ConfigDict, Field


class SimulationRequest(BaseModel):
    incident_id: int = Field(gt=0)
    action: Literal[
        "RESTART_SERVICE",
        "CLEAR_CACHE",
        "INCREASE_CONNECTION_POOL",
        "ROLLBACK_DEPLOYMENT",
    ]


class SimulationResponse(BaseModel):
    incident_id: int
    incident_title: str
    service: str
    action: str
    status: str
    steps: list[str]
    message: str

    model_config = ConfigDict(json_schema_extra={
        "example": {
            "incident_id": 1,
            "incident_title": "API latency spike",
            "service": "auth-service",
            "action": "RESTART_SERVICE",
            "status": "SIMULATED_SUCCESS",
            "steps": ["Validate the service identifier"],
            "message": "The action was simulated. No real infrastructure was changed.",
        }
    })
