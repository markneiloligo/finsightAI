# FinSight AI API Specification

## Phase 1 Implementation Status

Phase 1 is in progress and partially implemented for the authentication and expense tracking MVP.

Implemented Phase 1 backend surface:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET /api/v1/expense-categories`
- `GET /api/v1/expenses`
- `POST /api/v1/expenses`
- `GET /api/v1/expenses/{id}`
- `PATCH /api/v1/expenses/{id}`
- `DELETE /api/v1/expenses/{id}`

Not implemented in Phase 1:

- AI categorization endpoints.
- Forecast generation endpoints.
- AI recommendation endpoints.
- Full dashboard analytics endpoints.

## 1. API Overview

The Laravel backend exposes a versioned REST API consumed by the Next.js frontend. The AI service exposes internal REST endpoints consumed only by the backend.

Public API base path:

```text
/api/v1
```

Internal AI service base path:

```text
/internal/v1
```

All API responses use JSON.

## 2. Common Conventions

### Headers

Authenticated frontend requests:

```http
Authorization: Bearer <access_token>
Accept: application/json
Content-Type: application/json
X-Request-ID: <uuid>
```

Backend-to-AI requests:

```http
Authorization: Bearer <service_token>
Accept: application/json
Content-Type: application/json
X-Request-ID: <uuid>
X-Service-Name: finsight-backend
```

### Standard Success Envelope

```json
{
  "data": {},
  "meta": {
    "request_id": "uuid"
  }
}
```

### Standard Error Envelope

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data was invalid.",
    "details": {}
  },
  "meta": {
    "request_id": "uuid"
  }
}
```

### Pagination

List endpoints should support cursor or page pagination. Page pagination is acceptable for Phase 1.

```text
?page=1&per_page=25
```

Paginated response metadata:

```json
{
  "data": [],
  "meta": {
    "current_page": 1,
    "per_page": 25,
    "total": 125,
    "last_page": 5
  }
}
```

## 3. Authentication Architecture

Authentication is handled by the Laravel backend using JWT.

Token strategy:

- Access tokens are short-lived.
- Refresh tokens are long-lived, rotated, revocable, and preferably stored in HTTP-only secure cookies.
- Login returns user profile data and an access token.
- Refresh issues a new access token and rotates the refresh token.
- Logout revokes the active refresh token.
- Role support starts with a `role` field on `users`.

Authorization strategy:

- Laravel middleware validates JWTs.
- Laravel policies enforce ownership of user financial records.
- Admin and future advisor routes use role middleware.
- The AI service does not receive JWTs from users and does not make authorization decisions.

## 4. Public Backend API

### Health

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/v1/health` | No | API health check. |

Response:

```json
{
  "data": {
    "status": "ok",
    "service": "finsight-backend"
  }
}
```

## 5. Authentication Endpoints

### Register

```http
POST /api/v1/auth/register
```

Request:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "StrongPassword123!",
  "password_confirmation": "StrongPassword123!"
}
```

Response:

```json
{
  "data": {
    "user": {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    },
    "access_token": "jwt",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

### Login

```http
POST /api/v1/auth/login
```

Request:

```json
{
  "email": "jane@example.com",
  "password": "StrongPassword123!"
}
```

Response:

```json
{
  "data": {
    "user": {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    },
    "access_token": "jwt",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

### Refresh Token

```http
POST /api/v1/auth/refresh
```

Response:

```json
{
  "data": {
    "access_token": "new-jwt",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

### Logout

```http
POST /api/v1/auth/logout
```

Auth: required.

Response:

```json
{
  "data": {
    "message": "Logged out successfully."
  }
}
```

### Current User

```http
GET /api/v1/auth/me
```

Auth: required.

Response:

```json
{
  "data": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user"
  }
}
```

## 6. Expense Category Endpoints

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/v1/expense-categories` | Yes | List system and user categories. |
| `POST` | `/api/v1/expense-categories` | Yes | Future: create a custom category. |
| `PATCH` | `/api/v1/expense-categories/{id}` | Yes | Future: update a custom category. |
| `DELETE` | `/api/v1/expense-categories/{id}` | Yes | Future: deactivate or delete a custom category. |

Create request:

```json
{
  "name": "Groceries",
  "color": "#22C55E",
  "icon": "shopping-cart"
}
```

## 7. Expense CRUD Endpoints

### List Expenses

```http
GET /api/v1/expenses?from=2026-05-01&to=2026-05-31&category_id=1&page=1&per_page=25
```

Auth: required.

Supported filters:

- `from`
- `to`
- `category_id`
- `payment_method`
- `source`
- `is_recurring`
- `search`
- `sort`

### Create Expense

```http
POST /api/v1/expenses
```

Auth: required.

Phase 1 implements category listing only. Custom category mutation is reserved for a later enhancement.

Future create request:

```json
{
  "amount": 42.75,
  "currency": "USD",
  "merchant": "Fresh Market",
  "description": "Weekly groceries",
  "expense_date": "2026-05-31",
  "category_id": 1,
  "payment_method": "card",
  "is_recurring": false
}
```

### Get Expense

```http
GET /api/v1/expenses/{id}
```

Auth: required.

### Update Expense

```http
PATCH /api/v1/expenses/{id}
```

Auth: required.

### Delete Expense

```http
DELETE /api/v1/expenses/{id}
```

Auth: required.

### Categorize Expense

```http
POST /api/v1/expenses/{id}/categorize
```

Auth: required.

Status: not implemented in Phase 1.

Purpose: asks the backend to call the AI service for category prediction.

Response:

```json
{
  "data": {
    "expense_id": 100,
    "expense_category_id": 1,
    "category_name": "Groceries",
    "confidence": 0.9125,
    "model_version": "categorizer-v1"
  }
}
```

## 8. Budget CRUD Endpoints

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/v1/budgets` | Yes | List budgets. |
| `POST` | `/api/v1/budgets` | Yes | Create budget. |
| `GET` | `/api/v1/budgets/{id}` | Yes | Get budget detail. |
| `PATCH` | `/api/v1/budgets/{id}` | Yes | Update budget. |
| `DELETE` | `/api/v1/budgets/{id}` | Yes | Soft delete budget. |

Create request:

```json
{
  "name": "Monthly Groceries",
  "expense_category_id": 1,
  "amount": 500.00,
  "currency": "USD",
  "period": "monthly",
  "start_date": "2026-06-01",
  "end_date": null,
  "alert_threshold_percent": 80.00
}
```

### Budget Utilization

```http
GET /api/v1/budgets/{id}/utilization?from=2026-06-01&to=2026-06-30
```

Auth: required.

Response:

```json
{
  "data": {
    "budget_id": 10,
    "budget_amount": 500.00,
    "spent_amount": 325.40,
    "remaining_amount": 174.60,
    "utilization_percent": 65.08,
    "status": "on_track"
  }
}
```

## 9. Dashboard Statistics Endpoints

### Dashboard Summary

```http
GET /api/v1/dashboard/summary?from=2026-05-01&to=2026-05-31
```

Auth: required.

Response:

```json
{
  "data": {
    "total_spend": 1850.25,
    "expense_count": 63,
    "average_daily_spend": 59.69,
    "top_category": {
      "id": 1,
      "name": "Groceries",
      "amount": 510.75
    },
    "budget_status": {
      "active_budgets": 4,
      "over_budget": 1,
      "near_limit": 1
    }
  }
}
```

### Spending by Category

```http
GET /api/v1/dashboard/spending-by-category?from=2026-05-01&to=2026-05-31
```

Auth: required.

### Spending Trend

```http
GET /api/v1/dashboard/spending-trend?interval=monthly&months=6
```

Auth: required.

### Cash Flow Snapshot

```http
GET /api/v1/dashboard/cash-flow?from=2026-05-01&to=2026-05-31
```

Auth: required.

Note: income tracking is outside the initial table list, so Phase 1 can return expense-only cash outflow until income features are added.

## 10. Forecast Endpoints

### List Forecasts

```http
GET /api/v1/forecasts?month=2026-06-01&category_id=1
```

Auth: required.

### Generate Forecast

```http
POST /api/v1/forecasts/generate
```

Auth: required.

Request:

```json
{
  "forecast_month": "2026-06-01",
  "expense_category_id": null,
  "lookback_months": 12
}
```

Response:

```json
{
  "data": {
    "forecast_id": 55,
    "forecast_month": "2026-06-01",
    "expense_category_id": null,
    "predicted_amount": 1925.50,
    "lower_bound": 1740.00,
    "upper_bound": 2120.00,
    "confidence_score": 0.7842,
    "model_version": "forecaster-v1"
  }
}
```

### Delete Forecast

```http
DELETE /api/v1/forecasts/{id}
```

Auth: required.

## 11. AI Recommendation Endpoints

### List Recommendations

```http
GET /api/v1/ai-recommendations?status=new&priority=high
```

Auth: required.

### Generate Recommendations

```http
POST /api/v1/ai-recommendations/generate
```

Auth: required.

Request:

```json
{
  "scope": "monthly_budget",
  "month": "2026-06-01"
}
```

Response:

```json
{
  "data": [
    {
      "id": 200,
      "type": "budget_adjustment",
      "priority": "high",
      "title": "Reduce dining budget pressure",
      "message": "Dining spend is projected to exceed the current budget by 18%.",
      "status": "new"
    }
  ]
}
```

### Update Recommendation Status

```http
PATCH /api/v1/ai-recommendations/{id}
```

Auth: required.

Request:

```json
{
  "status": "accepted"
}
```

## 12. Internal AI Service API

These endpoints are private and must not be exposed to browsers.

### AI Health

```http
GET /internal/v1/health
```

### Categorize Expense

```http
POST /internal/v1/categorization/predict
```

Request:

```json
{
  "expense": {
    "id": 100,
    "amount": 42.75,
    "merchant": "Fresh Market",
    "description": "Weekly groceries",
    "expense_date": "2026-05-31"
  },
  "known_categories": [
    {
      "id": 1,
      "name": "Groceries"
    }
  ],
  "user_history_summary": {
    "months": 6,
    "category_counts": {}
  }
}
```

Response:

```json
{
  "category_id": 1,
  "category_name": "Groceries",
  "confidence": 0.9125,
  "model_version": "categorizer-v1",
  "explanation": {
    "signals": ["merchant_match", "description_keywords"]
  }
}
```

### Analyze Spending Trends

```http
POST /internal/v1/trends/analyze
```

Request:

```json
{
  "user_id": 1,
  "period": {
    "from": "2026-01-01",
    "to": "2026-05-31"
  },
  "expenses": []
}
```

### Generate Forecast

```http
POST /internal/v1/forecasting/generate
```

Request:

```json
{
  "user_id": 1,
  "forecast_month": "2026-06-01",
  "lookback_months": 12,
  "monthly_series": [
    {
      "month": "2026-05-01",
      "category_id": null,
      "amount": 1850.25
    }
  ]
}
```

### Generate Budget Recommendations

```http
POST /internal/v1/recommendations/generate
```

Request:

```json
{
  "user_id": 1,
  "budgets": [],
  "spending_summary": {},
  "forecasts": [],
  "trend_summary": {}
}
```

## 13. Status Codes

| Code | Usage |
| --- | --- |
| `200` | Successful read, update, or action. |
| `201` | Resource created. |
| `204` | Successful delete with no body. |
| `400` | Bad request. |
| `401` | Missing or invalid authentication. |
| `403` | Authenticated but not authorized. |
| `404` | Resource not found or not visible to user. |
| `409` | Conflict, such as duplicate category slug. |
| `422` | Validation error. |
| `429` | Rate limit exceeded. |
| `500` | Unexpected server error. |
| `502` | AI service unavailable or failed. |

## 14. Rate Limiting

Recommended starting limits:

| Area | Limit |
| --- | --- |
| Login | 5 attempts per minute per IP and email. |
| Register | 10 attempts per hour per IP. |
| Expense CRUD | 120 requests per minute per user. |
| Dashboard | 60 requests per minute per user. |
| Forecast generation | 10 requests per hour per user. |
| Recommendation generation | 10 requests per hour per user. |

## 15. API Versioning Strategy

- Start all backend routes under `/api/v1`.
- Start internal AI routes under `/internal/v1`.
- Breaking changes require a new version prefix.
- Non-breaking additions can be added within the current version.
- API resources should avoid exposing raw database shape when future changes are likely.
