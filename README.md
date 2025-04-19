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
DB_TYPE=sqlite
DB_DATABASE=dev.db

# Fuse API
FUSE_API_URL=your_fuse_api_url
FUSE_API_KEY=your_fuse_api_key

# Email Configuration (only required for production)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=your_from_email
```

## Installation

```bash
$ npm install
```

## Running the Application

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testing

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

- The application uses SQLite for data storage in development mode
- Email reports are generated every 10 seconds in development mode for testing purposes