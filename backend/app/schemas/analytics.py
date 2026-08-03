from pydantic import BaseModel, ConfigDict


class AverageRecoveryByServiceResponse(BaseModel):
    service: str
    average_recovery_time: float

    model_config = ConfigDict(json_schema_extra={
        "example": {
            "service": "auth-service",
            "average_recovery_time": 42.5,
        }
    })


class CommonCategoryResponse(BaseModel):
    category: str
    count: int

    model_config = ConfigDict(json_schema_extra={
        "example": {
            "category": "Database",
            "count": 3,
        }
    })
