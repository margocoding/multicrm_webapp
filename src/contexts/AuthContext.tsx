// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';
import { useAuthStore } from '../store/auth.store';
import type { LoginDto } from '../api/auth.api';

interface AuthContextType {
  user: import('../api/auth.api').AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (dto: LoginDto) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Берём всё из Zustand-стора
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const loginStore = useAuthStore((s) => s.login);
  const logoutStore = useAuthStore((s) => s.logout);
  const checkAuth = useAuthStore((s) => s.checkAuth);

  // Восстановление сессии при загрузке
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Слушаем событие 401 от axios-интерцептора
  useEffect(() => {
    const handleUnauthorized = () => {
      logoutStore();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logoutStore]);

  // Адаптируем login под интерфейс LoginDto
  const login = async (dto: LoginDto) => {
    await loginStore(dto.username, dto.password);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated, login, logout: logoutStore }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}