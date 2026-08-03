from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_session
from backend.app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics"])


@router.get("/status-breakdown")
def incident_status_breakdown(session: Session = Depends(get_session)) -> dict:
    return AnalyticsService.incident_status_breakdown(session)


@router.get("/average-recovery-by-service")
def average_recovery_by_service(session: Session = Depends(get_session)) -> list[dict[str, float]]:
    rows = AnalyticsService.average_recovery_by_service(session)
    return [{"service": service, "average_recovery_time": avg} for service, avg in rows]


@router.get("/common-categories")
def most_common_incident_categories(session: Session = Depends(get_session)) -> list[dict[str, int]]:
    rows = AnalyticsService.most_common_incident_categories(session)
    return [{"category": category or "Uncategorized", "count": count} for category, count in rows]
