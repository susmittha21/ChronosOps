from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_session
from backend.app.schemas.analytics import AverageRecoveryByServiceResponse, CommonCategoryResponse
from backend.app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics"])


@router.get(
    "/status-breakdown",
    response_model=dict[str, int],
    summary="Incident status breakdown",
    description="Return the count of incidents grouped by status.",
)
def incident_status_breakdown(session: Session = Depends(get_session)) -> dict[str, int]:
    return AnalyticsService.incident_status_breakdown(session)


@router.get(
    "/average-recovery-by-service",
    response_model=list[AverageRecoveryByServiceResponse],
    summary="Average recovery by service",
    description="Return the average recovery time per service.",
)
def average_recovery_by_service(session: Session = Depends(get_session)) -> list[AverageRecoveryByServiceResponse]:
    rows = AnalyticsService.average_recovery_by_service(session)
    return [AverageRecoveryByServiceResponse(service=service, average_recovery_time=avg) for service, avg in rows]


@router.get(
    "/common-categories",
    response_model=list[CommonCategoryResponse],
    summary="Most common incident categories",
    description="Return the most common incident categories.",
)
def most_common_incident_categories(session: Session = Depends(get_session)) -> list[CommonCategoryResponse]:
    rows = AnalyticsService.most_common_incident_categories(session)
    return [CommonCategoryResponse(category=category or "Uncategorized", count=count) for category, count in rows]


@router.get(
    "/summary",
    summary="Analytics summary",
    description="Return consolidated analytics summary metrics.",
)
def analytics_summary(session: Session = Depends(get_session)) -> dict:
    status_counts = AnalyticsService.incident_status_breakdown(session)
    avg_recovery = AnalyticsService.average_recovery_by_service(session)
    categories = AnalyticsService.most_common_incident_categories(session)

    total_incidents = sum(status_counts.values())
    resolved = status_counts.get("RESOLVED_NOT_SAVED", 0) + status_counts.get("RESOLVED_SAVED", 0)

    avg_mttr = 0.0
    if avg_recovery:
        avg_mttr = round(sum(r[1] for r in avg_recovery) / len(avg_recovery), 1)

    return {
        "total_incidents": total_incidents,
        "resolved_incidents": resolved,
        "average_mttr_minutes": avg_mttr,
        "status_breakdown": status_counts,
        "service_recovery": [{"service": s, "avg_mttr": a} for s, a in avg_recovery],
        "categories": [{"category": c or "Uncategorized", "count": cnt} for c, cnt in categories],
    }

