# ChronosOps

AI-assisted infrastructure incident management platform that helps engineering teams reuse knowledge from previously resolved incidents to reduce investigation time and improve operational consistency.

Built using **React + FastAPI** · Infrastructure AI Hackathon Project

---

# Problem

Infrastructure teams frequently encounter recurring production incidents such as database failures, service outages, memory leaks, cache failures, deployment issues, and network disruptions. Information about previous incidents is often scattered across support tickets, logs, documents, and individual engineers, making it difficult to reuse proven solutions.

As a result:

- Engineers spend time investigating issues that have already been resolved.
- Recovery time increases.
- Operational knowledge is difficult to preserve.
- Similar incidents are repeatedly diagnosed from scratch.
- Teams lack a centralized institutional memory of previous failures.

---

# Solution

ChronosOps is an incident management and institutional knowledge platform designed for infrastructure and operations teams.

The platform allows engineers to:

- Record new infrastructure incidents
- Capture affected service, severity, symptoms, logs, and error messages
- Maintain the complete incident lifecycle
- Review and document confirmed root causes
- Store successful resolutions and preventive actions
- Build a searchable Institutional Memory of resolved incidents
- Simulate approved remediation steps safely
- View operational metrics through a centralized dashboard

Future AI integration will enable semantic retrieval of similar incidents and evidence-based recommendations while keeping engineers in control of final decisions.

---

# Architecture

![ChronosOps Architecture](./docs/architecture.png)

---

## Incident Workflow

1. Engineer reports a new infrastructure incident.
2. FastAPI validates and stores the incident.
3. Incident progresses through investigation.
4. Engineer records:
   - Root Cause
   - Resolution
   - Recovery Time
   - Preventive Action
5. Incident is marked as resolved.
6. Engineer reviews and saves it to Institutional Memory.
7. The incident becomes searchable for future investigations.
8. Dashboard metrics are automatically updated.

---

## Incident Lifecycle

```
OPEN
   ↓
INVESTIGATING
   ↓
RESOLVED_NOT_SAVED
   ↓
RESOLVED_SAVED
```

---

# Features

- Incident Management
- Institutional Memory
- Dashboard Metrics
- Resolution Tracking
- Preventive Action Recording
- Incident Timeline
- Safe Remediation Simulation
- Searchable Knowledge Repository
- REST API with Swagger Documentation
- Ready for AI Retrieval Integration

---

# Tech Stack

| Layer | Technology | Purpose |
|--------|------------|---------|
| Frontend | React + Vite | User Interface |
| Styling | Tailwind CSS | Responsive UI |
| Backend | FastAPI | REST API |
| Validation | Pydantic | Request Validation |
| Database | SQLite | Incident Storage |
| ORM / Database Layer | SQLAlchemy | Database Operations |
| API Documentation | Swagger (OpenAPI) | API Testing |
| HTTP Client | Axios | Frontend Communication |
| Charts | Recharts | Dashboard Analytics |
| Version Control | Git & GitHub | Collaboration |

### Planned AI Integration

- Sentence Transformers
- FAISS
- Semantic Similarity Search
- LLM-based Explanation Service

*(These modules are intentionally separated from the current backend implementation.)*

---

# Project Structure

| Folder | Purpose |
|---------|---------|
| `backend/app/` | FastAPI backend |
| `backend/app/routes/` | REST API endpoints |
| `backend/app/models/` | Database models |
| `backend/app/schemas/` | Request & Response schemas |
| `backend/app/services/` | Business logic |
| `backend/app/data/` | SQLite database |
| `frontend/src/components/` | Reusable UI components |
| `frontend/src/pages/` | Application pages |
| `docs/` | Architecture and documentation |

---

# Main Pages

| Page | Purpose |
|------|---------|
| Dashboard | Overall infrastructure status |
| New Incident | Create a new incident |
| Incident Analysis | View incident details |
| Institutional Memory | Search previous incidents |
| Incident Details | Complete incident timeline |
| Analytics | Operational insights |

---

# API Overview

## Health

- GET `/health`

## Incidents

- POST `/api/v1/incidents`
- GET `/api/v1/incidents`
- GET `/api/v1/incidents/{id}`
- PATCH `/api/v1/incidents/{id}`
- POST `/api/v1/incidents/{id}/resolve`

## Institutional Memory

- POST `/api/v1/knowledge/incidents/{id}`
- GET `/api/v1/knowledge`
- GET `/api/v1/knowledge/{id}`

## Dashboard

- GET `/api/v1/dashboard`

## Simulation

- POST `/api/v1/simulation`

---

# Setup

## Prerequisites

- Python 3.11+
- Node.js 18+
- Git

---

## Clone Repository

```bash
git clone https://github.com/<your-username>/ChronosOps.git
cd ChronosOps
```

---

## Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend will run at:

```
http://127.0.0.1:8000
```

Swagger Documentation:

```
http://127.0.0.1:8000/docs
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# Future Enhancements

- Semantic incident retrieval
- Similarity-based recommendations
- AI-generated root cause explanations
- Role-based authentication
- PostgreSQL migration
- Vector database integration
- Monitoring tool integration
- Automated post-incident reports

---

# Team

| Name | Role |
|------|------|
| Susmittha | Backend Development |
| Team Member 2 | Frontend Development |
| Team Member 3 | AI & Retrieval Module |

---

# About ChronosOps

ChronosOps helps infrastructure teams capture, organize, and reuse operational knowledge from resolved incidents. By maintaining a structured institutional memory and a standardized incident workflow, the platform reduces repeated investigations, improves knowledge sharing, and provides a strong foundation for future AI-assisted incident analysis.