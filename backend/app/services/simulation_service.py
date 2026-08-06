from backend.app.models.incident import Incident


class SimulationService:
    SIMULATION_STEPS = {
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

    @staticmethod
    def simulate_incident_action(incident: Incident, action: str) -> dict:
        return {
            "incident_id": incident.id,
            "incident_title": incident.title,
            "service": incident.service,
            "action": action,
            "status": "SIMULATED_SUCCESS",
            "steps": SimulationService.SIMULATION_STEPS[action],
            "message": "The action was simulated. No real infrastructure was changed.",
        }
