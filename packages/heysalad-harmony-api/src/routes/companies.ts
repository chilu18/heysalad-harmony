import { Hono } from 'hono';
import { Env } from '../types';
import { DatabaseService } from '../services/database';

export const companiesRoutes = new Hono<{ Bindings: Env }>();

// Create company
companiesRoutes.post('/', async (c) => {
  const db = new DatabaseService(c.env.DB);
  const body = await c.req.json();

  const { name, registration_number, country, heysalad_account_id } = body;

  if (!name || !heysalad_account_id) {
    return c.json({ error: 'Name and heysalad_account_id required' }, 400);
  }

  const id = crypto.randomUUID();
  
  const company = await db.createCompany({
    id,
    name,
    registration_number,
    country: country || 'EE',
    heysalad_account_id,
  });

  // Log action
  await db.logAction({
    id: crypto.randomUUID(),
    user_id: heysalad_account_id,
    action: 'create',
    entity_type: 'company',
    entity_id: id,
  });

  return c.json({ company }, 201);
});

// Get company
companiesRoutes.get('/:id', async (c) => {
  const db = new DatabaseService(c.env.DB);
  const id = c.req.param('id');

  const company = await db.getCompany(id);

  if (!company) {
    return c.json({ error: 'Company not found' }, 404);
  }

  return c.json({ company });
});

// List companies
companiesRoutes.get('/', async (c) => {
  const db = new DatabaseService(c.env.DB);
  const heysalad_account_id = c.req.query('heysalad_account_id');

  const companies = await db.listCompanies(heysalad_account_id);

  return c.json({ companies });
});
