from sqlalchemy import select, func
from backend.app.models.incident import Incident


class AnalyticsService:
    @staticmethod
    def most_common_incident_categories(session):
        stmt = (
            select(Incident.category, func.count(Incident.id).label("count"))
            .group_by(Incident.category)
            .order_by(func.count(Incident.id).desc())
        )
        return session.execute(stmt).all()

    @staticmethod
    def average_recovery_by_service(session):
        stmt = (
            select(Incident.service, func.avg(Incident.recovery_time_minutes).label("average"))
            .where(Incident.recovery_time_minutes.isnot(None))
            .group_by(Incident.service)
            .order_by(func.avg(Incident.recovery_time_minutes))
        )
        return session.execute(stmt).all()

    @staticmethod
    def incident_status_breakdown(session):
        stmt = (
            select(Incident.status, func.count(Incident.id).label("count"))
            .group_by(Incident.status)
        )
        return {status: count for status, count in session.execute(stmt).all()}
