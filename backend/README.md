# Prodsight Backend API

A Flask-based REST API for the Prodsight film production management system.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based permissions
- **User Management**: CRUD operations for users with different roles
- **Task Management**: Kanban-style task tracking with assignments
- **Budget Management**: Budget tracking, categories, and spending history
- **Script Management**: Scene breakdown and version control
- **VFX Pipeline**: VFX shot management and version tracking
- **Asset Management**: File upload and management system

## Installation

1. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables** (optional):
   ```bash
   export SECRET_KEY="your-secret-key"
   export JWT_SECRET_KEY="your-jwt-secret"
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token

### Users
- `GET /api/users` - List all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Tasks
- `GET /api/tasks` - List all tasks
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `GET /api/tasks/assignee/{id}` - Get tasks by assignee

### Budget
- `GET /api/budget` - Get budget overview
- `PUT /api/budget/category/{name}` - Update budget category
- `POST /api/budget/history` - Add budget entry
- `GET /api/budget/categories` - Get budget categories
- `GET /api/budget/history` - Get budget history
- `GET /api/budget/forecast` - Get budget forecast

### Script
- `GET /api/script` - Get script data
- `PUT /api/script` - Update script
- `GET /api/script/scenes` - Get all scenes
- `GET /api/script/scene/{id}` - Get scene by ID
- `PUT /api/script/scene/{id}` - Update scene
- `POST /api/script/scenes` - Add scene

### VFX
- `GET /api/vfx` - Get VFX shots
- `GET /api/vfx/{id}` - Get VFX shot by ID
- `POST /api/vfx` - Create VFX shot
- `PUT /api/vfx/{id}` - Update VFX shot
- `DELETE /api/vfx/{id}` - Delete VFX shot
- `PUT /api/vfx/version/{shot_id}` - Add VFX version
- `GET /api/vfx/assignee/{id}` - Get VFX shots by assignee

### Assets
- `POST /api/assets/upload` - Upload asset
- `GET /api/assets` - List assets
- `GET /api/assets/{id}` - Get asset by ID
- `GET /api/assets/download/{filename}` - Download asset
- `DELETE /api/assets/{id}` - Delete asset
- `GET /api/assets/search` - Search assets

## Data Storage

The API uses JSON files for data persistence:
- `data/users.json` - User data
- `data/tasks.json` - Task data
- `data/budget.json` - Budget data
- `data/script.json` - Script data
- `data/vfx.json` - VFX data
- `data/assets.json` - Asset metadata

## User Roles and Permissions

- **Producer**: Full access to all features
- **Director**: Script management, task viewing, AI breakdown
- **Production Manager**: Task management, budget editing, crew management
- **Crew**: View assigned tasks, update task status, upload assets
- **VFX**: VFX task management, version uploads
- **Distribution Manager**: Distribution and analytics features

## Error Handling

All endpoints return consistent JSON responses:
```json
{
  "success": true/false,
  "data": {...},
  "message": "Description of the result"
}
```

Error responses include appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Development

The application uses Flask's development server by default. For production, consider using a WSGI server like Gunicorn.

## CORS

The API is configured to accept requests from:
- `http://localhost:3000` (React development server)
- `http://localhost:5173` (Vite development server)

Update the CORS configuration in `app.py` for production domains.
