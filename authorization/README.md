# Authentication API with JWT, Redis & Weather Service

A Node.js REST API built with Express, PostgreSQL, Sequelize, JWT Authentication, Redis Refresh Token Management, and Weather Data Integration.

## Features

- User Registration
- User Login
- JWT Access Token Authentication
- Refresh Token Management using Redis
- Protected Routes
- User Logout
- Password Reset / Forgot Password
- Weather Information API for Multiple Cities
- PostgreSQL Database Integration with Sequelize ORM

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize
- JWT (JSON Web Tokens)
- Redis
- bcryptjs
- Axios
- Cookie Parser
- Dotenv

---

## Project Structure

```text
Auth/
│
├── auth/
│   └── auth.js
│
├── controller/
│   ├── userController.js
│   └── weatherController.js
│
├── db/
│   └── dbconnection.js
│
├── model/
│   └── userModel.js
│
├── route/
│   ├── routes.js
│   └── weatherRoutes.js
│
├── redis.js
├── index.js
├── .env
├── package.json
└── package-lock.json
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd Auth
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
WEATHER_API_KEY=your_weather_api_key
```

---

## Database Setup

Make sure PostgreSQL is running.

Update database configuration inside:

```js
db/dbconnection.js
```

Example:

```js
database: authdb
username: postgres
password: your_password
```

---

## Redis Setup

Start Redis server locally:

```bash
redis-server
```

Verify:

```bash
redis-cli ping
```

Expected response:

```bash
PONG
```

---

## Run Application

```bash
npm start
```

Server runs on:

```text
http://localhost:8081
```

---

# API Endpoints

## Register User

```http
POST /api/register
```

Request Body:

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "123456"
}
```

---

## Login

```http
POST /api/login
```

Request Body:

```json
{
  "username": "john",
  "password": "123456"
}
```

Response:

```json
{
  "message": "user logged in",
  "userData": {
    "username": "john",
    "accessToken": "jwt_token"
  }
}
```

---

## Refresh Access Token

```http
POST /api/refreshtoken
```

Uses refresh token stored in HTTP-only cookie.

---

## Protected Profile Route

```http
POST /api/profile
```

Headers:

```http
Authorization: Bearer <access_token>
```

---

## Logout

```http
POST /api/logout
```

Removes refresh token from Redis and clears cookie.

---

## Forgot Password

```http
POST /api/forgot
```

Request Body:

```json
{
  "username": "john",
  "password": "oldPassword",
  "newPassword": "newPassword"
}
```

---

## Weather API

Get weather information for multiple cities.

```http
GET /api/weather?cities=Ahmedabad,Surat,Mumbai
```

Example Response:

```json
[
  {
    "city": "Ahmedabad",
    "temp": 34,
    "weather": "Partially cloudy"
  }
]
```

---

## Authentication Flow

1. User logs in.
2. Access Token is generated (15 minutes).
3. Refresh Token is generated (7 days).
4. Refresh Token is stored in Redis.
5. Protected routes require Access Token.
6. New Access Token can be generated using Refresh Token.
7. Logout removes Refresh Token from Redis.

---

## Future Improvements

- Input Validation
- Rate Limiting
- Email Verification
- Password Reset via Email
- Role Based Authorization
- Unit Testing
- Docker Support

---

## License

MIT License