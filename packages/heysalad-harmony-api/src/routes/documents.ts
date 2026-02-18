import { Hono } from 'hono';
import { Env } from '../types';
import { DatabaseService } from '../services/database';
import { OpenAIService } from '../services/openai';

export const documentsRoutes = new Hono<{ Bindings: Env }>();

// Generate document
documentsRoutes.post('/generate', async (c) => {
  const db = new DatabaseService(c.env.DB);
  const openai = new OpenAIService(c.env.OPENAI_API_KEY);
  const body = await c.req.json();

  const { employee_id, type, user_id } = body;

  if (!employee_id || !type) {
    return c.json({ error: 'employee_id and type required' }, 400);
  }

  // Get employee details
  const employee = await db.getEmployee(employee_id);
  if (!employee) {
    return c.json({ error: 'Employee not found' }, 404);
  }

  // Get company details
  const company = await db.getCompany(employee.company_id);
  if (!company) {
    return c.json({ error: 'Company not found' }, 404);
  }

  // Generate document content using AI
  const content = await openai.generateDocument(type, employee, company);

  const id = crypto.randomUUID();
  const title = `${type.replace('_', ' ').toUpperCase()} - ${employee.first_name} ${employee.last_name}`;

  const document = await db.createDocument({
    id,
    employee_id,
    type: type as any,
    title,
    content,
    metadata: {
      employee_name: `${employee.first_name} ${employee.last_name}`,
      company_name: company.name,
    },
    generated_by: user_id,
  });

  // Log action
  await db.logAction({
    id: crypto.randomUUID(),
    user_id: user_id || 'system',
    action: 'generate',
    entity_type: 'document',
    entity_id: id,
  });

  return c.json({ document }, 201);
});

// Get document
documentsRoutes.get('/:id', async (c) => {
  const db = new DatabaseService(c.env.DB);
  const id = c.req.param('id');

  const document = await db.getDocument(id);

  if (!document) {
    return c.json({ error: 'Document not found' }, 404);
  }

  return c.json({ document });
});

// List employee documents
documentsRoutes.get('/employee/:employeeId', async (c) => {
  const db = new DatabaseService(c.env.DB);
  const employeeId = c.req.param('employeeId');

  const documents = await db.listDocuments(employeeId);

  return c.json({ documents });
});
