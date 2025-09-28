# StackCompare Backend API

A Node.js/Express backend API for the StackCompare application, providing authentication, health monitoring, and future AI-powered technology recommendations.

## Features

- **Express.js Server** with TypeScript
- **JWT Authentication** with dual token support (access/refresh)
- **PostgreSQL Integration** with connection pooling
- **Health Monitoring** with liveness and readiness probes
- **Rate Limiting** for API protection
- **Error Handling** with comprehensive error management
- **Testing Framework** with Jest and Supertest
- **Security Middleware** with Helmet, CORS, compression

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone and navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```

## Environment Configuration

Create a `.env` file based on `.env.example`:

```env
# Environment
NODE_ENV=development
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stackcompare
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false

# JWT
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## API Endpoints

### Health Monitoring
- `GET /health` - General health check
- `GET /health/live` - Liveness probe
- `GET /health/ready` - Readiness probe

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Testing

Run the complete test suite:
```bash
npm test
```

Run tests in watch mode during development:
```bash
npm run test:watch
```

Generate test coverage report:
```bash
npm run test:coverage
```

### Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── types/           # TypeScript type definitions
│   ├── app.ts           # Express application setup
│   └── index.ts         # Server entry point
├── tests/               # Test files
├── dist/                # Compiled JavaScript (generated)
└── coverage/            # Test coverage reports (generated)
```

## Database Setup

1. Install PostgreSQL
2. Create a database:
```sql
CREATE DATABASE stackcompare;
```

3. Update your `.env` file with database credentials
4. The application will handle connection and health checks

## Docker Support (Future)

Docker configuration will be added in future iterations for easier deployment and development.

## Security

- JWT tokens with configurable expiration
- Rate limiting on all endpoints
- Helmet.js for security headers
- CORS configuration
- Input validation and sanitization
- Error handling without information leakage

## Monitoring

The API includes comprehensive health monitoring:
- Database connection status
- Memory usage tracking
- CPU usage monitoring
- Request/response logging
- Performance metrics

## Contributing

1. Follow TypeScript best practices
2. Maintain test coverage above 80%
3. Use meaningful commit messages
4. Update documentation for API changes

## License

This project is part of the StackCompare application.
