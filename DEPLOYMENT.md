# Deployment Guide - Azure Cloud

This guide explains how to deploy the Project Portfolio Tracker to Azure.

## Prerequisites

- Azure account with active subscription
- Azure CLI installed
- Node.js installed locally

## Backend Deployment (Azure App Service)

### 1. Create Azure SQL Database

```bash
# Create resource group
az group create --name portfolio-rg --location "East US"

# Create SQL Server
az sql server create \
  --name portfolio-sql-server \
  --resource-group portfolio-rg \
  --location "East US" \
  --admin-user portfolioadmin \
  --admin-password YourSecurePassword123!

# Create SQL Database
az sql db create \
  --resource-group portfolio-rg \
  --server portfolio-sql-server \
  --name portfolio-db \
  --service-objective Basic
```

### 2. Configure Firewall Rules

```bash
# Allow Azure services
az sql server firewall-rule create \
  --resource-group portfolio-rg \
  --server portfolio-sql-server \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Allow your IP (replace with your actual IP)
az sql server firewall-rule create \
  --resource-group portfolio-rg \
  --server portfolio-sql-server \
  --name AllowMyIP \
  --start-ip-address YOUR_IP_ADDRESS \
  --end-ip-address YOUR_IP_ADDRESS
```

### 3. Create Database Table

Connect to your Azure SQL Database using SQL Server Management Studio or Azure Data Studio and run:

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

### 4. Deploy Backend to App Service

```bash
# Create App Service Plan
az appservice plan create \
  --name portfolio-plan \
  --resource-group portfolio-rg \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group portfolio-rg \
  --plan portfolio-plan \
  --name portfolio-backend-api \
  --runtime "NODE|18-lts"

# Configure app settings
az webapp config appsettings set \
  --resource-group portfolio-rg \
  --name portfolio-backend-api \
  --settings \
    DB_SERVER="portfolio-sql-server.database.windows.net" \
    DB_DATABASE="portfolio-db" \
    DB_USERNAME="portfolioadmin" \
    DB_PASSWORD="YourSecurePassword123!" \
    PORT="8080"

# Deploy code (from server directory)
cd server
zip -r deploy.zip .
az webapp deployment source config-zip \
  --resource-group portfolio-rg \
  --name portfolio-backend-api \
  --src deploy.zip
```

## Frontend Deployment (Azure Static Web Apps)

### 1. Build React App

```bash
cd client
npm run build
```

### 2. Deploy to Static Web App

```bash
# Create Static Web App
az staticwebapp create \
  --name portfolio-frontend \
  --resource-group portfolio-rg \
  --source https://github.com/YOUR_USERNAME/YOUR_REPO \
  --location "East US2" \
  --branch main \
  --app-location "/client" \
  --output-location "build"
```

### 3. Update API URL

Update the API_URL in your React app to point to your deployed backend:

```javascript
// In client/src/App.js
const API_URL = 'https://portfolio-backend-api.azurewebsites.net/api';
```

## Alternative: Container Deployment

### Docker Setup

Create `Dockerfile` in server directory:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

### Deploy to Azure Container Instances

```bash
# Build and push to Azure Container Registry
az acr create --resource-group portfolio-rg --name portfolioregistry --sku Basic
az acr build --registry portfolioregistry --image portfolio-backend .

# Deploy container
az container create \
  --resource-group portfolio-rg \
  --name portfolio-backend-container \
  --image portfolioregistry.azurecr.io/portfolio-backend:latest \
  --dns-name-label portfolio-backend \
  --ports 8080 \
  --environment-variables \
    DB_SERVER="portfolio-sql-server.database.windows.net" \
    DB_DATABASE="portfolio-db" \
    DB_USERNAME="portfolioadmin" \
    DB_PASSWORD="YourSecurePassword123!" \
    PORT="8080"
```

## Environment Variables Summary

For Azure App Service, configure these application settings:

- `DB_SERVER`: Your Azure SQL Server name
- `DB_DATABASE`: Database name
- `DB_USERNAME`: SQL Server admin username  
- `DB_PASSWORD`: SQL Server admin password
- `PORT`: 8080 (Azure App Service default)

## Security Best Practices

1. **Use Azure Key Vault** for sensitive data
2. **Enable HTTPS** for all endpoints
3. **Configure CORS** properly in production
4. **Use Managed Identity** for database connections
5. **Set up Application Insights** for monitoring

## Monitoring and Troubleshooting

- Use Azure Application Insights for performance monitoring
- Check Azure App Service logs: `az webapp log tail`
- Monitor SQL Database performance in Azure Portal
- Set up alerts for application errors and performance issues
