# FinSight AI Development Roadmap

## 1. Roadmap Overview

FinSight AI should be built in phases so the product becomes useful early while preserving the architecture needed for advanced AI features.

Phases:

1. Authentication and expense tracking.
2. Dashboard analytics.
3. AI categorization.
4. Forecasting.
5. Budget intelligence.

Each phase should include implementation, automated testing, documentation updates, and deployment validation.

## 2. Phase 1: Authentication and Expense Tracking

Goal: users can securely create accounts, sign in, and manage expenses.

### Backend

- Initialize Laravel 12 project in `backend/`.
- Configure MySQL connection and environment management.
- Add JWT authentication package and token lifecycle.
- Create migrations for:
  - `users`
  - `expense_categories`
  - `expenses`
- Create seeders for default expense categories.
- Implement auth endpoints:
  - Register
  - Login
  - Refresh
  - Logout
  - Current user
- Implement expense category endpoints.
- Implement expense CRUD endpoints.
- Add Laravel policies to enforce per-user ownership.
- Add validation Form Requests.
- Add feature tests for auth and expense CRUD.

### Frontend

- Initialize Next.js project in `frontend/`.
- Configure TypeScript and Tailwind CSS.
- Create auth pages:
  - Register
  - Login
- Add authenticated dashboard layout.
- Build expense list, create, edit, and delete flows.
- Build category selection UI.
- Add API client with JWT handling.
- Add route protection middleware.

### AI Service

- Initialize FastAPI project in `ai-service/`.
- Add health endpoint.
- Define request and response schemas for future categorization.
- No model behavior required in Phase 1.

### Acceptance Criteria

- A user can register, log in, refresh a session, and log out.
- A logged-in user can create, view, update, and delete only their own expenses.
- Default categories are available.
- Unauthenticated requests to protected endpoints return `401`.
- Cross-user access attempts return `404` or `403`.

## 3. Phase 2: Dashboard Analytics

Goal: users can understand current spending behavior with useful summaries and charts.

### Backend

- Add budget migration if not completed earlier.
- Implement dashboard aggregation services.
- Add endpoints for:
  - Dashboard summary
  - Spending by category
  - Spending trend
  - Budget utilization
- Optimize queries with date and user indexes.
- Add tests for aggregation correctness.

### Frontend

- Create dashboard overview page.
- Add chart components for:
  - Spending by category
  - Monthly trend
  - Budget utilization
- Add date-range filters.
- Add loading, empty, and error states.

### AI Service

- Add trend-analysis endpoint contract.
- Implement simple statistical trend summaries if backend calls are introduced in this phase.

### Acceptance Criteria

- Users can see total spend, expense count, daily average, and top categories.
- Dashboard results are scoped to the authenticated user.
- Date filters update all relevant metrics.
- Charts remain readable across desktop and mobile layouts.

## 4. Phase 3: AI Categorization

Goal: the platform can suggest categories for uncategorized expenses.

### Backend

- Add AI client service for backend-to-FastAPI communication.
- Add service token authentication for AI requests.
- Implement `POST /api/v1/expenses/{id}/categorize`.
- Store category predictions in `expenses.expense_category_id`.
- Store confidence in `expenses.ai_confidence`.
- Store categorization time in `expenses.categorized_at`.
- Add fallback behavior when AI service is unavailable.

### Frontend

- Add AI category suggestion UI.
- Let users accept, reject, or override predictions.
- Display confidence only where it helps the user make a decision.
- Add bulk categorization flow for uncategorized expenses.

### AI Service

- Implement categorization pipeline:
  - Input validation
  - Text normalization
  - Feature extraction
  - Baseline classifier
  - Confidence scoring
- Start with a lightweight Scikit-Learn model:
  - TF-IDF vectorizer
  - Logistic Regression or Linear SVM
- Add model artifact loading and version reporting.
- Add unit tests for preprocessing and prediction response format.

### Acceptance Criteria

- AI can suggest a category for an expense.
- Prediction results include category, confidence, and model version.
- Backend gracefully handles AI timeouts.
- Users remain in control of the final category.

## 5. Phase 4: Forecasting

Goal: users can forecast upcoming monthly expenses from historical spending.

### Backend

- Create `forecasts` migration if not completed earlier.
- Implement forecast generation endpoint.
- Aggregate historical monthly series for AI input.
- Persist forecast results.
- Add model version and input summary metadata.
- Add tests for forecast authorization and persistence.

### Frontend

- Add forecast page.
- Show total monthly forecast.
- Show category-level forecast where enough data exists.
- Display forecast ranges and confidence carefully.
- Add empty state for users without enough history.

### AI Service

- Implement forecasting pipeline:
  - Monthly aggregation validation
  - Missing month handling
  - Baseline moving average model
  - Regression-based model when sufficient history exists
  - Confidence interval estimation
- Track model version.
- Add evaluation scripts for forecast accuracy.

### Acceptance Criteria

- Users can generate and view a forecast for a future month.
- Forecasts are stored and tied to the authenticated user.
- Forecasts include predicted amount, optional bounds, confidence score, and model version.
- Users with insufficient data receive a clear response instead of a misleading forecast.

## 6. Phase 5: Budget Intelligence

Goal: FinSight AI provides actionable budget recommendations based on spending, budgets, trends, and forecasts.

### Backend

- Create `budgets` and `ai_recommendations` migrations if not completed earlier.
- Implement budget CRUD.
- Implement recommendation generation endpoint.
- Persist recommendation status.
- Add rules for expiring stale recommendations.
- Add tests for recommendation visibility and status changes.

### Frontend

- Build budget management views.
- Build recommendation inbox.
- Add actions:
  - Accept
  - Dismiss
  - Mark viewed
- Link recommendations to related budgets, categories, or forecasts.

### AI Service

- Implement recommendation pipeline:
  - Budget utilization analysis
  - Forecast comparison
  - Category trend detection
  - Rule-based recommendation generation
  - Priority scoring
- Keep recommendations explainable.
- Add tests for recommendation types and priority scoring.

### Acceptance Criteria

- Users can create and manage budgets.
- Users can generate budget recommendations.
- Recommendations include title, message, priority, type, rationale, and optional action payload.
- Users can accept or dismiss recommendations.

## 7. Cross-Cutting Workstreams

### Security

- Enforce HTTPS in deployed environments.
- Restrict CORS to approved frontend domains.
- Add rate limiting for auth and AI-triggering endpoints.
- Protect service-to-service AI requests with a private token.
- Exclude sensitive financial payloads from logs.
- Add role middleware before admin routes exist.

### Testing

- Backend:
  - Feature tests for endpoints.
  - Unit tests for services and policies.
  - Database tests for ownership and filters.
- Frontend:
  - Component tests for core UI.
  - Integration tests for auth and expense flows.
  - End-to-end tests once flows stabilize.
- AI service:
  - Unit tests for preprocessing.
  - Contract tests for API schemas.
  - Evaluation tests for model quality.

### Observability

- Add request ID propagation.
- Use structured logs.
- Track API latency.
- Track AI inference latency.
- Track AI confidence distribution.
- Track forecast accuracy once actual outcomes are available.

### DevOps

- Add Docker Compose for local development:
  - Next.js frontend
  - Laravel backend
  - FastAPI AI service
  - MySQL
  - Redis when queues are introduced
- Add CI pipeline:
  - Frontend lint and type check
  - Backend tests
  - AI service tests
  - Security checks
- Add staging deployment before production.

## 8. Suggested Milestones

| Milestone | Scope | Outcome |
| --- | --- | --- |
| M1 | Project initialization | Three services boot locally. |
| M2 | Auth foundation | Secure account lifecycle works. |
| M3 | Expense MVP | Users can track expenses. |
| M4 | Analytics MVP | Dashboard shows spending insights. |
| M5 | AI categorization | Expenses can be auto-categorized. |
| M6 | Forecast MVP | Monthly forecasts are generated and stored. |
| M7 | Budget intelligence | Recommendations guide user budgeting. |

## 9. Initial Definition of Done

For every phase:

- API endpoints are documented.
- Database migrations are reversible.
- User-owned data is authorization-tested.
- Errors use the standard API envelope.
- Frontend states cover loading, empty, error, and success.
- AI outputs include model or ruleset version where applicable.
- Documentation is updated when contracts change.

## 10. Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| AI recommendations feel arbitrary | Keep rationale data and user-facing explanations. |
| Forecast quality is poor with little data | Use minimum data thresholds and clear empty states. |
| Financial data exposure | Enforce strict ownership policies and log redaction. |
| Tight coupling between backend and AI service | Use versioned internal API contracts and typed schemas. |
| Dashboard queries become slow | Add indexes early and move heavy aggregations to cached summaries later. |
| JWT refresh handling becomes fragile | Implement refresh-token rotation and server-side revocation from the start. |

## 11. Out-of-Scope for Initial Build

These features should wait until the core platform is stable:

- Bank account syncing.
- Income tracking.
- Multi-currency conversion.
- Shared household budgets.
- Paid subscription billing.
- Advisor portals.
- Native mobile applications.
- Generative chat interface.
