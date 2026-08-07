from typing import Literal
from pydantic import BaseModel, Field


class AnalysisRequest(BaseModel):
    incident_id: int = Field(gt=0)
    context: str | None = Field(default=None, max_length=2000)
    requested_insight: str = Field(default="root_cause", min_length=3)


class AnalysisResponse(BaseModel):
    incident_id: int
    status: Literal["pending", "placeholder"]
    status: str
    message: str
    recommended_next_steps: list[str]
    metadata: dict[str, str] | None = None
