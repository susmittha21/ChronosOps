from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_session
from backend.app.models.incident import Incident
from backend.app.schemas.common import ErrorResponse
from backend.app.schemas.simulation import SimulationRequest, SimulationResponse
from backend.app.services.simulation_service import SimulationService

router = APIRouter(prefix="/api/v1/simulation", tags=["Simulation"])


@router.post(
    "/",
    response_model=SimulationResponse,
    responses={
        200: {"description": "Simulation completed", "model": SimulationResponse},
        404: {"description": "Incident not found", "model": ErrorResponse},
        422: {"description": "Validation error", "model": ErrorResponse},
    },
    summary="Simulate a remediation action",
    description="Run a non-destructive simulation of a remediation action for an incident.",
)
def simulate_remediation(payload: SimulationRequest, session: Session = Depends(get_session)) -> SimulationResponse:
    incident = session.get(Incident, payload.incident_id)
    if incident is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident not found")
    result = SimulationService.simulate_incident_action(incident, payload.action)
    return SimulationResponse.model_validate(result)
