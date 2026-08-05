from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from backend.app.database import Base


class KnowledgeRecord(Base):
    __tablename__ = "knowledge_records"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id", ondelete="CASCADE"), unique=True, nullable=False)
    title = Column(String(200), nullable=False)
    service = Column(String(100), nullable=False)
    severity = Column(String(20), nullable=False)
    category = Column(String(100))
    root_cause = Column(Text, nullable=False)
    resolution = Column(Text, nullable=False)
    preventive_action = Column(Text, nullable=False)
    recovery_time_minutes = Column(Integer)
    saved_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    incident = relationship("Incident", back_populates="knowledge_record")
