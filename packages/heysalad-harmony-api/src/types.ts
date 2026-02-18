// HeySalad Harmony API Types

export interface Env {
  DB: D1Database;
  HEYSALAD_OAUTH_CLIENT_ID: string;
  HEYSALAD_OAUTH_CLIENT_SECRET: string;
  OPENAI_API_KEY: string;
}

export interface Company {
  id: string;
  name: string;
  registration_number?: string;
  country: string;
  heysalad_account_id: string;
  created_at: number;
  updated_at: number;
}

export interface Employee {
  id: string;
  company_id: string;
  heysalad_user_id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  role: string;
  department?: string;
  salary?: number;
  currency: string;
  start_date?: string;
  end_date?: string;
  status: 'active' | 'inactive' | 'terminated';
  created_at: number;
  updated_at: number;
}

export interface Document {
  id: string;
  employee_id: string;
  type: 'contract' | 'offer_letter' | 'termination' | 'amendment';
  title: string;
  content: string;
  metadata?: Record<string, any>;
  generated_by?: string;
  generated_at: number;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  changes?: Record<string, any>;
  timestamp: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  heysalad_account_id: string;
}
