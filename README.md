# ChronosOps

> **AI-Assisted Infrastructure Incident Management Platform**

ChronosOps helps engineering and SRE teams capture, organise, and reuse operational knowledge from resolved incidents. It combines a structured incident lifecycle, a searchable institutional memory, a RAG-based AI analysis engine, and a safe remediation simulator — all in one platform.

Built with **React + FastAPI** · Infrastructure AI Hackathon Project

---

## Table of Contents

1. [Problem](#problem)
2. [Solution](#solution)
3. [Architecture](#architecture)
4. [Incident Lifecycle](#incident-lifecycle)
5. [Features](#features)
6. [Tech Stack](#tech-stack)
7. [AI Pipeline](#ai-pipeline)
8. [Project Structure](#project-structure)
9. [Pages & UI](#pages--ui)
10. [API Reference](#api-reference)
11. [Setup & Running Locally](#setup--running-locally)
12. [Environment Variables](#environment-variables)
13. [Demo Credentials](#demo-credentials)
14. [Future Enhancements](#future-enhancements)
15. [Team](#team)

---

## Problem

Infrastructure teams frequently encounter recurring production incidents — database failures, service outages, memory leaks, cache failures, deployment issues, and network disruptions. Information about previous incidents is often scattered across support tickets, logs, documents, and individual engineers, making it hard to reuse proven solutions.

As a result:

- Engineers spend time re-investigating issues that have already been resolved.
- Mean time to recovery (MTTR) increases unnecessarily.
- Operational knowledge is trapped in individuals rather than systems.
- Similar incidents are diagnosed from scratch every time.
- Teams lack a centralised institutional memory of previous failures.

---

## Solution

ChronosOps is an incident management and institutional knowledge platform designed for infrastructure and operations teams.

The platform enables engineers to:

- **Report** new infrastructure incidents with full context (service, severity, category, symptoms, error logs).
- **Investigate** and progress incidents through a structured lifecycle.
- **Analyse** incidents using an AI pipeline that performs RAG vector search over historical memory and generates a Gemini-powered root cause explanation.
- **Simulate** approved remediation steps non-destructively before applying them to production.
- **Resolve** incidents and record root causes, resolutions, and preventive actions.
- **Save** resolved incidents to Institutional Memory — a vector-indexed, searchable knowledge base.
- **Review** operational metrics through a centralised analytics dashboard.

---

## Architecture

```
+------------------------------------------------------------------+
|                        React Frontend                            |
|   (Vite + Tailwind CSS | Login | Dashboard | Incident Pages)     |
+---------------------------+--------------------------------------+
                            |  HTTP (Vite proxy -> /api/v1)
+---------------------------v--------------------------------------+
|                      FastAPI Backend                             |
|  Routes: incidents | knowledge | analysis | analytics |          |
|          simulation | dashboard                                  |
+-----+-----------------------------------+--------------------+---+
      |                                   |                    |
+-----v------+            +---------------v-------+   +--------v--------+
|  SQLite DB |            |   AI Pipeline (RAG)   |   |  Analytics      |
| (SQLAlchemy|            |  +------------------+ |   |  Service        |
|  ORM)      |            |  | Embedding        | |   |  (MTTR, Status  |
|            |            |  | (Sentence Trans) | |   |   Breakdown)    |
|  Incidents |            |  +------------------+ |   +-----------------+
|  Knowledge |            |  | Vector Store     | |
|  Records   |            |  | (FAISS Index)    | |
+------------+            |  +------------------+ |
                          |  | Retrieval Service| |
                          |  +------------------+ |
                          |  | LLM Service      | |
                          |  | (Gemini 2.0 Flash| |
                          |  +------------------+ |
                          +-----------------------+
```

---

## Incident Lifecycle

Every incident progresses through a defined four-stage lifecycle:

```
OPEN
  |  Engineer creates incident (title, service, severity, symptoms)
  v
INVESTIGATING
  |  Engineer updates status and begins diagnosis
  v
RESOLVED_NOT_SAVED
  |  Engineer records root cause, resolution, recovery time, preventive action
  v
RESOLVED_SAVED
     Incident is persisted to Institutional Memory and indexed in FAISS
```

| Status | Description |
|--------|-------------|
| `OPEN` | Newly reported, awaiting investigation |
| `INVESTIGATING` | Actively being diagnosed |
| `RESOLVED_NOT_SAVED` | Resolution recorded but not yet in memory |
| `RESOLVED_SAVED` | Fully resolved and saved to the knowledge base |

---

## Features

| Feature | Description |
|---------|-------------|
| **Incident Management** | Create, update, and resolve infrastructure incidents |
| **Structured Lifecycle** | Four-stage incident progression with state validation |
| **AI Root Cause Analysis** | RAG pipeline retrieves similar incidents and generates Gemini explanations |
| **Vector Memory Search** | FAISS-indexed semantic search over historical resolved incidents |
| **Institutional Memory** | Searchable knowledge base of root causes, resolutions, and preventive actions |
| **Safe Remediation Simulation** | Non-destructive simulation of remediation steps before production execution |
| **Analytics Dashboard** | MTTR by service, status breakdown, most common categories |
| **Incident Filtering** | Filter by status and service name |
| **REST API + Swagger** | Full OpenAPI documentation at `/docs` |
| **Protected Frontend Routes** | Session-based authentication guarding all app pages |

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 19 + Vite 8 | UI framework and dev server |
| React Router DOM 7 | Client-side routing |
| Tailwind CSS 3 | Utility-first styling |
| Fetch API | HTTP communication with backend |

### Backend

| Technology | Purpose |
|------------|---------|
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| SQLAlchemy | ORM and database operations |
| SQLite | Persistent incident and knowledge storage |
| Pydantic + Pydantic Settings | Request/response validation and config |
| Python Dotenv | Environment variable loading |

### AI Pipeline

| Technology | Purpose |
|------------|---------|
| Sentence Transformers (`all-MiniLM-L6-v2`) | Embedding incidents into dense vector representations |
| FAISS (`faiss-cpu`) | Approximate nearest-neighbour search over incident vectors |
| Google GenAI SDK (`google-genai`) | Gemini 2.0 Flash LLM for root cause explanation generation |
| NumPy / Pandas / Scikit-learn | Numerical operations and data processing |

---

## AI Pipeline

ChronosOps implements a full **Retrieval-Augmented Generation (RAG)** pipeline:

```
New Incident
     |
     v
+---------------------+
|  Embedding Service  |  <- Sentence Transformers encode the incident
|  (all-MiniLM-L6-v2) |     into a 384-dim vector
+----------+----------+
           |
           v
+---------------------+
|  FAISS Vector Store |  <- Performs cosine-similarity search over
|  (faiss_index/)     |     all previously saved incident embeddings
+----------+----------+
           |  Top-K similar incidents
           v
+---------------------+
|  Retrieval Service  |  <- Formats retrieved incidents as structured
|                     |     context with similarity scores
+----------+----------+
           |
           v
+---------------------+
|    LLM Service      |  <- Sends current incident + historical context
|  (Gemini 2.0 Flash) |     to Gemini with a structured SRE prompt
+----------+----------+
           |
           v
     AI Analysis Output
     (Root Cause | Evidence | Remediation | Preventive Actions)
```

When an incident is saved to Institutional Memory:

```
Resolved Incident
     |
     v
+---------------------+
|  Memory Service     |  <- Embeds the resolved incident and appends
|                     |     it to the FAISS index for future searches
+---------------------+
```

---

## Project Structure

```
chronosops/
+-- backend/
|   +-- app/
|   |   +-- ai/
|   |   |   +-- ai_service.py          # AI orchestrator (analyse + resolve)
|   |   |   +-- embedding/             # Sentence Transformer embedding
|   |   |   +-- llm/
|   |   |   |   +-- llm_service.py     # Gemini 2.0 Flash client
|   |   |   |   +-- prompts.py         # SRE system prompt
|   |   |   +-- memory/
|   |   |   |   +-- memory_service.py  # FAISS index save on resolution
|   |   |   +-- preprocessing/         # Incident text preprocessing
|   |   |   +-- retrieval/
|   |   |       +-- retrieval_service.py  # Top-K similar incident search
|   |   |       +-- vector_store.py       # FAISS index management
|   |   +-- models/
|   |   |   +-- incident.py            # Incident SQLAlchemy model
|   |   |   +-- knowledge.py           # KnowledgeRecord SQLAlchemy model
|   |   +-- routes/
|   |   |   +-- analysis.py            # POST /api/v1/analysis
|   |   |   +-- analytics.py           # GET  /api/v1/analytics/*
|   |   |   +-- dashboard.py           # GET  /api/v1/dashboard
|   |   |   +-- incidents.py           # CRUD /api/v1/incidents
|   |   |   +-- knowledge.py           # /api/v1/knowledge
|   |   |   +-- simulation.py          # POST /api/v1/simulation
|   |   +-- schemas/                   # Pydantic request/response schemas
|   |   +-- services/                  # Business logic layer
|   |   +-- config.py                  # App settings (pydantic-settings)
|   |   +-- database.py                # SQLAlchemy engine + session
|   |   +-- main.py                    # FastAPI app entry point
|   +-- data/                          # SQLite database (auto-created)
|   +-- faiss_index/                   # FAISS vector index files
+-- frontend/
|   +-- src/
|   |   +-- components/
|   |   |   +-- analysis/              # AI analysis UI components
|   |   |   +-- analytics/             # Chart and metric components
|   |   |   +-- auth/                  # ProtectedRoute guard
|   |   |   +-- dashboard/             # Dashboard stat cards
|   |   |   +-- forms/                 # Reusable form inputs
|   |   |   +-- knowledge/             # Knowledge card and filter
|   |   |   +-- layout/                # Sidebar and Topbar
|   |   |   +-- simulation/            # Simulation comparison cards
|   |   |   +-- ui/                    # Generic UI primitives (Card, Icons)
|   |   +-- constants/
|   |   |   +-- config.js              # API base URL constant
|   |   +-- pages/
|   |   |   +-- Analytics.jsx          # Operational metrics page
|   |   |   +-- Dashboard.jsx          # Main incident overview
|   |   |   +-- IncidentAnalysis.jsx   # AI analysis & simulation page
|   |   |   +-- KnowledgeMemory.jsx    # Institutional memory browser
|   |   |   +-- Login.jsx              # Authentication page
|   |   |   +-- NewIncident.jsx        # Create incident form
|   |   |   +-- Simulation.jsx         # Standalone simulation runner
|   |   +-- services/
|   |   |   +-- api.js                 # Fetch wrapper with URL builder
|   |   |   +-- incidentService.js     # All API call functions
|   |   +-- App.jsx                    # Router + protected routes
|   |   +-- main.jsx                   # React entry point
|   +-- package.json
|   +-- vite.config.js                 # Dev server with /api proxy
+-- .env                               # Environment variables (see below)
+-- .env.example                       # Template for environment setup
+-- requirements.txt                   # Python dependencies
+-- README.md
```

---

## Pages & UI

| Page | Route | Description |
|------|-------|-------------|
| **Login** | `/login` | Authentication with demo credentials and auto-fill |
| **Dashboard** | `/` | Live incident count, recent incidents, status overview |
| **New Incident** | `/new` | Form to create a new incident (title, service, category, severity, description) |
| **Incident Analysis** | `/analysis` | Select an incident -> Run AI Analysis -> view root cause, similar incidents, evidence, and recommendations -> Run Simulation |
| **Simulation** | `/simulation` | Standalone simulation runner — select incident and remediation action, view step-by-step execution log |
| **Knowledge Memory** | `/knowledge` | Browse the institutional memory of resolved incidents with full metadata |
| **Analytics** | `/analytics` | MTTR by service, incident status breakdown, most common categories |

All pages except `/login` are protected by a session guard (`ProtectedRoute`) that checks `localStorage` for an active session.

---

## API Reference

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Application info and status |
| `GET` | `/health` | Health check — returns `{"status":"healthy","database":"connected"}` |

### Incidents

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/incidents/` | Create a new incident |
| `GET` | `/api/v1/incidents/` | List all incidents (filter by `?status=` or `?service=`) |
| `GET` | `/api/v1/incidents/{id}` | Get a single incident by ID |
| `PATCH` | `/api/v1/incidents/{id}` | Update an incident (blocked if resolved) |
| `POST` | `/api/v1/incidents/{id}/resolve` | Resolve an incident (records root cause, resolution, recovery time) |

### Institutional Memory

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/knowledge/incidents/{id}` | Save a resolved incident to memory (also indexes in FAISS) |
| `GET` | `/api/v1/knowledge/` | List all knowledge records (optional `?query=` text filter) |
| `GET` | `/api/v1/knowledge/{id}` | Get a single knowledge record |

### AI Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/analysis/` | Trigger RAG pipeline for an incident (returns root cause, similar incidents, recommendations) |

### Simulation

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/simulation/` | Run a non-destructive remediation simulation (`RESTART_SERVICE`, `SCALE_UP_POOL`, `CLEAR_CACHE`) |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/analytics/summary` | Consolidated metrics (total, resolved, avg MTTR, breakdown) |
| `GET` | `/api/v1/analytics/status-breakdown` | Incident counts per status |
| `GET` | `/api/v1/analytics/average-recovery-by-service` | Average recovery time per service |
| `GET` | `/api/v1/analytics/common-categories` | Most frequent incident categories |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/dashboard` | Dashboard summary metrics |

> Full interactive docs available at `http://127.0.0.1:8000/docs` (Swagger UI) and `http://127.0.0.1:8000/redoc` (ReDoc).

---

## Setup & Running Locally

### Prerequisites

- Python **3.11+**
- Node.js **18+**
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/susmittha21/ChronosOps.git
cd chronosops
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Open `.env` and replace the placeholder with your real Gemini API key:

```
GEMINI_API_KEY=your_actual_key_here
```

Get a free key at: https://aistudio.google.com/app/apikey

> The backend will start without a key, but the AI Analysis feature will return a fallback message instead of a real Gemini response.

### 3. Backend

Run from the **project root** (`chronosops/`):

```bash
pip install -r requirements.txt
uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

- Backend API: `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

> **Windows PowerShell users:** If you see a script execution policy error, run this once to fix it:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
> ```

### 4. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

The Vite dev server automatically proxies all `/api/*` requests to the backend — no CORS issues during development.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Recommended | Google Gemini API key for AI analysis. Get one free at https://aistudio.google.com/app/apikey |

All other settings are configured with defaults in `backend/app/config.py`:

| Setting | Default | Description |
|---------|---------|-------------|
| `app_name` | `ChronosOps API` | API title shown in docs |
| `app_version` | `1.0.0` | API version |
| `database_path` | `backend/data/chronosops.db` | SQLite file path (auto-created on startup) |
| `frontend_origin` | `http://localhost:5173` | Allowed CORS origin |

---

## Demo Credentials

The login page includes an **Auto-fill** button. Use the following credentials:

| Field | Value |
|-------|-------|
| **Email** | `admin@chronosops.io` |
| **Password** | `chronos2025` |

> Authentication uses `localStorage`-based session storage. This is a demo implementation and is not intended for production use.

---

## Future Enhancements

- [ ] Real-time incident notifications via WebSocket
- [ ] Role-based access control (SRE Lead / Engineer / Viewer)
- [ ] PostgreSQL migration for production deployments
- [ ] Persistent vector database (Pinecone / Weaviate) replacing file-based FAISS
- [ ] Automated post-incident report generation (PDF / Markdown)
- [ ] Integration with monitoring tools (PagerDuty, Datadog, Prometheus)
- [ ] Multi-tenant workspace support
- [ ] Incident escalation and assignment workflows
- [ ] Slack / Microsoft Teams notification webhooks

---

## Team

| Name | Role | Responsibilities |
|------|------|-----------------|
| **Susmittha** | Backend & Project Lead | FastAPI REST API design, SQLAlchemy models, Pydantic schemas, business logic services, SQLite database design, project architecture and coordination |
| **Abinayaa V** | AI & Retrieval Module | Sentence Transformer embeddings, FAISS vector store management, RAG retrieval pipeline, Gemini 2.0 Flash LLM integration, institutional memory service |
| **Atchaya Devi PV** | Frontend Development | React component library, Tailwind CSS UI design, page layouts (Dashboard, Analysis, Knowledge, Analytics, Simulation), client-side routing, API integration, responsive design |

---

## About ChronosOps

ChronosOps was built to solve a real pain point in infrastructure operations: the loss of institutional knowledge after every incident. By combining a disciplined incident lifecycle with a vector-indexed memory and an AI explanation layer, the platform transforms each resolved incident into a reusable asset — reducing MTTR, preventing repeated root cause investigations, and making operational knowledge a first-class concern.

> *"Every incident is a lesson. ChronosOps makes sure the lesson stays."*

---

© 2025 ChronosOps · Infrastructure AI Hackathon Project
