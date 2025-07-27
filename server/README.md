# Project Portfolio Tracker - Backend

Node.js Express server with SQL Server database integration.

## Prerequisites
- Node.js (v14 or higher)
- SQL Server or Azure SQL Database

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Configuration**
   - Copy `.env.example` to `.env`
   - Update the database connection details in `.env`:
   ```
   DB_SERVER=your-server-name.database.windows.net
   DB_DATABASE=your-database-name
   DB_USERNAME=your-username
   DB_PASSWORD=your-password
   PORT=5000
   ```

3. **Create Database Table**
   - Connect to your SQL Server/Azure SQL Database
   - Run the SQL script from `database.sql` to create the Projects table

4. **Start the Server**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create a new project |
| PUT | `/api/projects/:id` | Update a project by ID |
| DELETE | `/api/projects/:id` | Delete a project by ID |

## Request/Response Examples

### GET /api/projects
**Response:**
```json
[
  {
    "id": 1,
    "title": "Project Title",
    "description": "Project description",
    "technologies": "React, Node.js",
    "project_url": "https://example.com",
    "github_url": "https://github.com/user/repo"
  }
]
```

### POST /api/projects
**Request Body:**
```json
{
  "title": "New Project",
  "description": "Description of the project",
  "technologies": "React, Express",
  "project_url": "https://example.com",
  "github_url": "https://github.com/user/repo"
}
```

## Database Schema

```sql
CREATE TABLE Projects (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    technologies VARCHAR(255),
    project_url VARCHAR(255),
    github_url VARCHAR(255)
);
```
