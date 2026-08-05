from sqlalchemy import select, func
from backend.app.models.incident import Incident
from backend.app.models.knowledge import KnowledgeRecord


class DashboardService:
    @staticmethod
    def get_dashboard(session):
        total = session.scalar(select(func.count()).select_from(Incident)) or 0
        active = session.scalar(
            select(func.count()).select_from(Incident).where(Incident.status.in_(["OPEN", "INVESTIGATING"]))
        ) or 0
        resolved = session.scalar(
            select(func.count()).select_from(Incident).where(Incident.status.in_(["RESOLVED_NOT_SAVED", "RESOLVED_SAVED"]))
        ) or 0
        pending_memory = session.scalar(
            select(func.count()).select_from(Incident).where(Incident.status == "RESOLVED_NOT_SAVED")
        ) or 0
        knowledge_count = session.scalar(select(func.count()).select_from(KnowledgeRecord)) or 0
        average_mttr = session.scalar(
            select(func.avg(Incident.recovery_time_minutes)).where(Incident.recovery_time_minutes.isnot(None))
        ) or 0
        recent_rows = session.scalars(select(Incident).order_by(Incident.created_at.desc()).limit(5)).all()

        return {
            "total_incidents": total,
            "active_incidents": active,
            "resolved_incidents": resolved,
            "pending_memory_review": pending_memory,
            "knowledge_records": knowledge_count,
            "average_mttr_minutes": float(average_mttr),
            "recent_incidents": [
                {
                    "id": item.id,
                    "title": item.title,
                    "service": item.service,
                    "severity": item.severity,
                    "status": item.status,
                    "created_at": item.created_at,
                }
                for item in recent_rows
            ],
        }
