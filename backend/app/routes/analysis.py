from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_session
from backend.app.models.incident import Incident
from backend.app.schemas.analysis import AnalysisRequest, AnalysisResponse
from backend.app.ai.ai_service import ai_service

router = APIRouter(prefix="/api/v1/analysis", tags=["Analysis"])


@router.post("/", response_model=AnalysisResponse, summary="Analyze an incident using AI")
@router.post("/placeholder", response_model=AnalysisResponse, summary="Analyze an incident (placeholder/AI)")
def analyze_incident(payload: AnalysisRequest, session: Session = Depends(get_session)) -> AnalysisResponse:
    incident = session.get(Incident, payload.incident_id)
    if incident is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident not found")

    incident_dict = {
        "incident_id": incident.id,
        "title": incident.title,
        "service": incident.service,
        "severity": incident.severity,
        "category": incident.category,
        "symptoms": incident.description,
        "error_message": incident.error_message or "",
    }

    try:
        ai_result = ai_service.analyse_incident(incident_dict)
        similar = ai_result.get("similar_incidents", [])
        analysis_text = ai_result.get("analysis", "")

        # Clean similar incidents dictionaries for JSON serialization if needed
        clean_similar = []
        for sim in similar:
            clean_similar.append({
                "incident_id": str(sim.get("incident_id", "")),
                "title": str(sim.get("title", "")),
                "service": str(sim.get("service", "")),
                "similarity": float(sim.get("similarity", 0.0)),
                "root_cause": str(sim.get("root_cause", "")),
                "resolution": str(sim.get("resolution", "")),
            })

        return AnalysisResponse(
            incident_id=incident.id,
            status="completed",
            message="AI analysis successfully generated",
            analysis=analysis_text,
            similar_incidents=clean_similar,
            recommended_next_steps=[
                "Review the AI-generated root cause analysis and evidence.",
                "Execute the safe simulation scenario to test remediation.",
                "Resolve the incident and persist knowledge to Institutional Memory.",
            ],
            metadata={
                "similar_count": len(clean_similar),
                "ai_engine": "ChronosOps AI RAG",
            },
        )
    except Exception as e:
        return AnalysisResponse(
            incident_id=incident.id,
            status="error",
            message=f"AI analysis encounter an issue: {str(e)}",
            analysis="Analysis currently unavailable.",
            similar_incidents=[],
            recommended_next_steps=[
                "Verify service details manually.",
                "Check system logs and metrics.",
            ],
            metadata={"error": str(e)},
        )

