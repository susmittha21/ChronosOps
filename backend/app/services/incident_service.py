from datetime import datetime
from typing import Any
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from backend.app.models.incident import Incident


class IncidentService:
    @staticmethod
    def get_incident(session: Session, incident_id: int) -> Incident | None:
        return session.get(Incident, incident_id)

    @staticmethod
    def validate_status_transition(incident: Incident, new_status: str | None) -> None:
        if new_status is None:
            return

        current_status = incident.status
        allowed_transitions = {
            "OPEN": {"INVESTIGATING"},
            "INVESTIGATING": {"RESOLVED_NOT_SAVED"},
            "RESOLVED_NOT_SAVED": {"RESOLVED_SAVED"},
            "RESOLVED_SAVED": set(),
        }

        if new_status == current_status:
            return

        if new_status not in allowed_transitions.get(current_status, set()):
            raise ValueError(
                f"Invalid status transition from {current_status} to {new_status}."
            )

    @staticmethod
    def create_incident(session: Session, payload: dict[str, Any]) -> Incident:
        incident = Incident(**payload)
        session.add(incident)
        session.commit()
        session.refresh(incident)
        return incident

    @staticmethod
    def list_incidents(session: Session, incident_status: str | None, service: str | None) -> list[Incident]:
        stmt = select(Incident)

        if incident_status is not None:
            stmt = stmt.where(Incident.status == incident_status)

        if service is not None:
            stmt = stmt.where(func.lower(Incident.service) == func.lower(service))

        return session.scalars(stmt.order_by(Incident.created_at.desc())).all()

    @staticmethod
    def update_incident(session: Session, incident: Incident, data: dict[str, Any]) -> Incident:
        requested_status = data.get("status")
        if requested_status is not None:
            IncidentService.validate_status_transition(incident, requested_status)

        for key, value in data.items():
            setattr(incident, key, value)

        incident.updated_at = datetime.utcnow()
        session.commit()
        session.refresh(incident)
        return incident

    @staticmethod
    def resolve_incident(session: Session, incident: Incident, payload: dict[str, Any]) -> Incident:
        incident.root_cause = payload["root_cause"]
        incident.resolution = payload["resolution"]
        incident.preventive_action = payload["preventive_action"]
        incident.recovery_time_minutes = payload["recovery_time_minutes"]
        incident.status = "RESOLVED_NOT_SAVED"
        incident.saved_to_memory = False
        incident.resolved_at = datetime.utcnow()
        incident.updated_at = datetime.utcnow()
        session.commit()
        session.refresh(incident)
        return incident
