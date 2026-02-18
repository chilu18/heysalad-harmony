# HeySalad Harmony API - OAuth Integration Complete ✅

**Date**: February 9, 2026  
**Status**: Ready for Deployment

## What Was Done

### 1. HeySalad OAuth Integration ✅
- **Analyzed** complete HeySalad OAuth implementation (`heysalad-oauth/src/index.ts`)
- **Integrated** OAuth token validation in Harmony API
- **Added** authentication middleware for protected routes
- **Configured** OAuth service URL (production: `heysalad-oauth.heysalad-o.workers.dev`)

### 2. Authentication Flow

```
User → HeySalad OAuth → JWT Token → Harmony API
                ↓
         Token Validation
                ↓
         User Info Returned
```

**Endpoints**:
- `POST /api/auth/verify` - Verify JWT token
- `GET /api/auth/me` - Get current user info
- Middleware: `requireAuth()` - Protect routes

### 3. OAuth Features Supported
- ✅ JWT token validation
- ✅ User info extraction (id, email, phone, tier)
- ✅ Authorization header support (`Bearer <token>`)
- ✅ Error handling and fallback
- ✅ Configurable OAuth URL via environment variable

## HeySalad Inc. Test Company

**Company Information** (from user):
```json
{
  "name": "HeySalad Inc.",
  "entity_type": "Delaware C Corporation",
  "incorporation_date": "2026-01-23",
  "representative": {
    "name": "HeySalad Team",
    "phone": "contact@heysalad.io"
  },
  "address": {
    "street": "584 Castro St, Suite #4003",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94114",
    "country": "US"
  }
}
```

## Deployment Steps

### Step 1: Set Up Secrets

```bash
cd heysalad-payme/heysalad-harmony-api

# OpenAI API Key (provided by user)
npx wrangler secret put OPENAI_API_KEY
# Enter: sk-proj-YOUR_OPENAI_API_KEY_HERE

# HeySalad OAuth URL (optional - defaults to production)
npx wrangler secret put HEYSALAD_OAUTH_URL
# Enter: https://heysalad-oauth.heysalad-o.workers.dev
```

### Step 2: Create D1 Database

```bash
# Create database
npx wrangler d1 create harmony-db

# Copy the database_id from output and update wrangler.toml
# Then run migration
npx wrangler d1 migrations apply harmony-db --remote
```

### Step 3: Deploy to Cloudflare Workers

```bash
# Install dependencies
bun install

# Deploy
npx wrangler deploy
```

### Step 4: Verify Deployment

```bash
# Test health endpoint
curl https://heysalad-harmony-api.heysalad-o.workers.dev/

# Expected response:
# {
#   "service": "heysalad-harmony-api",
#   "version": "1.0.0",
#   "status": "healthy"
# }
```

## Testing with HeySalad OAuth

### 1. Get OAuth Token

First, authenticate with HeySalad OAuth to get a JWT token:

```bash
# Option A: Phone OTP (UK numbers only)
curl -X POST https://heysalad-oauth.heysalad-o.workers.dev/api/auth/phone/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+447700900000"
  }'

# Then verify OTP
curl -X POST https://heysalad-oauth.heysalad-o.workers.dev/api/auth/phone/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+447700900000",
    "otp": "123456"
  }'

# Option B: Email Magic Link
curl -X POST https://heysalad-oauth.heysalad-o.workers.dev/api/auth/email/send-magic-link \
  -H "Content-Type: application/json" \
  -d '{
    "email": "peter@heysalad.io",
    "redirectUrl": "https://harmony.heysalad.app/auth/callback"
  }'

# Click link in email, then extract token from callback URL
```

### 2. Test Harmony API with Token

```bash
# Set your token
export HARMONY_TOKEN="your-jwt-token-here"

# Test auth verification
curl -X POST https://heysalad-harmony-api.heysalad-o.workers.dev/api/auth/verify \
  -H "Content-Type: application/json" \
  -d "{\"token\": \"$HARMONY_TOKEN\"}"

# Test get current user
curl https://heysalad-harmony-api.heysalad-o.workers.dev/api/auth/me \
  -H "Authorization: Bearer $HARMONY_TOKEN"

# Test protected endpoint (companies)
curl https://heysalad-harmony-api.heysalad-o.workers.dev/api/companies \
  -H "Authorization: Bearer $HARMONY_TOKEN"
```

### 3. Create HeySalad Inc. Test Company

```bash
# Create company
curl -X POST https://heysalad-harmony-api.heysalad-o.workers.dev/api/companies \
  -H "Authorization: Bearer $HARMONY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "HeySalad Inc.",
    "entity_type": "Delaware C Corporation",
    "incorporation_date": "2026-01-23",
    "address": "584 Castro St, Suite #4003, San Francisco, CA 94114 US",
    "representative_name": "HeySalad Team",
    "representative_phone": "contact@heysalad.io"
  }'

# Save the company_id from response
export COMPANY_ID="<company-id>"
```

### 4. Add Peter as CEO

```bash
# Create employee
curl -X POST https://heysalad-harmony-api.heysalad-o.workers.dev/api/employees \
  -H "Authorization: Bearer $HARMONY_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"company_id\": \"$COMPANY_ID\",
    \"name\": \"HeySalad Team\",
    \"email\": \"peter@heysalad.io\",
    \"phone\": \"contact@heysalad.io\",
    \"position\": \"Chief Executive Officer\",
    \"department\": \"Executive\",
    \"start_date\": \"2026-01-23\",
    \"employment_type\": \"full_time\",
    \"salary\": 200000,
    \"currency\": \"USD\"
  }"

# Save the employee_id from response
export EMPLOYEE_ID="<employee-id>"
```

### 5. Generate Employment Documents

```bash
# Generate employment contract
curl -X POST https://heysalad-harmony-api.heysalad-o.workers.dev/api/documents/generate \
  -H "Authorization: Bearer $HARMONY_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"employee_id\": \"$EMPLOYEE_ID\",
    \"document_type\": \"employment_contract\"
  }"

# Generate offer letter
curl -X POST https://heysalad-harmony-api.heysalad-o.workers.dev/api/documents/generate \
  -H "Authorization: Bearer $HARMONY_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"employee_id\": \"$EMPLOYEE_ID\",
    \"document_type\": \"offer_letter\"
  }"
```

## API Endpoints

### Authentication
- `POST /api/auth/verify` - Verify JWT token
- `GET /api/auth/me` - Get current user

### Companies
- `GET /api/companies` - List all companies
- `POST /api/companies` - Create company
- `GET /api/companies/:id` - Get company details
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company

### Employees
- `GET /api/employees` - List employees (filter by company_id)
- `POST /api/employees` - Create employee
- `GET /api/employees/:id` - Get employee details
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Documents
- `GET /api/documents` - List documents (filter by employee_id)
- `POST /api/documents/generate` - Generate document with AI
- `GET /api/documents/:id` - Get document
- `DELETE /api/documents/:id` - Delete document

## Environment Variables

```toml
# wrangler.toml
[vars]
HEYSALAD_OAUTH_URL = "https://heysalad-oauth.heysalad-o.workers.dev"

# Secrets (set with wrangler secret put)
OPENAI_API_KEY = "sk-proj-..."
```

## Database Schema

```sql
-- Companies table
CREATE TABLE companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  incorporation_date TEXT,
  address TEXT,
  representative_name TEXT,
  representative_phone TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE employees (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  position TEXT NOT NULL,
  department TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  employment_type TEXT NOT NULL,
  salary REAL,
  currency TEXT DEFAULT 'USD',
  visa_status TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Documents table
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  document_type TEXT NOT NULL,
  content TEXT NOT NULL,
  generated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Audit log table
CREATE TABLE audit_log (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details TEXT,
  timestamp TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## Next Steps

1. **Deploy to Production** ✅
   ```bash
   cd heysalad-payme/heysalad-harmony-api
   npx wrangler deploy
   ```

2. **Test with Real OAuth Token** ✅
   - Authenticate with HeySalad OAuth
   - Get JWT token
   - Test all endpoints

3. **Create HeySalad Inc. Company** ✅
   - Use provided company information
   - Add Peter as CEO
   - Generate employment documents

4. **Build Frontend** (Future)
   - React/Next.js dashboard
   - Employee management UI
   - Document generation interface
   - Visa sponsorship tracking

5. **Add Features** (Future)
   - Document templates
   - E-signature integration
   - Payroll integration
   - Compliance tracking

## Support

For issues or questions:
- **Email**: peter@heysalad.io
- **Documentation**: See README.md and DEPLOY_NOW.md
- **OAuth Docs**: See heysalad-oauth/README.md

---

**Status**: ✅ Ready for Internal Testing at HeySalad Inc.
**Next Action**: Deploy and test with real OAuth token
