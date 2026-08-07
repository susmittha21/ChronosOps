from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.database import get_session
from backend.app.models.incident import Incident
from backend.app.schemas.common import ErrorResponse
from backend.app.schemas.incident import SaveToMemoryRequest
from backend.app.schemas.knowledge import KnowledgeResponse
from backend.app.services.knowledge_service import KnowledgeService

# ===========================
# AI Integration
# ===========================
from backend.app.ai.memory.memory_service import memory_service

router = APIRouter(
    prefix="/api/v1/knowledge",
    tags=["Institutional Memory"]
)


@router.post(
    "/incidents/{incident_id}",
    response_model=KnowledgeResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        201: {"description": "Knowledge saved", "model": KnowledgeResponse},
        404: {"description": "Incident not found", "model": ErrorResponse},
        409: {"description": "Incident cannot be saved to memory", "model": ErrorResponse},
        422: {"description": "Validation error", "model": ErrorResponse},
    },
    summary="Save an incident to Institutional Memory",
    description="Persist a resolved incident into the knowledge base once it is not already saved.",
)
def save_incident_to_memory(
    incident_id: int,
    payload: SaveToMemoryRequest,
    session: Session = Depends(get_session),
) -> KnowledgeResponse:

    incident = session.get(Incident, incident_id)

    if incident is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident not found",
        )

    if incident.status not in {
        "RESOLVED_NOT_SAVED",
        "RESOLVED_SAVED",
    }:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Only resolved incidents can be saved to Institutional Memory",
        )

    if incident.saved_to_memory:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Incident is already saved to Institutional Memory",
        )

    payload_data = payload.model_dump(exclude_unset=True)

    knowledge = KnowledgeService.save_incident_to_memory(
        session,
        incident,
        payload_data,
    )

    # ====================================================
    # AI MEMORY INTEGRATION
    # ====================================================

    try:

        resolved_incident = {
            "incident_id": incident.id,
            "title": incident.title,
            "service": incident.service,
            "severity": incident.severity,
            "category": incident.category,
            "symptoms": incident.description,
            "error_message": incident.error_message,
            "root_cause": getattr(knowledge, "root_cause", ""),
            "resolution": getattr(knowledge, "resolution", ""),
            "preventive_action": getattr(knowledge, "preventive_action", ""),
            "recovery_time_minutes": getattr(
                knowledge,
                "recovery_time_minutes",
                0,
            ),
        }

        memory_service.save_to_memory(
            resolved_incident
        )

    except Exception as e:
        print(f"AI Memory Update Failed: {e}")

    # ====================================================

    return KnowledgeResponse.model_validate(
        knowledge
    )


@router.get(
    "/",
    response_model=list[KnowledgeResponse],
    responses={
        200: {"description": "Knowledge records", "model": list[KnowledgeResponse]},
        422: {"description": "Validation error", "model": ErrorResponse},
    },
    summary="List knowledge records",
    description="Retrieve knowledge entries with optional search text.",
)
def list_knowledge_records(
    query: str | None = Query(default=None, min_length=2),
    session: Session = Depends(get_session),
) -> list[KnowledgeResponse]:

    records = KnowledgeService.list_knowledge_records(
        session,
        query,
    )

    return [
        KnowledgeResponse.model_validate(record)
        for record in records
    ]


@router.get(
    "/{knowledge_id}",
    response_model=KnowledgeResponse,
    responses={
        200: {"description": "Knowledge record found", "model": KnowledgeResponse},
        404: {"description": "Knowledge record not found", "model": ErrorResponse},
    },
    summary="Get a knowledge record",
    description="Retrieve a single knowledge entry by its identifier.",
)
def get_knowledge_record(
    knowledge_id: int,
    session: Session = Depends(get_session),
) -> KnowledgeResponse:

    from backend.app.models.knowledge import KnowledgeRecord

    record = session.get(
        KnowledgeRecord,
        knowledge_id,
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge record not found",
        )

    return KnowledgeResponse.model_validate(
        record
    )