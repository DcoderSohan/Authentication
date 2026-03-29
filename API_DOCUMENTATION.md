# API Documentation - Task Management System (Auth & CRUD)

This API manages user authentication and task CRUD with role-based access.

## Base URL
`http://localhost:5000/api/v1`

## Authentication

### POST `/auth/register`
Register a new user with a specific role ('user' or 'admin').
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "role": "admin"
  }
  ```
- **Success Response** (201 Created):
  ```json
  { "success": true, "message": "User registered successfully", "data": { ... } }
  ```

### POST `/auth/login`
Authenticate a user and receive a JWT.
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
- **Success Response** (200 OK):
  ```json
  { "success": true, "message": "Login successful", "data": { ... }, "token": "JWT_TOKEN_HERE" }
  ```

## Tasks (Protected by JWT)
Include `Authorization: Bearer <token>` in the header.

### GET `/tasks`
Fetch tasks.
- **Access**: User sees their tasks; Admin sees all tasks.
- **Response**: List of task objects with user details.

### POST `/tasks`
Create a new task.
- **Request Body**:
  ```json
  {
    "title": "Complete Assignment",
    "description": "Finalize backend/frontend integration",
    "status": "pending",
    "priority": "high"
  }
  ```
- **Response**: Created task object.

### PUT `/tasks/:id`
Update an existing task.
- **Access**: User can only edit own; Admin can edit all.
- **Response**: Updated task object.

### DELETE `/tasks/:id`
Remove a task.
- **Access**: User can only delete own; Admin can delete all.
- **Response**: Confirmation message.

## Health Check
### GET `/health`
Check if the API is operational.
