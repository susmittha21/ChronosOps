from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.database import get_session
from backend.app.schemas.common import ErrorResponse
from backend.app.schemas.incident import (
    IncidentCreate,
    IncidentResponse,
    IncidentResolve,
    IncidentUpdate,
)
from backend.app.services.incident_service import IncidentService

router = APIRouter(prefix="/api/v1/incidents", tags=["Incidents"])


@router.post(
    "/",
    response_model=IncidentResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        201: {"description": "Incident created", "model": IncidentResponse},
        422: {"description": "Validation error", "model": ErrorResponse},
    },
    summary="Create an incident",
    description="Create a new incident record for tracking and resolution workflow.",
)
def create_incident(payload: IncidentCreate, session: Session = Depends(get_session)) -> IncidentResponse:
    incident = IncidentService.create_incident(session, payload.model_dump())
    return IncidentResponse.model_validate(incident)


@router.get(
    "/",
    response_model=list[IncidentResponse],
    responses={
        200: {"description": "List of incidents", "model": list[IncidentResponse]},
        422: {"description": "Validation error", "model": ErrorResponse},
    },
    summary="List incidents",
    description="Return all incidents optionally filtered by status or service.",
)
def list_incidents(
    incident_status: str | None = Query(default=None, alias="status", description="Incident status filter"),
    service: str | None = Query(default=None, description="Service name filter"),
    session: Session = Depends(get_session),
) -> list[IncidentResponse]:
    incidents = IncidentService.list_incidents(session, incident_status, service)
    return [IncidentResponse.model_validate(item) for item in incidents]


@router.get(
    "/{incident_id}",
    response_model=IncidentResponse,
    responses={
        200: {"description": "Incident found", "model": IncidentResponse},
        404: {"description": "Incident not found", "model": ErrorResponse},
    },
    summary="Get an incident",
    description="Retrieve a single incident by its identifier.",
)
def get_incident(incident_id: int, session: Session = Depends(get_session)) -> IncidentResponse:
    incident = IncidentService.get_incident(session, incident_id)
    if incident is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident not found")
    return IncidentResponse.model_validate(incident)


@router.patch(
    "/{incident_id}",
    response_model=IncidentResponse,
    responses={
        200: {"description": "Incident updated", "model": IncidentResponse},
        404: {"description": "Incident not found", "model": ErrorResponse},
        409: {"description": "Resolved incident cannot be modified", "model": ErrorResponse},
        400: {"description": "No fields provided", "model": ErrorResponse},
        422: {"description": "Validation error", "model": ErrorResponse},
    },
    summary="Update an incident",
    description="Update incident details while the incident remains open or investigating.",
)
def update_incident(incident_id: int, payload: IncidentUpdate, session: Session = Depends(get_session)) -> IncidentResponse:
    incident = IncidentService.get_incident(session, incident_id)
    if incident is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident not found")
    if incident.status in {"RESOLVED_NOT_SAVED", "RESOLVED_SAVED"}:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Resolved incidents cannot be modified using this endpoint")
    data = payload.model_dump(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No update fields were provided")
    try:
        incident = IncidentService.update_incident(session, incident, data)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    return IncidentResponse.model_validate(incident)


@router.post(
    "/{incident_id}/resolve",
    response_model=IncidentResponse,
    responses={
        200: {"description": "Incident resolved", "model": IncidentResponse},
        404: {"description": "Incident not found", "model": ErrorResponse},
        409: {"description": "Incident already resolved", "model": ErrorResponse},
        422: {"description": "Validation error", "model": ErrorResponse},
    },
    summary="Resolve an incident",
    description="Resolve an incident and move it through the lifecycle to RESOLVED_NOT_SAVED.",
)
def resolve_incident(incident_id: int, payload: IncidentResolve, session: Session = Depends(get_session)) -> IncidentResponse:
    incident = IncidentService.get_incident(session, incident_id)
    if incident is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident not found")
    if incident.status in {"RESOLVED_NOT_SAVED", "RESOLVED_SAVED"}:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Incident is already resolved")
    incident = IncidentService.resolve_incident(session, incident, payload.model_dump())
    return IncidentResponse.model_validate(incident)
