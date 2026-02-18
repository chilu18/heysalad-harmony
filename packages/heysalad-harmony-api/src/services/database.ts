import { Company, Employee, Document, AuditLog } from '../types';

export class DatabaseService {
  constructor(private db: D1Database) {}

  // Companies
  async createCompany(company: Omit<Company, 'created_at' | 'updated_at'>): Promise<Company> {
    const now = Math.floor(Date.now() / 1000);
    await this.db.prepare(`
      INSERT INTO companies (id, name, registration_number, country, heysalad_account_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      company.id,
      company.name,
      company.registration_number || null,
      company.country,
      company.heysalad_account_id,
      now,
      now
    ).run();

    return { ...company, created_at: now, updated_at: now };
  }

  async getCompany(id: string): Promise<Company | null> {
    const result = await this.db.prepare('SELECT * FROM companies WHERE id = ?').bind(id).first<Company>();
    return result || null;
  }

  async listCompanies(heysalad_account_id?: string): Promise<Company[]> {
    let query = 'SELECT * FROM companies';
    const params: any[] = [];
    
    if (heysalad_account_id) {
      query += ' WHERE heysalad_account_id = ?';
      params.push(heysalad_account_id);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await this.db.prepare(query).bind(...params).all<Company>();
    return result.results || [];
  }

  // Employees
  async createEmployee(employee: Omit<Employee, 'created_at' | 'updated_at'>): Promise<Employee> {
    const now = Math.floor(Date.now() / 1000);
    await this.db.prepare(`
      INSERT INTO employees (
        id, company_id, heysalad_user_id, first_name, last_name, email, phone,
        role, department, salary, currency, start_date, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      employee.id,
      employee.company_id,
      employee.heysalad_user_id || null,
      employee.first_name,
      employee.last_name,
      employee.email || null,
      employee.phone || null,
      employee.role,
      employee.department || null,
      employee.salary || null,
      employee.currency,
      employee.start_date || null,
      employee.status,
      now,
      now
    ).run();

    return { ...employee, created_at: now, updated_at: now };
  }

  async getEmployee(id: string): Promise<Employee | null> {
    const result = await this.db.prepare('SELECT * FROM employees WHERE id = ?').bind(id).first<Employee>();
    return result || null;
  }

  async listEmployees(company_id?: string, status?: string): Promise<Employee[]> {
    let query = 'SELECT * FROM employees WHERE 1=1';
    const params: any[] = [];
    
    if (company_id) {
      query += ' AND company_id = ?';
      params.push(company_id);
    }
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await this.db.prepare(query).bind(...params).all<Employee>();
    return result.results || [];
  }

  async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee | null> {
    const now = Math.floor(Date.now() / 1000);
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return this.getEmployee(id);

    fields.push('updated_at = ?');
    values.push(now, id);

    await this.db.prepare(`
      UPDATE employees SET ${fields.join(', ')} WHERE id = ?
    `).bind(...values).run();

    return this.getEmployee(id);
  }

  // Documents
  async createDocument(document: Omit<Document, 'generated_at'>): Promise<Document> {
    const now = Math.floor(Date.now() / 1000);
    await this.db.prepare(`
      INSERT INTO documents (id, employee_id, type, title, content, metadata, generated_by, generated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      document.id,
      document.employee_id,
      document.type,
      document.title,
      document.content,
      document.metadata ? JSON.stringify(document.metadata) : null,
      document.generated_by || null,
      now
    ).run();

    return { ...document, generated_at: now };
  }

  async getDocument(id: string): Promise<Document | null> {
    const result = await this.db.prepare('SELECT * FROM documents WHERE id = ?').bind(id).first<any>();
    if (!result) return null;
    
    return {
      ...result,
      metadata: result.metadata ? JSON.parse(result.metadata) : undefined,
    };
  }

  async listDocuments(employee_id: string): Promise<Document[]> {
    const result = await this.db.prepare(
      'SELECT * FROM documents WHERE employee_id = ? ORDER BY generated_at DESC'
    ).bind(employee_id).all<any>();
    
    return (result.results || []).map(doc => ({
      ...doc,
      metadata: doc.metadata ? JSON.parse(doc.metadata) : undefined,
    }));
  }

  // Audit log
  async logAction(log: Omit<AuditLog, 'timestamp'>): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    await this.db.prepare(`
      INSERT INTO audit_log (id, user_id, action, entity_type, entity_id, changes, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      log.id,
      log.user_id,
      log.action,
      log.entity_type,
      log.entity_id,
      log.changes ? JSON.stringify(log.changes) : null,
      now
    ).run();
  }
}
