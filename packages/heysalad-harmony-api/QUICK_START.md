# HeySalad Harmony API - Quick Start Guide

**Status**: ✅ Ready for Deployment  
**Date**: February 9, 2026

---

## 🚀 Deploy in 3 Steps

### 1. Set Secrets
```bash
cd heysalad-payme/heysalad-harmony-api
npx wrangler secret put OPENAI_API_KEY
# Enter: sk-proj-YOUR_OPENAI_API_KEY_HERE
```

### 2. Create Database
```bash
npx wrangler d1 create harmony-db
# Update database_id in wrangler.toml
npx wrangler d1 migrations apply harmony-db --remote
```

### 3. Deploy
```bash
./deploy.sh
```

---

## 🧪 Test in 2 Steps

### 1. Get OAuth Token
```bash
# Email magic link
curl -X POST https://heysalad-oauth.heysalad-o.workers.dev/api/auth/email/send-magic-link \
  -H "Content-Type: application/json" \
  -d '{"email": "peter@heysalad.io", "redirectUrl": "https://harmony.heysalad.app/auth/callback"}'

# Click link in email, extract token
```

### 2. Run Tests
```bash
export HARMONY_TOKEN="your-jwt-token-here"
node test-harmony-api.js
```

---

## 📋 API Endpoints

**Base URL**: `https://heysalad-harmony-api.heysalad-o.workers.dev`

### Authentication
```bash
# Verify token
POST /api/auth/verify
Body: { "token": "..." }

# Get current user
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

### Companies
```bash
# List companies
GET /api/companies

# Create company
POST /api/companies
Body: {
  "name": "HeySalad Inc.",
  "entity_type": "Delaware C Corporation",
  "incorporation_date": "2026-01-23",
  "address": "584 Castro St, Suite #4003, San Francisco, CA 94114 US",
  "representative_name": "HeySalad Team",
  "representative_phone": "contact@heysalad.io"
}
```

### Employees
```bash
# List employees
GET /api/employees?company_id=<id>

# Create employee
POST /api/employees
Body: {
  "company_id": "<id>",
  "name": "HeySalad Team",
  "email": "peter@heysalad.io",
  "phone": "contact@heysalad.io",
  "position": "Chief Executive Officer",
  "department": "Executive",
  "start_date": "2026-01-23",
  "employment_type": "full_time",
  "salary": 200000,
  "currency": "USD"
}
```

### Documents
```bash
# Generate document
POST /api/documents/generate
Body: {
  "employee_id": "<id>",
  "document_type": "employment_contract"
}

# Document types:
# - employment_contract
# - offer_letter
# - visa_sponsorship_letter
# - termination_letter
# - reference_letter
```

---

## 🔑 HeySalad Inc. Test Data

**Company**:
- Name: HeySalad Inc.
- Type: Delaware C Corporation
- Incorporated: January 23, 2026
- Address: 584 Castro St, Suite #4003, San Francisco, CA 94114 US

**CEO**:
- Name: HeySalad Team
- Email: peter@heysalad.io
- Phone: contact@heysalad.io
- Position: Chief Executive Officer
- Salary: $200,000 USD

---

## 📚 Documentation

- **Full Guide**: See `HARMONY_COMPLETE_SUMMARY_FEB_9_2026.md`
- **Deployment**: See `DEPLOY_NOW.md`
- **OAuth**: See `OAUTH_INTEGRATION_COMPLETE.md`
- **API Docs**: See `README.md`

---

## 🆘 Troubleshooting

**Health check fails**:
```bash
curl https://heysalad-harmony-api.heysalad-o.workers.dev/
```

**Auth fails**:
- Check token is valid
- Verify OAuth URL is correct
- Ensure Authorization header format: `Bearer <token>`

**Database errors**:
- Verify database_id in wrangler.toml
- Check migrations ran successfully
- Confirm D1 database exists

---

## 📞 Support

- **Email**: peter@heysalad.io
- **Docs**: See README.md
- **Tests**: Run `node test-harmony-api.js`

---

**Ready to deploy!** 🚀
