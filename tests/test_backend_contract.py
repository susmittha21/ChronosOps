import os
from pathlib import Path

os.environ["DATABASE_PATH"] = str(Path("/tmp/chronosops_test.db"))

from fastapi.testclient import TestClient

from backend.app.main import app


def test_swagger_exposes_required_paths():
    with TestClient(app) as client:
        openapi = client.get("/openapi.json")
        assert openapi.status_code == 200
        paths = openapi.json()["paths"]
        assert "/" in paths
        assert "/health" in paths
        assert "/api/v1/incidents/" in paths
        assert "/api/v1/incidents/{incident_id}" in paths
        assert "/api/v1/incidents/{incident_id}/resolve" in paths
        assert "/api/v1/knowledge/" in paths
        assert "/api/v1/knowledge/incidents/{incident_id}" in paths
        assert "/api/v1/knowledge/{knowledge_id}" in paths
        assert "/api/v1/dashboard/" in paths
        assert "/api/v1/simulation/" in paths


def test_lifecycle_enforces_status_progression():
    with TestClient(app) as client:
        created = client.post(
            "/api/v1/incidents/",
            json={
                "title": "API outage",
                "service": "billing-service",
                "severity": "HIGH",
                "category": "Availability",
                "description": "Requests started failing",
            },
        )
        incident_id = created.json()["id"]

        progressing = client.patch(
            f"/api/v1/incidents/{incident_id}",
            json={"status": "INVESTIGATING"},
        )
        assert progressing.status_code == 200

        invalid_transition = client.patch(
            f"/api/v1/incidents/{incident_id}",
            json={"status": "OPEN"},
        )
        assert invalid_transition.status_code == 409


def test_duplicate_memory_save_is_rejected():
    with TestClient(app) as client:
        created = client.post(
            "/api/v1/incidents/",
            json={
                "title": "Duplicate save test",
                "service": "payments-service",
                "severity": "MEDIUM",
                "category": "Reliability",
                "description": "A test incident for memory save",
            },
        )
        incident_id = created.json()["id"]

        resolved = client.post(
            f"/api/v1/incidents/{incident_id}/resolve",
            json={
                "root_cause": "Database pool exhaustion",
                "resolution": "Restarted worker pool",
                "preventive_action": "Add alerts",
                "recovery_time_minutes": 12,
            },
        )
        assert resolved.status_code == 200

        first_save = client.post(
            f"/api/v1/knowledge/incidents/{incident_id}",
            json={
                "root_cause": "Database pool exhaustion",
                "resolution": "Restarted worker pool",
                "preventive_action": "Add alerts",
            },
        )
        assert first_save.status_code == 201

        second_save = client.post(
            f"/api/v1/knowledge/incidents/{incident_id}",
            json={
                "root_cause": "Database pool exhaustion",
                "resolution": "Restarted worker pool",
                "preventive_action": "Add alerts",
            },
        )
        assert second_save.status_code == 409
