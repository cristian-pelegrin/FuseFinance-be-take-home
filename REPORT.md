# Decisions and Assumptions

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
