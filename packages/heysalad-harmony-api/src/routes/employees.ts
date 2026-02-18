import { Hono } from 'hono';
import { Env } from '../types';
import { DatabaseService } from '../services/database';

export const employeesRoutes = new Hono<{ Bindings: Env }>();

// Create employee
employeesRoutes.post('/', async (c) => {
  const db = new DatabaseService(c.env.DB);
  const body = await c.req.json();

  const {
    company_id,
    heysalad_user_id,
    first_name,
    last_name,
    email,
    phone,
    role,
    department,
    salary,
    currency,
    start_date,
  } = body;

  if (!company_id || !first_name || !last_name || !role) {
    return c.json({ error: 'company_id, first_name, last_name, and role required' }, 400);
  }

  const id = crypto.randomUUID();
  
  const employee = await db.createEmployee({
    id,
    company_id,
    heysalad_user_id,
    first_name,
    last_name,
    email,
    phone,
    role,
    department,
    salary,
    currency: currency || 'EUR',
    start_date,
    status: 'active',
  });

  // Log action
  await db.logAction({
    id: crypto.randomUUID(),
    user_id: heysalad_user_id || 'system',
    action: 'create',
    entity_type: 'employee',
    entity_id: id,
  });

  return c.json({ employee }, 201);
});

// Get employee
employeesRoutes.get('/:id', async (c) => {
  const db = new DatabaseService(c.env.DB);
  const id = c.req.param('id');

  const employee = await db.getEmployee(id);

  if (!employee) {
    return c.json({ error: 'Employee not found' }, 404);
  }

  return c.json({ employee });
});

// List employees
employeesRoutes.get('/', async (c) => {
  const db = new DatabaseService(c.env.DB);
  const company_id = c.req.query('company_id');
  const status = c.req.query('status');

  const employees = await db.listEmployees(company_id, status);

  return c.json({ employees });
});

// Update employee
employeesRoutes.put('/:id', async (c) => {
  const db = new DatabaseService(c.env.DB);
  const id = c.req.param('id');
  const updates = await c.req.json();

  const employee = await db.updateEmployee(id, updates);

  if (!employee) {
    return c.json({ error: 'Employee not found' }, 404);
  }

  // Log action
  await db.logAction({
    id: crypto.randomUUID(),
    user_id: updates.heysalad_user_id || 'system',
    action: 'update',
    entity_type: 'employee',
    entity_id: id,
    changes: updates,
  });

  return c.json({ employee });
});

// Deactivate employee
employeesRoutes.delete('/:id', async (c) => {
  const db = new DatabaseService(c.env.DB);
  const id = c.req.param('id');

  const employee = await db.updateEmployee(id, { status: 'inactive' });

  if (!employee) {
    return c.json({ error: 'Employee not found' }, 404);
  }

  // Log action
  await db.logAction({
    id: crypto.randomUUID(),
    user_id: 'system',
    action: 'deactivate',
    entity_type: 'employee',
    entity_id: id,
  });

  return c.json({ employee });
});
