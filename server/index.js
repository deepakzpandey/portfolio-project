// Backend server with Node.js and Express.js

const express = require('express');
const sql = require('mssql');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const config = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, 
    database: process.env.DB_DATABASE
};

// Connect to the database
sql.connect(config).then(pool => {
    if(pool.connecting) {
        console.log('Connecting to the database...');
    }
    if(pool.connected) {
        console.log('Connected to the database');
    }

    // Routes
    app.get('/api/projects', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM Projects');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    app.post('/api/projects', async (req, res) => {
        const { title, description, technologies, project_url, github_url } = req.body;
        try {
            const result = await pool.request()
                .input('title', sql.NVarChar, title)
                .input('description', sql.Text, description)
                .input('technologies', sql.NVarChar, technologies)
                .input('project_url', sql.NVarChar, project_url)
                .input('github_url', sql.NVarChar, github_url)
                .query(`INSERT INTO Projects (title, description, technologies, project_url, github_url) VALUES (@title, @description, @technologies, @project_url, @github_url);
                        SELECT * FROM Projects WHERE id = SCOPE_IDENTITY();`);
            res.status(201).json(result.recordset[0]);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    app.put('/api/projects/:id', async (req, res) => {
        const { id } = req.params;
        const { title, description, technologies, project_url, github_url } = req.body;
        try {
            await pool.request()
                .input('id', sql.Int, id)
                .input('title', sql.NVarChar, title)
                .input('description', sql.Text, description)
                .input('technologies', sql.NVarChar, technologies)
                .input('project_url', sql.NVarChar, project_url)
                .input('github_url', sql.NVarChar, github_url)
                .query(`UPDATE Projects SET title = @title, description = @description, technologies = @technologies, project_url = @project_url, github_url = @github_url WHERE id = @id`);
            res.status(200).send('Project updated successfully');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    app.delete('/api/projects/:id', async (req, res) => {
        const { id } = req.params;
        try {
            await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM Projects WHERE id = @id');
            res.status(200).send('Project deleted successfully');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

}).catch(err => {
    console.error('Database connection failed: ', err);
    process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

