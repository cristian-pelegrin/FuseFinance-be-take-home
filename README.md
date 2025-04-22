# Fuse Take Home Challenge

This project is a solution for the [Fuse Finance Backend Take Home Challenge](https://github.com/FuseFinance/be-take-home). It's built using the [NestJS](https://docs.nestjs.com) framework and implements a stock trading system with daily email reports.

## Project Overview

This application provides:
- Stock trading functionality through the Fuse API
- Portfolio holdings management
- Transaction history tracking
- Automated daily email reports of transactions

## Report

[Report](REPORT.md) contains the decisions and assumptions made for this project.

## Prerequisites

- Node.js (v20 or higher)
- npm (v10 or higher)
- Docker (v24 or higher)
- Docker Compose (v2 or higher)

## Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Configure the following environment variables in `.env`:
```bash
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=fuse
DB_PASSWORD=fusepass
DB_DATABASE=fusedb

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DEFAULT_TTL=60000

# Fuse API
FUSE_API_URL=your_fuse_api_url
FUSE_API_KEY=your_fuse_api_key

# Email Configuration
EMAIL_REPORT_RECIPIENT=test@test.com
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_FROM=no-reply@fuse.local
# Email Configuration (only required for production)
SMTP_USER=
SMTP_PASS=
```

## Running the Application

### Recommended: Docker Compose (Development Environment)

The application is designed to run with Docker Compose, which provides all necessary services:

```bash
# Build and start all services
$ docker compose up --build

# Run in detached mode
$ docker compose up -d

# Stop all services
$ docker compose down
```

#### Docker Services

The Docker Compose setup includes the following services:

1. **Application Service**
   - NestJS application
   - Exposed on port 3000
   - Hot-reload enabled for development

2. **PostgreSQL Database**
   - Version: Latest
   - Exposed on port 5432
   - Default credentials in .env file

3. **Redis**
   - Used for caching stock data
   - Exposed on port 6379
   - Default TTL: 60 seconds

4. **Mailhog** (Development Email Service)
   - SMTP server for development
   - Web interface for viewing emails
   - Web UI available at [http://localhost:8025](http://localhost:8025)

### Alternative: Local Development

While Docker is recommended, you can run the application locally:

1. Install PostgreSQL and Redis locally
2. Update .env file with local connection details:
   ```bash
   DB_HOST=localhost
   REDIS_HOST=localhost
   ```
3. Install dependencies:
   ```bash
   $ npm install
   ```
4. Start the application:
   ```bash
   # development
   $ npm run start

   # watch mode
   $ npm run start:dev
   ```

## Testing

### Running Tests

```bash
# unit tests
$ npm run test

# e2e tests - run in Docker environment
$ docker compose run --rm app npm run test:e2e

# test coverage
$ npm run test:cov
```

## Project Structure

- `src/stocks/` - Stock-related functionality
- `src/holdings/` - Portfolio holdings management
- `src/transactions/` - Transaction processing and history
- `src/reports/` - Daily email report generation
- `src/fuse/` - Fuse API integration

## Notes
- Docker Compose is the recommended way to run the application as it ensures all dependencies and services are properly configured
- The server is running locally on [http://localhost:3000](http://localhost:3000)
- Mailhog web interface is available at [http://localhost:8025](http://localhost:8025) for viewing development emails

## API Documentation

To interact with the API, you can use the provided Postman collection.

### Importing the Postman Collection

1. Open Postman.
2. Click on "Import" in the top left corner.
3. Select the `postman/Fuse_Take_Home.postman_collection.json` file from this repository.
4. The collection will be imported, and you can use it to make requests to the API.

### Available Endpoints

- `GET /stocks` - List available stocks
- `POST /transactions` - Create a new stock transaction
- `GET /holdings` - Get current portfolio holdings

