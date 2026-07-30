from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Literal

from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.app.config import settings
from backend.app.database import (
    database_connection,
    initialize_database,
    row_to_dict,
)


# ---------------------------------------------------------
# Utility
# ---------------------------------------------------------

def utc_now() -> str:
    """
    Return the current UTC time in ISO 8601 format.
    """
    return datetime.now(timezone.utc).isoformat()


def get_incident_or_404(incident_id: int) -> dict:
    """
    Return an incident or raise HTTP 404.
    """
    with database_connection() as connection:
        row = connection.execute(
            """
            SELECT *
            FROM incidents
            WHERE id = ?
            """,
            (incident_id,),
        ).fetchone()

    incident = row_to_dict(row)

    if incident is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident not found",
        )

    return incident


# ---------------------------------------------------------
# Request and response schemas
# ---------------------------------------------------------

Severity = Literal[
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
]

IncidentStatus = Literal[
    "OPEN",
    "INVESTIGATING",
    "RESOLVED_NOT_SAVED",
    "RESOLVED_SAVED",
]


class IncidentCreate(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=200,
    )

    service: str = Field(
        min_length=2,
        max_length=100,
    )

    severity: Severity

    category: str | None = Field(
        default=None,
        max_length=100,
    )

    description: str = Field(
        min_length=5,
    )

    error_message: str | None = None
    logs: str | None = None


class IncidentUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=3,
        max_length=200,
    )

    service: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    severity: Severity | None = None

    category: str | None = Field(
        default=None,
        max_length=100,
    )

    description: str | None = Field(
        default=None,
        min_length=5,
    )

    error_message: str | None = None
    logs: str | None = None

    status: Literal[
        "OPEN",
        "INVESTIGATING",
    ] | None = None


class IncidentResolve(BaseModel):
    root_cause: str = Field(min_length=5)
    resolution: str = Field(min_length=5)
    preventive_action: str = Field(min_length=5)

    recovery_time_minutes: int = Field(
        ge=0,
        le=100_000,
    )


class SaveToMemoryRequest(BaseModel):
    """
    All fields are optional because an engineer can:

    1. save the existing resolution without changes, or
    2. revise the details before saving.
    """

    root_cause: str | None = Field(
        default=None,
        min_length=5,
    )

    resolution: str | None = Field(
        default=None,
        min_length=5,
    )

    preventive_action: str | None = Field(
        default=None,
        min_length=5,
    )


class SimulationRequest(BaseModel):
    incident_id: int = Field(gt=0)

    action: Literal[
        "RESTART_SERVICE",
        "CLEAR_CACHE",
        "INCREASE_CONNECTION_POOL",
        "ROLLBACK_DEPLOYMENT",
    ]


class IncidentResponse(BaseModel):
    id: int
    title: str
    service: str
    severity: Severity
    category: str | None
    description: str
    error_message: str | None
    logs: str | None

    status: IncidentStatus

    root_cause: str | None
    resolution: str | None
    preventive_action: str | None
    recovery_time_minutes: int | None

    saved_to_memory: bool

    created_at: str
    updated_at: str
    resolved_at: str | None


class KnowledgeResponse(BaseModel):
    id: int
    incident_id: int
    title: str
    service: str
    severity: Severity
    category: str | None
    root_cause: str
    resolution: str
    preventive_action: str
    recovery_time_minutes: int | None
    saved_at: str


# ---------------------------------------------------------
# Application setup
# ---------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Create the database tables when FastAPI starts.
    """
    initialize_database()
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "Backend API for ChronosOps incident management, "
        "simulated remediation and Institutional Memory."
    ),
    lifespan=lifespan,
)


# React and FastAPI run on different ports during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_origin,
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


API = settings.api_prefix


# ---------------------------------------------------------
# General endpoints
# ---------------------------------------------------------

@app.get("/")
def root() -> dict:
    return {
        "application": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "documentation": "/docs",
    }


@app.get("/health")
def health_check() -> dict:
    return {
        "status": "healthy",
        "database": "connected",
    }


# ---------------------------------------------------------
# Incident endpoints
# ---------------------------------------------------------

@app.post(
    f"{API}/incidents",
    response_model=IncidentResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Incidents"],
)
def create_incident(
    payload: IncidentCreate,
) -> dict:
    now = utc_now()

    with database_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO incidents (
                title,
                service,
                severity,
                category,
                description,
                error_message,
                logs,
                status,
                saved_to_memory,
                created_at,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload.title,
                payload.service,
                payload.severity,
                payload.category,
                payload.description,
                payload.error_message,
                payload.logs,
                "OPEN",
                0,
                now,
                now,
            ),
        )

        incident_id = cursor.lastrowid

        row = connection.execute(
            """
            SELECT *
            FROM incidents
            WHERE id = ?
            """,
            (incident_id,),
        ).fetchone()

    return row_to_dict(row)


@app.get(
    f"{API}/incidents",
    response_model=list[IncidentResponse],
    tags=["Incidents"],
)
def list_incidents(
    incident_status: IncidentStatus | None = Query(
        default=None,
        alias="status",
    ),
    service: str | None = Query(default=None),
) -> list[dict]:
    query = """
        SELECT *
        FROM incidents
        WHERE 1 = 1
    """

    parameters: list[str] = []

    if incident_status is not None:
        query += " AND status = ?"
        parameters.append(incident_status)

    if service is not None:
        query += " AND LOWER(service) = LOWER(?)"
        parameters.append(service)

    query += " ORDER BY created_at DESC"

    with database_connection() as connection:
        rows = connection.execute(
            query,
            parameters,
        ).fetchall()

    return [
        row_to_dict(row)
        for row in rows
    ]


@app.get(
    f"{API}/incidents/{{incident_id}}",
    response_model=IncidentResponse,
    tags=["Incidents"],
)
def get_incident(
    incident_id: int,
) -> dict:
    return get_incident_or_404(incident_id)


@app.patch(
    f"{API}/incidents/{{incident_id}}",
    response_model=IncidentResponse,
    tags=["Incidents"],
)
def update_incident(
    incident_id: int,
    payload: IncidentUpdate,
) -> dict:
    incident = get_incident_or_404(incident_id)

    if incident["status"] in {
        "RESOLVED_NOT_SAVED",
        "RESOLVED_SAVED",
    }:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Resolved incidents cannot be modified "
                "using this endpoint"
            ),
        )

    update_data = payload.model_dump(
        exclude_unset=True
    )

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No update fields were provided",
        )

    allowed_fields = {
        "title",
        "service",
        "severity",
        "category",
        "description",
        "error_message",
        "logs",
        "status",
    }

    invalid_fields = (
        set(update_data) - allowed_fields
    )

    if invalid_fields:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid update fields",
        )

    update_data["updated_at"] = utc_now()

    assignments = ", ".join(
        f"{field} = ?"
        for field in update_data
    )

    values = list(update_data.values())
    values.append(incident_id)

    with database_connection() as connection:
        connection.execute(
            f"""
            UPDATE incidents
            SET {assignments}
            WHERE id = ?
            """,
            values,
        )

        row = connection.execute(
            """
            SELECT *
            FROM incidents
            WHERE id = ?
            """,
            (incident_id,),
        ).fetchone()

    return row_to_dict(row)


@app.post(
    f"{API}/incidents/{{incident_id}}/resolve",
    response_model=IncidentResponse,
    tags=["Incidents"],
)
def resolve_incident(
    incident_id: int,
    payload: IncidentResolve,
) -> dict:
    incident = get_incident_or_404(incident_id)

    if incident["status"] in {
        "RESOLVED_NOT_SAVED",
        "RESOLVED_SAVED",
    }:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Incident is already resolved",
        )

    now = utc_now()

    with database_connection() as connection:
        connection.execute(
            """
            UPDATE incidents
            SET root_cause = ?,
                resolution = ?,
                preventive_action = ?,
                recovery_time_minutes = ?,
                status = 'RESOLVED_NOT_SAVED',
                saved_to_memory = 0,
                resolved_at = ?,
                updated_at = ?
            WHERE id = ?
            """,
            (
                payload.root_cause,
                payload.resolution,
                payload.preventive_action,
                payload.recovery_time_minutes,
                now,
                now,
                incident_id,
            ),
        )

        row = connection.execute(
            """
            SELECT *
            FROM incidents
            WHERE id = ?
            """,
            (incident_id,),
        ).fetchone()

    return row_to_dict(row)


# ---------------------------------------------------------
# Institutional Memory endpoints
# ---------------------------------------------------------

@app.post(
    f"{API}/knowledge/incidents/{{incident_id}}",
    response_model=KnowledgeResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Institutional Memory"],
)
def save_incident_to_memory(
    incident_id: int,
    payload: SaveToMemoryRequest,
) -> dict:
    incident = get_incident_or_404(incident_id)

    if incident["status"] not in {
        "RESOLVED_NOT_SAVED",
        "RESOLVED_SAVED",
    }:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Only resolved incidents can be saved "
                "to Institutional Memory"
            ),
        )

    if incident["saved_to_memory"]:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Incident is already saved to "
                "Institutional Memory"
            ),
        )

    root_cause = (
        payload.root_cause
        or incident["root_cause"]
    )

    resolution = (
        payload.resolution
        or incident["resolution"]
    )

    preventive_action = (
        payload.preventive_action
        or incident["preventive_action"]
    )

    if not all(
        [
            root_cause,
            resolution,
            preventive_action,
        ]
    ):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                "Root cause, resolution and preventive "
                "action are required"
            ),
        )

    now = utc_now()

    with database_connection() as connection:
        existing = connection.execute(
            """
            SELECT id
            FROM knowledge_records
            WHERE incident_id = ?
            """,
            (incident_id,),
        ).fetchone()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "A knowledge record already exists "
                    "for this incident"
                ),
            )

        # Save reviewed details in the incident table.
        connection.execute(
            """
            UPDATE incidents
            SET root_cause = ?,
                resolution = ?,
                preventive_action = ?,
                saved_to_memory = 1,
                status = 'RESOLVED_SAVED',
                updated_at = ?
            WHERE id = ?
            """,
            (
                root_cause,
                resolution,
                preventive_action,
                now,
                incident_id,
            ),
        )

        cursor = connection.execute(
            """
            INSERT INTO knowledge_records (
                incident_id,
                title,
                service,
                severity,
                category,
                root_cause,
                resolution,
                preventive_action,
                recovery_time_minutes,
                saved_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                incident_id,
                incident["title"],
                incident["service"],
                incident["severity"],
                incident["category"],
                root_cause,
                resolution,
                preventive_action,
                incident["recovery_time_minutes"],
                now,
            ),
        )

        knowledge_id = cursor.lastrowid

        row = connection.execute(
            """
            SELECT *
            FROM knowledge_records
            WHERE id = ?
            """,
            (knowledge_id,),
        ).fetchone()

    return row_to_dict(row)


@app.get(
    f"{API}/knowledge",
    response_model=list[KnowledgeResponse],
    tags=["Institutional Memory"],
)
def list_knowledge_records(
    query: str | None = Query(
        default=None,
        min_length=2,
    ),
) -> list[dict]:
    sql = """
        SELECT *
        FROM knowledge_records
    """

    parameters: list[str] = []

    if query:
        search_term = f"%{query}%"

        sql += """
            WHERE title LIKE ?
               OR service LIKE ?
               OR category LIKE ?
               OR root_cause LIKE ?
               OR resolution LIKE ?
               OR preventive_action LIKE ?
        """

        parameters = [
            search_term,
            search_term,
            search_term,
            search_term,
            search_term,
            search_term,
        ]

    sql += " ORDER BY saved_at DESC"

    with database_connection() as connection:
        rows = connection.execute(
            sql,
            parameters,
        ).fetchall()

    return [
        row_to_dict(row)
        for row in rows
    ]


@app.get(
    f"{API}/knowledge/{{knowledge_id}}",
    response_model=KnowledgeResponse,
    tags=["Institutional Memory"],
)
def get_knowledge_record(
    knowledge_id: int,
) -> dict:
    with database_connection() as connection:
        row = connection.execute(
            """
            SELECT *
            FROM knowledge_records
            WHERE id = ?
            """,
            (knowledge_id,),
        ).fetchone()

    record = row_to_dict(row)

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge record not found",
        )

    return record


# ---------------------------------------------------------
# Dashboard endpoint
# ---------------------------------------------------------

@app.get(
    f"{API}/dashboard",
    tags=["Dashboard"],
)
def get_dashboard() -> dict:
    with database_connection() as connection:
        total = connection.execute(
            """
            SELECT COUNT(*) AS count
            FROM incidents
            """
        ).fetchone()["count"]

        active = connection.execute(
            """
            SELECT COUNT(*) AS count
            FROM incidents
            WHERE status IN ('OPEN', 'INVESTIGATING')
            """
        ).fetchone()["count"]

        resolved = connection.execute(
            """
            SELECT COUNT(*) AS count
            FROM incidents
            WHERE status IN (
                'RESOLVED_NOT_SAVED',
                'RESOLVED_SAVED'
            )
            """
        ).fetchone()["count"]

        pending_memory = connection.execute(
            """
            SELECT COUNT(*) AS count
            FROM incidents
            WHERE status = 'RESOLVED_NOT_SAVED'
            """
        ).fetchone()["count"]

        knowledge_count = connection.execute(
            """
            SELECT COUNT(*) AS count
            FROM knowledge_records
            """
        ).fetchone()["count"]

        average_mttr = connection.execute(
            """
            SELECT AVG(recovery_time_minutes) AS average
            FROM incidents
            WHERE recovery_time_minutes IS NOT NULL
            """
        ).fetchone()["average"]

        recent_rows = connection.execute(
            """
            SELECT id,
                   title,
                   service,
                   severity,
                   status,
                   created_at
            FROM incidents
            ORDER BY created_at DESC
            LIMIT 5
            """
        ).fetchall()

    return {
        "total_incidents": total,
        "active_incidents": active,
        "resolved_incidents": resolved,
        "pending_memory_review": pending_memory,
        "knowledge_records": knowledge_count,
        "average_mttr_minutes": (
            round(float(average_mttr), 2)
            if average_mttr is not None
            else 0
        ),
        "recent_incidents": [
            dict(row)
            for row in recent_rows
        ],
    }


# ---------------------------------------------------------
# Simulated remediation endpoint
# ---------------------------------------------------------

@app.post(
    f"{API}/simulation",
    tags=["Simulation"],
)
def simulate_remediation(
    payload: SimulationRequest,
) -> dict:
    incident = get_incident_or_404(
        payload.incident_id
    )

    simulation_steps = {
        "RESTART_SERVICE": [
            "Validate the service identifier",
            "Simulate stopping active workers",
            "Simulate restarting service workers",
            "Run a simulated health check",
        ],
        "CLEAR_CACHE": [
            "Check simulated cache availability",
            "Invalidate cached records",
            "Warm frequently accessed keys",
            "Run a simulated health check",
        ],
        "INCREASE_CONNECTION_POOL": [
            "Read the current connection limit",
            "Simulate a temporary pool increase",
            "Monitor active connections",
            "Run a simulated database health check",
        ],
        "ROLLBACK_DEPLOYMENT": [
            "Identify the previous stable version",
            "Simulate deployment rollback",
            "Restart application workers",
            "Run a simulated service health check",
        ],
    }

    return {
        "incident_id": incident["id"],
        "incident_title": incident["title"],
        "service": incident["service"],
        "action": payload.action,
        "status": "SIMULATED_SUCCESS",
        "steps": simulation_steps[payload.action],
        "message": (
            "The action was simulated. "
            "No real infrastructure was changed."
        ),
    }