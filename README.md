# FinSight AI

FinSight AI is an AI-powered personal finance intelligence platform that helps users track expenses, analyze spending behavior, forecast future costs, and receive smarter budgeting recommendations.

## Current Status

Phase 1 is in progress. The MVP foundation now focuses on authentication and expense tracking only.

Implemented foundation:

- Laravel API structure in `backend/`
- JWT authentication endpoints
- User registration, login, logout, and profile endpoint
- Protected expense routes
- MySQL migrations for users, expense categories, and expenses
- Default expense category seeder
- Next.js frontend structure in `frontend/`
- Register and login pages
- Dashboard placeholder
- Expense list, create, and edit pages
- Frontend API integration with loading and error states

Not implemented yet:

- AI categorization
- Forecasting
- Budget intelligence
- Full dashboard analytics

## Project Structure

```text
finsightAI/
├── backend/                 # Laravel 12 REST API
├── frontend/                # Next.js TypeScript frontend
├── ai-service/              # Reserved for FastAPI AI service
├── docs/
├── API_SPECIFICATION.md
├── DATABASE_SCHEMA.md
├── DEVELOPMENT_ROADMAP.md
└── SYSTEM_ARCHITECTURE.md
```

## Tech Stack

Frontend:

- Next.js
- TypeScript
- Tailwind CSS

Backend:

- Laravel 12
- MySQL
- JWT authentication

AI service:

- Python
- FastAPI
- Scikit-Learn

The AI service is intentionally not implemented in Phase 1.

## Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan migrate --seed
php artisan serve
```

Default backend URL:

```text
http://localhost:8000/api/v1
```

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Default frontend URL:

```text
http://localhost:3000
```

## Phase 1 API Surface

Authentication:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

Expense categories:

- `GET /api/v1/expense-categories`

Expenses:

- `GET /api/v1/expenses`
- `POST /api/v1/expenses`
- `GET /api/v1/expenses/{id}`
- `PATCH /api/v1/expenses/{id}`
- `DELETE /api/v1/expenses/{id}`

## Author

**Mark Neil Oligo**
