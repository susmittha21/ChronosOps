from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_session
from backend.app.models.incident import Incident
from backend.app.schemas.analysis import AnalysisRequest, AnalysisResponse

router = APIRouter(prefix="/api/v1/analysis", tags=["Analysis"])


@router.post("/placeholder", response_model=AnalysisResponse)
def analysis_placeholder(payload: AnalysisRequest, session: Session = Depends(get_session)) -> AnalysisResponse:
    incident = session.get(Incident, payload.incident_id)
    if incident is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident not found")

    return AnalysisResponse(
        incident_id=incident.id,
        status="placeholder",
        message="Analysis is available through a future AI integration. This endpoint is a safe placeholder for now.",
        recommended_next_steps=[
            "Review incident details and service context.",
            "Confirm resolution and preventive actions.",
            "Schedule AI-assisted root cause analysis in a later release.",
        ],
        metadata={
            "note": "No AI call is performed in this backend version.",
            "integration": "future-ai-service",
        },
    )
