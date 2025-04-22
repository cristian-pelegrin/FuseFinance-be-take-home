# Fuse Take Home Challenge

This project is a solution for the [Fuse Finance Backend Take Home Challenge](https://github.com/FuseFinance/be-take-home). It's built using the [NestJS](https://docs.nestjs.com) framework and implements a stock trading system with daily email reports.

## Project Overview

This application provides:
- Stock trading functionality through the Fuse API
- Portfolio holdings management
- Transaction history tracking
- Automated daily email reports of transactions

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

## Decisions and Assumptions

### Architectural Decisions
- **Framework**: Chose NestJS for its modular architecture and built-in support for TypeScript.
- **Database**: Used PostgreSQL for its robustness and support for complex queries.
- **Caching**: Implemented Redis for caching stock data to improve performance and reduce API calls.
- **Retry Logic**: Added retry logic with exponential backoff for Fuse API calls to handle potential unreliability.
- **Email Service**: Used Mailhog for development email testing, assumed SMTP configuration for production.
- **Daily Email Report**: Implemented using NestJS's cron feature to schedule and send daily email reports. This approach simplifies the take-home solution by keeping all functionality within the application, reducing complexity and dependencies. However, in a real production environment, it would be advisable to use a more scalable and resource-efficient solution, such as AWS Lambda combined with CloudWatch. This would allow the scheduling and execution of tasks without consuming server resources, providing better scalability and cost-effectiveness.

### Assumptions
- **Stock Price Volatility**: Assumed stock prices could change every 1 minute, cached data accordingly.

### Testing Decisions
- **Unit Tests**: Added one unit test per service to demonstrate basic functionality and ensure core logic is working as expected.
- **End-to-End Tests**: Implemented one end-to-end test to showcase the integration of different components and the overall workflow.
- **Production Considerations**: In a real production project, I would aim for more comprehensive test coverage, including non-happy paths and edge cases, to ensure robustness and reliability.

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

