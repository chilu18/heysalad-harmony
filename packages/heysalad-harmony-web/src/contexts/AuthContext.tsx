import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  getToken,
  setToken,
  removeToken,
  validateToken,
  decodeToken,
  isTokenExpired,
} from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      
      if (!token) {
        console.log('[AuthContext] No token found');
        setIsLoading(false);
        return;
      }

      // Quick local check first
      if (isTokenExpired(token)) {
        console.log('[AuthContext] Token expired');
        removeToken();
        setIsLoading(false);
        return;
      }

      // Decode token locally first to get user info
      const payload = decodeToken(token);
      console.log('[AuthContext] Decoded token payload:', payload);
      
      if (payload) {
        const localUser = {
          id: payload.sub,
          phone: payload.phone,
          email: payload.email,
          tier: payload.tier,
        };
        console.log('[AuthContext] User from token:', localUser);
        setUser(localUser);
      }

      // Also try to validate with server (but don't block on it)
      try {
        const result = await validateToken(token);
        console.log('[AuthContext] Server validation result:', result);
        
        if (result.valid && result.user) {
          setUser(result.user);
        } else if (!result.valid) {
          console.log('[AuthContext] Server says token invalid, but keeping local user');
          // Keep the local user if server validation fails but token is not expired
        }
      } catch (err) {
        console.log('[AuthContext] Server validation failed, using local user:', err);
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (token: string) => {
    console.log('[AuthContext] Login called with token');
    setToken(token);
    
    const payload = decodeToken(token);
    console.log('[AuthContext] Login - decoded payload:', payload);
    
    if (payload) {
      const newUser = {
        id: payload.sub,
        phone: payload.phone,
        email: payload.email,
        tier: payload.tier,
      };
      console.log('[AuthContext] Login - setting user:', newUser);
      setUser(newUser);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
