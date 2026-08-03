from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.database import initialize_database
from backend.app.routes.analytics import router as analytics_router
from backend.app.routes.analysis import router as analysis_router
from backend.app.routes.dashboard import router as dashboard_router
from backend.app.routes.incidents import router as incidents_router
from backend.app.routes.knowledge import router as knowledge_router
from backend.app.routes.simulation import router as simulation_router
from backend.app.schemas.common import HealthResponse, RootResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_database()
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "Backend API for ChronosOps incident management, "
        "simulated remediation and Institutional Memory."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(incidents_router)
app.include_router(knowledge_router)
app.include_router(dashboard_router)
app.include_router(analytics_router)
app.include_router(analysis_router)
app.include_router(simulation_router)


@app.get("/", response_model=RootResponse, tags=["Health"], summary="Root endpoint")
def root() -> RootResponse:
    return RootResponse(
        application=settings.app_name,
        version=settings.app_version,
        status="running",
        documentation="/docs",
    )


@app.get("/health", response_model=HealthResponse, tags=["Health"], summary="Health check")
def health_check() -> HealthResponse:
    return HealthResponse(status="healthy", database="connected")
