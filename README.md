# E-commerce Backend

Simple e-commerce backend built with Express, Prisma, and SQLite.

## Tech
- Express.js, Prisma + SQLite
- JWT Authentication + bcrypt
- express-validator
- Centralized error handling

## Setup
1. `npm install`
2. Copy `.env.example` → `.env`
3. `npx prisma migrate dev`
4. `npx prisma db seed`
5. `npm run dev`

## Test Users (from seed)
- Admin: `admin@test.com` / `admin123`
- User: `user@test.com` / `user123`

## Endpoints
### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login (returns JWT)
- `GET /api/auth/me` — Current user (JWT required)

## Response Format
`{ success, data, message }`

## Not Implemented
Categories, Products CRUD, User Images, Favorites — planned for week 2.
