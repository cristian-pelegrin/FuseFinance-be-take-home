# Fuse Take Home Challenge

This project is a solution for the [Fuse Finance Backend Take Home Challenge](https://github.com/FuseFinance/be-take-home). It's built using the [NestJS](https://docs.nestjs.com) framework and implements a stock trading system with daily email reports.

## Project Overview

This application provides:
- Stock trading functionality through the Fuse API
- Portfolio holdings management
- Transaction history tracking
- Automated daily email reports of transactions

## Email Service Implementation

The project implements a flexible email service with two modes:
- **Development Mode**: Uses Ethereal Email (test email service) for development and testing
- **Production Mode**: Uses a real SMTP server for production environments

The email service is configured through environment variables and automatically switches between development and production modes based on the `NODE_ENV` setting.

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

# Fuse API
FUSE_API_URL=your_fuse_api_url
FUSE_API_KEY=your_fuse_api_key

# Email Configuration (only required for production)
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_FROM=no-reply@fuse.local
SMTP_USER=
SMTP_PASS=

# Report Generation
REPORT_CRON_EXPRESSION=*/10 * * * * *
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
   - Used for caching
   - Exposed on port 6379

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

   # production mode
   $ npm run start:prod
   ```

## Testing

### Running Tests with Docker

```bash
# Run all tests in Docker environment
$ docker compose run --rm app npm run test

# Run e2e tests
$ docker compose run --rm app npm run test:e2e

# Run tests with coverage
$ docker compose run --rm app npm run test:cov
```

### Running Tests Locally

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Project Structure

- `src/stocks/` - Stock-related functionality
- `src/holdings/` - Portfolio holdings management
- `src/transactions/` - Transaction processing and history
- `src/reports/` - Daily email report generation
- `src/fuse/` - Fuse API integration

## API Endpoints

- `GET /stocks` - List available stocks
- `POST /transactions` - Create a new stock transaction
- `GET /holdings` - Get current portfolio holdings

## Notes

- The application uses PostgreSQL for data storage
- Email reports are generated every 10 seconds in development mode for testing purposes
- The server is running locally on [http://localhost:3000](http://localhost:3000)
- Mailhog web interface is available at [http://localhost:8025](http://localhost:8025) for viewing development emails
- All services are configured through environment variables
- Docker Compose is the recommended way to run the application as it ensures all dependencies and services are properly configured
