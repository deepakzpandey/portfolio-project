-- SQL script to create the Projects table for Azure SQL Database

CREATE TABLE Projects (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    technologies VARCHAR(255),
    project_url VARCHAR(255),
    github_url VARCHAR(255)
);

-- Sample data (optional)
INSERT INTO Projects (title, description, technologies, project_url, github_url) VALUES
('Project Portfolio Tracker', 'A full-stack web application to manage and showcase project portfolios', 'React.js, Node.js, Express.js, SQL Server', 'https://example.com', 'https://github.com/user/portfolio-tracker'),
('E-commerce Website', 'Online shopping platform with user authentication and payment integration', 'HTML, CSS, JavaScript, PHP, MySQL', 'https://shop-example.com', 'https://github.com/user/ecommerce-site'),
('Weather App', 'Real-time weather application with location-based forecasts', 'React, OpenWeather API, CSS3', 'https://weather-app-demo.com', 'https://github.com/user/weather-app');
