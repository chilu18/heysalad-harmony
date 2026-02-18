-- HeySalad Harmony Database Schema
-- Version: 1.0.0
-- Date: February 9, 2026

-- Companies
CREATE TABLE companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  registration_number TEXT,
  country TEXT NOT NULL DEFAULT 'EE',
  heysalad_account_id TEXT NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX idx_companies_heysalad_account ON companies(heysalad_account_id);

-- Employees
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
  currency TEXT DEFAULT 'EUR',
  start_date TEXT,
  end_date TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'terminated')),
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE INDEX idx_employees_company ON employees(company_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_heysalad_user ON employees(heysalad_user_id);

-- Documents (contracts, offer letters, etc.)
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('contract', 'offer_letter', 'termination', 'amendment')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata TEXT, -- JSON
  generated_by TEXT,
  generated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE INDEX idx_documents_employee ON documents(employee_id);
CREATE INDEX idx_documents_type ON documents(type);

-- Audit log
CREATE TABLE audit_log (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  changes TEXT, -- JSON
  timestamp INTEGER DEFAULT (unixepoch())
);

CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_user ON audit_log(user_id);
