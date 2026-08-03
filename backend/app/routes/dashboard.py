from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_session
from backend.app.schemas.dashboard import DashboardResponse
from backend.app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])


@router.get(
    "/",
    response_model=DashboardResponse,
    responses={200: {"description": "Dashboard metrics", "model": DashboardResponse}},
    summary="Get dashboard metrics",
    description="Return aggregate incident and knowledge metrics derived from the database.",
)
def get_dashboard(session: Session = Depends(get_session)) -> DashboardResponse:
    data = DashboardService.get_dashboard(session)
    return DashboardResponse.model_validate(data)
