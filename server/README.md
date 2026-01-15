# PwanyStay Backend API

A comprehensive REST API for the PwanyStay property rental platform, built with Node.js, Express, PostgreSQL, and Redis. This backend handles user authentication, property listings, admin management, file uploads, and more.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [File Upload](#file-upload)
- [Caching](#caching)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Management**: Registration, login, profile management with JWT authentication
- **Admin System**: Separate admin authentication and dashboard management
- **Property Listings**: CRUD operations for rental properties with image uploads
- **Email Integration**: SendGrid integration for notifications (verification disabled by default)
- **Caching**: Redis-based caching for improved performance
- **File Upload**: Multer-based image upload with storage in public/uploads
- **Database Migrations**: SQL-based migrations for schema management
- **Session Management**: Express-session with Redis store
- **CORS Support**: Configured for cross-origin requests
- **Input Validation**: Middleware-based validation for API endpoints
- **Error Handling**: Centralized error handling with consistent responses

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Email**: SendGrid
- **Session Store**: connect-redis
- **Validation**: Custom middleware
- **Development**: Nodemon for hot reloading

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Redis (optional, for caching and sessions)
- npm or yarn

## Installation

1. Clone the repository and navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Copy environment configuration:

```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration values (see Configuration section).

## Configuration

Create a `.env` file in the server root with the following variables:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
PGHOST=localhost
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGDATABASE=pwanystay
PGPORT=5432
DATABASE_URL=postgresql://user:password@host:port/database

# Redis Configuration (optional)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES=1h

# Session Configuration
SESSION_SECRET=your_session_secret

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=your_email@example.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Cache Configuration
CACHE_TTL=60

# Admin Credentials (for seeding)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password
```

## Database Setup

1. Ensure PostgreSQL is running and create the database:

```bash
createdb pwanystay
```

2. Run the migrations to set up the schema:

```bash
npm run migrate
```

3. (Optional) Seed the database with initial data:

```bash
npm run seed
```

### Database Schema

The application uses the following main tables:

- **users**: User accounts with email verification
- **admins**: Admin accounts for management
- **resources**: Property listings with metadata and images

## Running the Application

### Development

```bash
npm run dev
```

This starts the server with hot reloading using nodemon.

### Production

```bash
npm run start
```

### Available Scripts

- `npm run dev`: Start development server
- `npm run start`: Start production server
- `npm run migrate`: Run database migrations
- `npm run seed`: Seed database with initial data
- `npm test`: Run tests

## API Documentation

All API responses follow a consistent JSON structure:

```json
{
  "success": true|false,
  "data": {...},
  "message": "Response message"
}
```

### Authentication Endpoints

#### User Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (authenticated)
- `PUT /api/auth/profile` - Update user profile (authenticated)

#### Admin Authentication

- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/auth/profile` - Get admin profile (authenticated)

### Resource Endpoints

- `GET /api/resource` - List all resources (with caching)
- `GET /api/resource/:id` - Get single resource (with caching)
- `POST /api/resource` - Create new resource (authenticated)
- `PUT /api/resource/:id` - Update resource (authenticated)
- `DELETE /api/resource/:id` - Delete resource (authenticated)

### Admin Endpoints

- `GET /api/admin/users` - List all users (admin only)
- `GET /api/admin/resources` - List all resources (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- `DELETE /api/admin/resources/:id` - Delete resource (admin only)

### Upload Endpoints

- `POST /api/upload` - Upload files (authenticated)

## Authentication

The API uses JWT tokens for authentication:

1. **Registration/Login**: Returns a JWT token
2. **Protected Routes**: Include `Authorization: Bearer <token>` header
3. **Token Expiry**: Configurable via `JWT_EXPIRES` environment variable

### Example Authentication Flow

```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password' })
});

const { data: { token } } = await response.json();

// Use token for authenticated requests
const profile = await fetch('/api/auth/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## File Upload

File uploads are handled via the `/api/upload` endpoint:

- Supports multiple file uploads
- Files stored in `server/public/uploads/`
- Accessible via `/uploads/filename`
- Integrated with property listings for image management

## Caching

Redis is used for caching GET requests:

- TTL configurable via `CACHE_TTL` (default: 60 seconds)
- Graceful fallback to no caching if Redis unavailable
- Cached responses bypass database queries for improved performance

## Error Handling

Centralized error handling provides consistent error responses:

- **400**: Bad Request (validation errors)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Internal Server Error

## Testing

Run tests with:

```bash
npm test
```

Tests are located in the `tests/` directory and use a test database.

## Deployment

### Environment Variables

Ensure all required environment variables are set in production.

### Database

- Use a production PostgreSQL instance
- Run migrations before deployment
- Consider database backups and monitoring

### Redis

- Use a managed Redis service (e.g., Redis Cloud, AWS ElastiCache)
- Configure connection pooling for high traffic

### Process Management

Use PM2 or similar for production:

```bash
npm install -g pm2
pm2 start src/index.js --name "pwanystay-api"
```

## Project Structure

```
server/
├── src/
│   ├── config/          # Database, Redis, Email configuration
│   ├── controllers/     # Route handlers
│   ├── middlewares/     # Custom middleware (auth, cache, validation)
│   ├── routes/          # API route definitions
│   └── app.js           # Express app setup
├── migrations/          # Database migration files
├── scripts/             # Utility scripts (migrate, seed)
├── tests/               # Test files
├── public/              # Static files (uploads)
├── .env.example         # Environment template
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

### Code Style

- Use ESLint configuration
- Follow consistent naming conventions
- Add JSDoc comments for functions
- Write tests for new features

## License

This project is licensed under the MIT License - see the LICENSE file for details.
