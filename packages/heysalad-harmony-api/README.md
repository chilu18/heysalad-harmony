# HeySalad Harmony API

Backend API for HeySalad Harmony workforce management platform.

## Overview

HeySalad Harmony is a workforce management platform for managing employees, generating HR documents, and handling payroll. This is the backend API built on Cloudflare Workers.

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Framework**: Hono
- **AI**: OpenAI GPT-4o
- **Auth**: HeySalad OAuth

## Features

- Company management
- Employee CRUD operations
- AI-powered document generation (contracts, offer letters, etc.)
- HeySalad OAuth integration
- Audit logging

## Setup

### Prerequisites

- Node.js 18+
- Cloudflare account
- Wrangler CLI (`npm install -g wrangler`)

### Installation

```bash
cd heysalad-harmony-api
npm install
```

### Database Setup

1. Create D1 database:
```bash
npx wrangler d1 create harmony-db
```

2. Update `wrangler.toml` with the database ID from the output

3. Run migrations:
```bash
npx wrangler d1 migrations apply harmony-db
```

### Environment Variables

Add secrets to Cloudflare:

```bash
# HeySalad OAuth credentials
npx wrangler secret put HEYSALAD_OAUTH_CLIENT_ID
npx wrangler secret put HEYSALAD_OAUTH_CLIENT_SECRET

# OpenAI API key
npx wrangler secret put OPENAI_API_KEY
```

### Local Development

```bash
npm run dev
```

API will be available at `http://localhost:8787`

### Deployment

```bash
npm run deploy
```

Production URL: `harmony-api.heysalad-o.workers.dev`

## API Endpoints

### Authentication

#### Verify OAuth Token
```http
POST /api/auth/verify
Content-Type: application/json

{
  "token": "heysalad_oauth_token"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Companies

#### Create Company
```http
POST /api/companies
Content-Type: application/json

{
  "name": "HeySalad OÜ",
  "registration_number": "17327633",
  "country": "Estonia",
  "heysalad_account_id": "acc_xxx"
}
```

#### Get Company
```http
GET /api/companies/:id
```

#### List Companies
```http
GET /api/companies
GET /api/companies?heysalad_account_id=acc_xxx
```

### Employees

#### Create Employee
```http
POST /api/employees
Content-Type: application/json

{
  "company_id": "comp_xxx",
  "first_name": "Peter",
  "last_name": "Machona",
  "email": "peter@heysalad.io",
  "phone": "+372...",
  "role": "CEO",
  "department": "Executive",
  "salary": 5000,
  "currency": "EUR",
  "start_date": "2024-01-01",
  "status": "active"
}
```

#### Get Employee
```http
GET /api/employees/:id
```

#### List Employees
```http
GET /api/employees
GET /api/employees?company_id=comp_xxx
GET /api/employees?company_id=comp_xxx&status=active
```

#### Update Employee
```http
PUT /api/employees/:id
Content-Type: application/json

{
  "role": "CTO",
  "salary": 6000
}
```

#### Delete Employee (Deactivate)
```http
DELETE /api/employees/:id
```

### Documents

#### Generate Document
```http
POST /api/documents/generate
Content-Type: application/json

{
  "employee_id": "emp_xxx",
  "type": "contract",
  "user_id": "user_xxx"
}
```

Document types:
- `contract` - Employment contract
- `offer_letter` - Job offer letter
- `termination` - Termination letter
- `amendment` - Contract amendment

#### Get Document
```http
GET /api/documents/:id
```

#### List Employee Documents
```http
GET /api/documents/employee/:employeeId
```

## Database Schema

### Companies Table
```sql
CREATE TABLE companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  registration_number TEXT,
  country TEXT NOT NULL,
  heysalad_account_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

### Employees Table
```sql
CREATE TABLE employees (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  heysalad_user_id TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL,
  department TEXT,
  salary REAL,
  currency TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

### Documents Table
```sql
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata TEXT,
  generated_by TEXT,
  generated_at INTEGER NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);
```

### Audit Log Table
```sql
CREATE TABLE audit_log (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  changes TEXT,
  timestamp INTEGER NOT NULL
);
```

## Testing

### Test Company Creation
```bash
curl -X POST https://harmony-api.heysalad-o.workers.dev/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "HeySalad OÜ",
    "registration_number": "17327633",
    "country": "Estonia",
    "heysalad_account_id": "test_account"
  }'
```

### Test Employee Creation
```bash
curl -X POST https://harmony-api.heysalad-o.workers.dev/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": "COMPANY_ID_FROM_ABOVE",
    "first_name": "Peter",
    "last_name": "Machona",
    "email": "peter@heysalad.io",
    "role": "CEO",
    "currency": "EUR",
    "status": "active"
  }'
```

### Test Document Generation
```bash
curl -X POST https://harmony-api.heysalad-o.workers.dev/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMPLOYEE_ID_FROM_ABOVE",
    "type": "contract",
    "user_id": "test_user"
  }'
```

## Internal Testing Checklist

- [ ] Create HeySalad OÜ company
- [ ] Add Peter Machona as CEO
- [ ] Add other team members
- [ ] Generate employment contract for Peter
- [ ] Generate offer letter for new hire
- [ ] Update employee information
- [ ] List all employees
- [ ] View generated documents

## Architecture

```
┌─────────────────┐
│  Cloudflare     │
│  Workers        │
│  (Hono API)     │
└────────┬────────┘
         │
         ├─────────┐
         │         │
    ┌────▼────┐  ┌▼──────────┐
    │ D1 DB   │  │ OpenAI    │
    │ (SQLite)│  │ GPT-4o    │
    └─────────┘  └───────────┘
         │
    ┌────▼────────────┐
    │ HeySalad OAuth  │
    └─────────────────┘
```

## Next Steps

1. **Web Dashboard**: Build React frontend for managing employees
2. **Payroll Integration**: Connect to HeySalad Pay for salary processing
3. **Mobile App**: Employee self-service app
4. **Time Tracking**: Clock in/out functionality
5. **Leave Management**: Request and approve time off

## Support

Contact: peter@heysalad.io

## License

Proprietary - HeySalad OÜ
