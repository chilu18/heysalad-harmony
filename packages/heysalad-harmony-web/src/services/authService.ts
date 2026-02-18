/**
 * Auth Service for HeySalad Harmony
 * Integrates with heysalad-oauth at oauth.heysalad.app
 */

const OAUTH_BASE_URL = import.meta.env.VITE_OAUTH_URL || 'https://oauth.heysalad.app';
const TOKEN_KEY = 'heysalad_harmony_token';

export interface User {
  id: string;
  phone?: string;
  email?: string;
  tier: 'free' | 'pro' | 'max';
}

export interface JWTPayload {
  sub: string;
  phone?: string;
  email?: string;
  tier: 'free' | 'pro' | 'max';
  iat: number;
  exp: number;
}

/**
 * Get the stored auth token
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Store the auth token
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove the auth token
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Decode JWT payload (without verification - server validates)
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    // Add padding if needed
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length % 4;
    if (padding) {
      base64 += '='.repeat(4 - padding);
    }
    
    const decoded = JSON.parse(atob(base64));
    return decoded as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;
  
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Validate token with the OAuth server
 */
export async function validateToken(token: string): Promise<{ valid: boolean; user?: User }> {
  try {
    const response = await fetch(`${OAUTH_BASE_URL}/api/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      return { valid: false };
    }
    
    const data = await response.json();
    return { valid: data.valid, user: data.user };
  } catch {
    // If server validation fails, fall back to local check
    if (isTokenExpired(token)) {
      return { valid: false };
    }
    
    const payload = decodeToken(token);
    if (!payload) return { valid: false };
    
    return {
      valid: true,
      user: {
        id: payload.sub,
        phone: payload.phone,
        email: payload.email,
        tier: payload.tier,
      },
    };
  }
}

/**
 * Get the OAuth login URL with redirect back to Harmony
 */
export function getLoginUrl(): string {
  const redirectUrl = encodeURIComponent(window.location.origin + '/auth/callback');
  return `${OAUTH_BASE_URL}/?redirect=${redirectUrl}`;
}

/**
 * Get user display name
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return 'Guest';
  if (user.email) return user.email;
  if (user.phone) return user.phone;
  return `User ${user.id.slice(0, 8)}`;
}
