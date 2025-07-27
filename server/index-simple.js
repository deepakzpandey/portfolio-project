// Simple backend server with SQLite for local development

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// SQLite database setup
const dbPath = path.join(__dirname, 'portfolio.db');
console.log('Initializing database at:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to SQLite database');
    
    // Create table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS Projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        technologies VARCHAR(255),
        project_url VARCHAR(255),
        github_url VARCHAR(255)
    )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
            return;
        }
        console.log('Projects table ready');
        
        // Check if we need to insert sample data
        db.get("SELECT COUNT(*) as count FROM Projects", (err, row) => {
            if (err) {
                console.error('Error checking data:', err.message);
                return;
            }
            
            if (row.count === 0) {
                console.log('Inserting sample data...');
                const sampleProjects = [
                    ['Project Portfolio Tracker', 'A full-stack web application to manage and showcase project portfolios', 'React.js, Node.js, Express.js, SQLite', 'https://example.com', 'https://github.com/user/portfolio-tracker'],
                    ['E-commerce Website', 'Online shopping platform with user authentication and payment integration', 'HTML, CSS, JavaScript, PHP, MySQL', 'https://shop-example.com', 'https://github.com/user/ecommerce-site'],
                    ['Weather App', 'Real-time weather application with location-based forecasts', 'React, OpenWeather API, CSS3', 'https://weather-app-demo.com', 'https://github.com/user/weather-app']
                ];
                
                const stmt = db.prepare(`INSERT INTO Projects (title, description, technologies, project_url, github_url) VALUES (?, ?, ?, ?, ?)`);
                sampleProjects.forEach(project => {
                    stmt.run(project);
                });
                stmt.finalize();
                console.log('Sample data inserted successfully');
            } else {
                console.log(`Found ${row.count} existing projects`);
            }
        });
    });
});

// Routes
app.get('/api/projects', (req, res) => {
    console.log('GET /api/projects requested');
    db.all("SELECT * FROM Projects", (err, rows) => {
        if (err) {
            console.error('Error fetching projects:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log(`Returning ${rows.length} projects`);
        res.json(rows);
    });
});

app.post('/api/projects', (req, res) => {
    const { title, description, technologies, project_url, github_url } = req.body;
    console.log('POST /api/projects requested:', { title });
    
    if (!title) {
        res.status(400).json({ error: 'Title is required' });
        return;
    }

    const stmt = db.prepare(`INSERT INTO Projects (title, description, technologies, project_url, github_url) VALUES (?, ?, ?, ?, ?)`);
    stmt.run(title, description, technologies, project_url, github_url, function(err) {
        if (err) {
            console.error('Error inserting project:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        
        // Get the inserted project
        db.get("SELECT * FROM Projects WHERE id = ?", this.lastID, (err, row) => {
            if (err) {
                console.error('Error fetching inserted project:', err.message);
                res.status(500).json({ error: err.message });
                return;
            }
            console.log('Project created with ID:', this.lastID);
            res.status(201).json(row);
        });
    });
    stmt.finalize();
});

app.put('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, technologies, project_url, github_url } = req.body;
    console.log('PUT /api/projects/' + id + ' requested');
    
    if (!title) {
        res.status(400).json({ error: 'Title is required' });
        return;
    }

    const stmt = db.prepare(`UPDATE Projects SET title = ?, description = ?, technologies = ?, project_url = ?, github_url = ? WHERE id = ?`);
    stmt.run(title, description, technologies, project_url, github_url, id, function(err) {
        if (err) {
            console.error('Error updating project:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Project updated:', id);
        res.status(200).json({ message: 'Project updated successfully' });
    });
    stmt.finalize();
});

app.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    console.log('DELETE /api/projects/' + id + ' requested');
    
    const stmt = db.prepare(`DELETE FROM Projects WHERE id = ?`);
    stmt.run(id, function(err) {
        if (err) {
            console.error('Error deleting project:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Project deleted:', id);
        res.status(200).json({ message: 'Project deleted successfully' });
    });
    stmt.finalize();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`📁 Database file: ${dbPath}`);
    console.log(`🔗 API endpoints available at http://localhost:${PORT}/api/projects`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT. Graceful shutdown...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('✅ Database connection closed.');
        }
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM. Graceful shutdown...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('✅ Database connection closed.');
        }
        process.exit(0);
    });
});
