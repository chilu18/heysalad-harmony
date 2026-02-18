# Deploy HeySalad Harmony API Now

Quick deployment guide for HeySalad Harmony backend.

## Step 1: Install Dependencies

```bash
cd heysalad-payme/heysalad-harmony-api
npm install
```

## Step 2: Create D1 Database

```bash
npx wrangler d1 create harmony-db
```

**Copy the database_id from the output!**

Example output:
```
✅ Successfully created DB 'harmony-db' in region WEUR
Created your database using D1's new storage backend.

[[d1_databases]]
binding = "DB"
database_name = "harmony-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

## Step 3: Update wrangler.toml

Open `wrangler.toml` and replace the `database_id` with the one from Step 2:

```toml
[[d1_databases]]
binding = "DB"
database_name = "harmony-db"
database_id = "YOUR_DATABASE_ID_HERE"  # ← Replace this
```

## Step 4: Run Database Migrations

```bash
npx wrangler d1 migrations apply harmony-db
```

You should see:
```
✅ Successfully applied 1 migration(s)
```

## Step 5: Add Secrets

### HeySalad OAuth Credentials
```bash
npx wrangler secret put HEYSALAD_OAUTH_CLIENT_ID
# Enter: your_client_id

npx wrangler secret put HEYSALAD_OAUTH_CLIENT_SECRET
# Enter: your_client_secret
```

### OpenAI API Key
```bash
npx wrangler secret put OPENAI_API_KEY
# Enter: sk-...
```

## Step 6: Deploy to Cloudflare

```bash
npx wrangler deploy
```

You should see:
```
✨ Compiled Worker successfully
✨ Uploaded Worker successfully
✨ Deployment complete!

https://harmony-api.heysalad-o.workers.dev
```

## Step 7: Test the API

### Test Health Check
```bash
curl https://harmony-api.heysalad-o.workers.dev/
```

Expected response:
```json
{
  "service": "heysalad-harmony-api",
  "version": "1.0.0",
  "status": "healthy"
}
```

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

Expected response:
```json
{
  "company": {
    "id": "...",
    "name": "HeySalad OÜ",
    "registration_number": "17327633",
    "country": "Estonia",
    "heysalad_account_id": "test_account",
    "created_at": 1707494400,
    "updated_at": 1707494400
  }
}
```

### Test Employee Creation

**Replace COMPANY_ID with the ID from the previous response:**

```bash
curl -X POST https://harmony-api.heysalad-o.workers.dev/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": "COMPANY_ID_HERE",
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
  }'
```

### Test Document Generation

**Replace EMPLOYEE_ID with the ID from the previous response:**

```bash
curl -X POST https://harmony-api.heysalad-o.workers.dev/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMPLOYEE_ID_HERE",
    "type": "contract",
    "user_id": "test_user"
  }'
```

This will generate an AI-powered employment contract!

## Troubleshooting

### Database not found
```bash
# List databases
npx wrangler d1 list

# Check migrations
npx wrangler d1 migrations list harmony-db
```

### Secrets not set
```bash
# List secrets
npx wrangler secret list
```

### Check logs
```bash
npx wrangler tail
```

## Next Steps

1. ✅ Backend API deployed
2. 🔄 Build web dashboard (React + Vite)
3. 🔄 Add HeySalad Pay integration
4. 🔄 Build mobile app

## Success Criteria

- [x] API deployed to Cloudflare
- [x] Database created and migrated
- [x] Secrets configured
- [ ] Can create HeySalad OÜ company
- [ ] Can add employees
- [ ] Can generate documents
- [ ] HeySalad OAuth works

## Support

If you encounter issues:
1. Check `npx wrangler tail` for logs
2. Verify secrets with `npx wrangler secret list`
3. Test database with `npx wrangler d1 execute harmony-db --command "SELECT * FROM companies"`

Contact: peter@heysalad.io
