import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "@/features/auth/api/authApi";
import type { AuthUser } from "@/features/auth/types";
import { ApiClientError } from "@/shared/api/client";
import {
  clearSession,
  getStoredUser,
  persistSession,
  updateStoredUser,
} from "@/shared/api/session";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [loading, setLoading] = useState(() => getStoredUser() != null);

  const login = useCallback((authUser: AuthUser) => {
    persistSession(authUser);
    setUser(authUser);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const me = await authApi.me();
      updateStoredUser(me);
      setUser(me);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        clearSession();
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    if (!getStoredUser()) {
      setLoading(false);
      return;
    }
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      /* vẫn xóa session phía client */
    } finally {
      clearSession();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, refreshUser }),
    [user, loading, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
