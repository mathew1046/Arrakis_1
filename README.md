# Arrakis / ProdSight — Integrated Production Management System

ProdSight (Arrakis) is an AI-augmented production management platform that unifies pre-production, production, post-production, and distribution into a single integrated dashboard.

This repository contains two main parts:

- backend/ — A lightweight Flask-based REST API that uses JSON files for persistence and implements authentication, user management, tasks (kanban), budget, script, VFX, and assets endpoints.
- prodsight/ — A React + TypeScript frontend (Vite) implementing role-based dashboards, Kanban task board, budget views, script management, assets, VFX pipeline UI, and AI mock integrations.

## What we've implemented so far (analysis)

High level summary:

- Backend
  - Flask application factory in backend/app.py with CORS and blueprint registration for auth, users, tasks, budget, script, vfx, and assets routes.
  - Runner script backend/run.py and entry backend/app.py allow launching a development server on port 5000.
  - Data persistence is file-based under backend/data/ (JSON files such as users.json, tasks.json, budget.json, script.json, vfx.json, assets.json).
  - Authentication appears to be JWT-based and role-aware (routes and permissions exist across routes and utils).
  - API provides endpoints for all core domains (users, tasks, budget, script, vfx, assets) and a /api/health route.
  - Error handlers and CORS are set for development convenience.
  - Dependencies are pinned in backend/requirements.txt and include Flask, Flask-RESTful, Flask-CORS, Marshmallow, python-dotenv, etc.

- Frontend
  - React + TypeScript app scaffolded with Vite under prodsight/.
  - src/App.tsx sets up routes and protected layout and imports many page components (Tasks, Budget, Script, Assets, VFX, Reports, Scheduling, BudgetManagement, etc.).
  - Role-based UI components, providers (AuthProvider, NotificationProvider), hooks (useAuth, useTasks, useBudget, useAI), and mock API client + AI mocks exist.
  - Mock JSON data mirrors backend data for offline/demo use (prodsight/src/data/*.json).
  - Dev scripts in prodsight/package.json (dev, build, preview) and Tailwind + TypeScript tooling are configured.

Features present and working (based on code inspection):
- Role-based dashboards and permission gating on frontend
- Kanban task management UI
- Budget views and budget forecasting endpoints (backend provides a /api/budget/forecast endpoint)
- Script management and scene endpoints
- VFX shot tracking and versioning endpoints
- Asset upload/download and metadata endpoints
- Mock AI services and hooks on the frontend to emulate AI breakdown and suggestions for features like budgets and VFX

Missing or partial implementations (observations / gaps):
- Persistence: Backend still uses JSON files; no database integration (Postgres/SQLite) or migrations.
- Authentication: JWT is referenced — need to confirm production-ready token management (refresh tokens, secure secret management).
- Tests: Minimal or no automated tests in the repo (some test_*.py files exist but need review).
- Real AI integration: Frontend uses mock AI services; backend doesn't appear to integrate with real AI endpoints.
- Real file storage: Assets are likely stored on disk or base64 metadata — no S3 or cloud storage integration.
- Realtime updates: No WebSocket/real-time channel for live Kanban updates.

## Requirements

- Python 3.11+ (backend)
- Node.js 18+ (frontend)
- PowerShell 5.1+ (for development scripts)

## User Roles

The system supports several user roles with different permissions:

- *Producer*: Full system access, budget approval, project oversight
- *Director*: Script management, creative decisions, AI scene breakdown
- *Production Manager*: Crew scheduling, budget tracking, task management
- *Crew*: Task updates, asset uploads, schedule viewing
- *VFX*: VFX pipeline access, shot management, version control
- *Distribution Manager*: Distribution planning, analytics access

## Architecture

mermaid
graph TD
    subgraph Frontend[Frontend - React + TypeScript]
        UI[User Interface]
        AuthP[Auth Provider]
        MockAI[AI Service Layer]
        Store[State Management]
    end

    subgraph Backend[Backend - Flask]
        API[REST API]
        Auth[JWT Auth]
        JSON[JSON Storage]
        Routes[Domain Routes]
    end

    UI --> AuthP
    UI --> MockAI
    UI --> Store
    AuthP --> API
    Store --> API
    MockAI --> API
    API --> Auth
    API --> Routes
    Routes --> JSON


## How to run (development)

Backend (Windows / PowerShell):

1. Create and activate a Python virtual environment (recommended):

powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1


2. Install dependencies:

powershell
pip install -r backend/requirements.txt


3. Run the backend (development):

powershell
python backend/run.py


The API will be reachable at http://localhost:5000 and has a health endpoint at http://localhost:5000/api/health.

Frontend (Windows / PowerShell):

1. From the repository root run:

powershell
cd prodsight; npm install


2. Start the dev server:

powershell
npm run dev


By default Vite serves on http://localhost:5173 (or port shown in the console). The frontend is configured to talk to the backend at http://localhost:5000 (CORS already allowed in development).

## Project architecture overview

- Single-page React app (Vite + TS) for the dashboard and per-role pages
- Backend Flask REST API with modular blueprints for each domain
- JSON-file-based persistence for rapid prototyping and offline demos
- Mock AI services and an abstraction layer to swap in real AI providers later

## Roadmap / Next steps (recommended priorities)

Short term (high-impact, low-effort):
- Add a simple test suite (backend unit tests for routes and utils; frontend component smoke tests).
- Add a quickstart script or PowerShell helper to create the Python venv, install dependencies, and start both servers.
- Add env sample file backend/.env.example documenting required variables (SECRET_KEY, JWT_SECRET_KEY, HOST, PORT).

Medium term:
- Migrate backend JSON persistence to a real DB (SQLite for local dev, Postgres for production). Add Alembic for migrations.
- Harden auth: add refresh tokens, secure cookie storage (if desired), and rotate secret handling via environment vars/secret manager.
- Add file storage integration for assets (S3 / signed URLs) and adjust assets endpoints.
- Replace frontend AI mocks with actual AI service integrations behind server-side API for security.
- Add WebSocket (e.g., Flask-SocketIO) or a lightweight real-time layer for Kanban and live updates.

Long term:
- Add role-based analytics, predictive budget adjustments (machine learning models), and schedule optimization.
- Add CI/CD pipeline, containerization (Docker), Kubernetes manifests for production, and observability (metrics, logs).

## How you can contribute

- Run the app locally and open issues for bugs or UX improvements.
- Add automated tests and formatters (prettier, Black, isort) to improve code quality.
- Implement database backend and migration scripts.
- Integrate real AI services behind secure backend endpoints.

## Files of interest

- backend/app.py - Flask app factory and blueprint registration.
- backend/run.py - Runner script.
- backend/requirements.txt - Backend dependencies.
- backend/routes/*.py - Route implementations for each domain.
- backend/utils/*.py - Helpers for JSON persistence and auth.
- prodsight/src/App.tsx - Frontend router and page wiring.
- prodsight/src/api/* - Mock API client and AI stubs.
- prodsight/src/data/* - Demo data used by the frontend.

## License

This project uses permissive licensing by default in the front- and back-end templates. Add a LICENSE file if required (MIT recommended for open-source).
