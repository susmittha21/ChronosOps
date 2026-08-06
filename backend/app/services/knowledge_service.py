from datetime import datetime
from sqlalchemy.orm import Session
from backend.app.models.incident import Incident
from backend.app.models.knowledge import KnowledgeRecord


class KnowledgeService:
    @staticmethod
    def list_knowledge_records(session: Session, query: str | None) -> list[KnowledgeRecord]:
        stmt = session.query(KnowledgeRecord)
        if query:
            search = f"%{query}%"
            stmt = stmt.filter(
                KnowledgeRecord.title.ilike(search)
                | KnowledgeRecord.service.ilike(search)
                | KnowledgeRecord.category.ilike(search)
                | KnowledgeRecord.root_cause.ilike(search)
                | KnowledgeRecord.resolution.ilike(search)
                | KnowledgeRecord.preventive_action.ilike(search)
            )

        return stmt.order_by(KnowledgeRecord.saved_at.desc()).all()

    @staticmethod
    def save_incident_to_memory(session: Session, incident: Incident, payload: dict[str, str]) -> KnowledgeRecord:
        incident.root_cause = payload.get("root_cause", incident.root_cause)
        incident.resolution = payload.get("resolution", incident.resolution)
        incident.preventive_action = payload.get("preventive_action", incident.preventive_action)
        incident.saved_to_memory = True
        incident.status = "RESOLVED_SAVED"
        incident.updated_at = datetime.utcnow()

        knowledge = KnowledgeRecord(
            incident=incident,
            title=incident.title,
            service=incident.service,
            severity=incident.severity,
            category=incident.category,
            root_cause=incident.root_cause,
            resolution=incident.resolution,
            preventive_action=incident.preventive_action,
            recovery_time_minutes=incident.recovery_time_minutes,
            saved_at=datetime.utcnow(),
        )

        session.add(knowledge)
        session.commit()
        session.refresh(knowledge)
        return knowledge
