// Backend server with SQLite for local development

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// SQLite database setup
const dbPath = path.join(__dirname, 'portfolio.db');
const db = new sqlite3.Database(dbPath);

// Create table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        technologies VARCHAR(255),
        project_url VARCHAR(255),
        github_url VARCHAR(255)
    )`);

    // Insert sample data
    db.get("SELECT COUNT(*) as count FROM Projects", (err, row) => {
        if (row.count === 0) {
            const stmt = db.prepare(`INSERT INTO Projects (title, description, technologies, project_url, github_url) VALUES (?, ?, ?, ?, ?)`);
            stmt.run('Project Portfolio Tracker', 'A full-stack web application to manage and showcase project portfolios', 'React.js, Node.js, Express.js, SQLite', 'https://example.com', 'https://github.com/user/portfolio-tracker');
            stmt.run('E-commerce Website', 'Online shopping platform with user authentication and payment integration', 'HTML, CSS, JavaScript, PHP, MySQL', 'https://shop-example.com', 'https://github.com/user/ecommerce-site');
            stmt.run('Weather App', 'Real-time weather application with location-based forecasts', 'React, OpenWeather API, CSS3', 'https://weather-app-demo.com', 'https://github.com/user/weather-app');
            stmt.finalize();
            console.log('Sample data inserted');
        }
    });
});

// Routes
app.get('/api/projects', (req, res) => {
    db.all("SELECT * FROM Projects", (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});

app.post('/api/projects', (req, res) => {
    const { title, description, technologies, project_url, github_url } = req.body;
    
    if (!title) {
        res.status(400).send('Title is required');
        return;
    }

    const stmt = db.prepare(`INSERT INTO Projects (title, description, technologies, project_url, github_url) VALUES (?, ?, ?, ?, ?)`);
    stmt.run(title, description, technologies, project_url, github_url, function(err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        
        // Get the inserted project
        db.get("SELECT * FROM Projects WHERE id = ?", this.lastID, (err, row) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }
            res.status(201).json(row);
        });
    });
    stmt.finalize();
});

app.put('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, technologies, project_url, github_url } = req.body;
    
    if (!title) {
        res.status(400).send('Title is required');
        return;
    }

    const stmt = db.prepare(`UPDATE Projects SET title = ?, description = ?, technologies = ?, project_url = ?, github_url = ? WHERE id = ?`);
    stmt.run(title, description, technologies, project_url, github_url, id, function(err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.status(200).send('Project updated successfully');
    });
    stmt.finalize();
});

app.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    
    const stmt = db.prepare(`DELETE FROM Projects WHERE id = ?`);
    stmt.run(id, function(err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.status(200).send('Project deleted successfully');
    });
    stmt.finalize();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Database file: ${dbPath}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nReceived SIGINT. Graceful shutdown...');
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\nReceived SIGTERM. Graceful shutdown...');
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});
