from datetime import datetime
from sqlalchemy import Boolean, CheckConstraint, Column, DateTime, Integer, String, Text
from sqlalchemy.orm import relationship
from backend.app.database import Base


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    service = Column(String(100), nullable=False)
    severity = Column(String(20), nullable=False)
    category = Column(String(100))
    description = Column(Text, nullable=False)
    error_message = Column(Text)
    logs = Column(Text)

    status = Column(String(30), nullable=False, default="OPEN")
    root_cause = Column(Text)
    resolution = Column(Text)
    preventive_action = Column(Text)
    recovery_time_minutes = Column(Integer)
    saved_to_memory = Column(Boolean, nullable=False, default=False)

    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    resolved_at = Column(DateTime(timezone=True))

    knowledge_record = relationship(
        "KnowledgeRecord",
        back_populates="incident",
        uselist=False,
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        CheckConstraint(
            "severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')",
            name="chk_incident_severity",
        ),
        CheckConstraint(
            "status IN ('OPEN', 'INVESTIGATING', 'RESOLVED_NOT_SAVED', 'RESOLVED_SAVED')",
            name="chk_incident_status",
        ),
    )
