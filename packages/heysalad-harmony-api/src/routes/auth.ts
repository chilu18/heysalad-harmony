import { Hono } from 'hono';
import { Env, AuthUser } from '../types';

export const authRoutes = new Hono<{ Bindings: Env }>();

/**
 * Validate JWT token with HeySalad OAuth service
 */
async function validateWithOAuth(token: string, oauthUrl: string): Promise<{
  valid: boolean;
  user?: {
    id: string;
    email?: string;
    phone?: string;
    tier: string;
  };
  message?: string;
}> {
  try {
    const response = await fetch(`${oauthUrl}/api/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { valid: false, message: 'Token validation failed' };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('OAuth validation error:', error);
    return { valid: false, message: 'OAuth service unavailable' };
  }
}

/**
 * POST /api/auth/verify
 * Verify HeySalad OAuth token
 */
authRoutes.post('/verify', async (c) => {
  try {
    const { token } = await c.req.json();
    
    if (!token) {
      return c.json({ error: 'Token required' }, 400);
    }

    const oauthUrl = c.env.HEYSALAD_OAUTH_URL || 'https://heysalad-oauth.heysalad-o.workers.dev';
    const result = await validateWithOAuth(token, oauthUrl);

    if (!result.valid) {
      return c.json({ error: result.message || 'Invalid token' }, 401);
    }

    return c.json({ user: result.user });
  } catch (error) {
    console.error('Auth verification error:', error);
    return c.json({ error: 'Authentication failed' }, 500);
  }
});

/**
 * GET /api/auth/me
 * Get current user from Authorization header
 */
authRoutes.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.substring(7);
    const oauthUrl = c.env.HEYSALAD_OAUTH_URL || 'https://heysalad-oauth.heysalad-o.workers.dev';
    
    const result = await validateWithOAuth(token, oauthUrl);

    if (!result.valid) {
      return c.json({ error: result.message || 'Invalid token' }, 401);
    }

    return c.json({ user: result.user });
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ error: 'Failed to get user' }, 500);
  }
});

/**
 * Middleware to validate authentication
 * Use this in other routes to protect endpoints
 */
export async function requireAuth(c: any, next: () => Promise<void>) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  const oauthUrl = c.env.HEYSALAD_OAUTH_URL || 'https://heysalad-oauth.heysalad-o.workers.dev';
  
  const result = await validateWithOAuth(token, oauthUrl);

  if (!result.valid) {
    return c.json({ error: result.message || 'Invalid token' }, 401);
  }

  // Store user in context for use in route handlers
  c.set('user', result.user);
  
  await next();
}
