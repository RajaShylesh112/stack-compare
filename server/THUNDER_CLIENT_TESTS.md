# Thunder Client Test Collection - StackCompare Auth API

## Base Configuration
- **Base URL**: `http://localhost:3001`
- **Content-Type**: `application/json` (for all POST requests)

---

## 1. User Registration

### Endpoint
**POST** `/api/auth/register`

### Headers
```
Content-Type: application/json
```

### Body (JSON)
```json
{
  "email": "john.doe@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Expected Response (201)
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid-here",
    "email": "john.doe@example.com",
    "role": "user",
    "firstName": "John",
    "lastName": "Doe"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "timestamp": "2025-09-28T06:30:00.000Z"
}
```

### Alternative Test Cases

**Minimal Registration:**
```json
{
  "email": "minimal@example.com",
  "password": "securepass"
}
```

**Invalid Email Test:**
```json
{
  "email": "invalid-email",
  "password": "password123"
}
```

---

## 2. User Login

### Endpoint
**POST** `/api/auth/login`

### Headers
```
Content-Type: application/json
```

### Body (JSON) - Using Existing Test User
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Body (JSON) - Using Admin Test User
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Expected Response (200)
```json
{
  "message": "Login successful",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "test@example.com",
    "role": "user",
    "firstName": "Test",
    "lastName": "User"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "timestamp": "2025-09-28T06:30:00.000Z"
}
```

### Invalid Login Test
```json
{
  "email": "test@example.com",
  "password": "wrongpassword"
}
```

---

## 3. Token Verification

### Endpoint
**GET** `/api/auth/verify`

### Headers
```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

### Expected Response (200)
```json
{
  "message": "Token is valid",
  "user": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "test@example.com",
    "role": "user",
    "permissions": ["read", "write"]
  },
  "timestamp": "2025-09-28T06:30:00.000Z"
}
```

### How to Get Access Token:
1. First, login using the `/api/auth/login` endpoint
2. Copy the `accessToken` from the response
3. Use it in the Authorization header as: `Bearer YOUR_TOKEN_HERE`

---

## 4. Token Refresh

### Endpoint
**POST** `/api/auth/refresh`

### Headers
```
Content-Type: application/json
```

### Body (JSON)
```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}
```

### Expected Response (200)
```json
{
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "timestamp": "2025-09-28T06:30:00.000Z"
}
```

### How to Get Refresh Token:
1. Login using the `/api/auth/login` endpoint
2. Copy the `refreshToken` from the response
3. Use it in the request body

---

## 5. User Profile

### Endpoint
**GET** `/api/auth/me`

### Headers
```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

### Expected Response (200)
```json
{
  "message": "Profile retrieved successfully",
  "user": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "test@example.com",
    "role": "user",
    "permissions": ["read", "write"]
  },
  "timestamp": "2025-09-28T06:30:00.000Z"
}
```

---

## 6. User Logout

### Endpoint
**POST** `/api/auth/logout`

### Headers
```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
Content-Type: application/json
```

### Body
No body required (empty JSON object or leave blank)

### Expected Response (200)
```json
{
  "message": "Logged out successfully",
  "timestamp": "2025-09-28T06:30:00.000Z"
}
```

---

## Test Flow Sequence

### Recommended Testing Order:

1. **Register a new user** - Use registration endpoint
2. **Login with existing user** - Use `test@example.com` / `password123`
3. **Verify token** - Use access token from login response
4. **Get user profile** - Use access token from login response
5. **Refresh token** - Use refresh token from login response
6. **Logout** - Use access token from login response

---

## Error Response Examples

### 400 Bad Request
```json
{
  "status": "error",
  "error": {
    "statusCode": 400,
    "isOperational": true
  },
  "message": "Email and password are required and must be strings",
  "timestamp": "2025-09-28T06:30:00.000Z"
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "error": {
    "statusCode": 401,
    "isOperational": true
  },
  "message": "Invalid credentials",
  "timestamp": "2025-09-28T06:30:00.000Z"
}
```

### 409 Conflict (Email already exists)
```json
{
  "status": "error",
  "error": {
    "statusCode": 409,
    "isOperational": true
  },
  "message": "User with this email already exists",
  "timestamp": "2025-09-28T06:30:00.000Z"
}
```

---

## Environment Variables

Make sure your server has these environment variables set:

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

DB_HOST=localhost
DB_PORT=5432
DB_NAME=stackcompare
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

---

## Quick Thunder Client Setup Steps

1. **Create Collection**: Name it "StackCompare Auth API"

2. **Set Base URL**: Configure environment with base URL `http://localhost:3001`

3. **Test Order**:
   - Start with Login (existing user)
   - Copy tokens for subsequent requests
   - Test protected endpoints with Authorization header

4. **Authorization Setup**:
   - For protected routes, go to "Auth" tab
   - Select "Bearer Token"
   - Paste your access token

5. **Environment Variables in Thunder Client**:
   - Create environment: `local`
   - Set `baseUrl` to `http://localhost:3001`
   - Use `{{baseUrl}}` in request URLs

---

## Server Status Check

Before testing, verify your server is running:

**GET** `http://localhost:3001/health`

Expected Response:
```json
{
  "status": "running",
  "timestamp": "2025-09-28T06:30:00.000Z",
  "uptime": 123,
  "environment": "development"
}
```

---

## Database Prerequisites

Ensure test users exist by running:
```bash
cd server
node src/database/create-test-users.js
```

This creates:
- `test@example.com` / `password123` (user role)
- `admin@example.com` / `password123` (admin role)
