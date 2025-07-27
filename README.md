# Project Portfolio Tracker

A full-stack web application to manage and showcase your project portfolio.

## Technology Stack
- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: SQL (Azure SQL Database compatible)

## Project Structure
```
project-portfolio-tracker/
├── client/          # React frontend
├── server/          # Node.js backend
└── README.md        # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- SQL Server or Azure SQL Database

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with your database configuration:
   ```
   DB_SERVER=your-server-name
   DB_DATABASE=your-database-name
   DB_USERNAME=your-username
   DB_PASSWORD=your-password
   PORT=5000
   ```

4. Run the server:
   ```bash
   npm start
   ```

The backend will run on http://localhost:5000

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on http://localhost:3000

### Database Setup
Run the following SQL script to create the Projects table:

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

## API Endpoints
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

## Features
- Add new projects to your portfolio
- View all projects in a clean card layout
- Edit existing projects
- Delete projects
- Responsive design
