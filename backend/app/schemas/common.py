from pydantic import BaseModel, ConfigDict


class RootResponse(BaseModel):
    application: str
    version: str
    status: str
    documentation: str

    model_config = ConfigDict(json_schema_extra={
        "example": {
            "application": "ChronosOps API",
            "version": "1.0.0",
            "status": "running",
            "documentation": "/docs",
        }
    })


class HealthResponse(BaseModel):
    status: str
    database: str

    model_config = ConfigDict(json_schema_extra={
        "example": {
            "status": "healthy",
            "database": "connected",
        }
    })


class ErrorResponse(BaseModel):
    detail: str

    model_config = ConfigDict(json_schema_extra={
        "example": {"detail": "Incident not found"}
    })
