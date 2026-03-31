import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number | string;
  name: string;
  email: string;
  role: "admin" | "recruiter" | "viewer" | string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TOKEN_KEY = "cq_admin_token";
const USER_KEY = "cq_admin_user";
const API_BASE = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8080'}/api/v1`;

/**
 * Decodes the JWT payload and returns the `exp` field (Unix timestamp).
 * Returns null if the token is malformed.
 */
function getTokenExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload));
    return typeof decoded.exp === "number" ? decoded.exp : null;
  } catch {
    return null;
  }
}

function isTokenValid(token: string): boolean {
  const exp = getTokenExpiry(token);
  if (exp === null) return false;
  // Compare against current time in seconds
  return exp > Math.floor(Date.now() / 1000);
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();

  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  // On mount: restore session from localStorage if the token is still valid
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser && isTokenValid(storedToken)) {
      try {
        const user: AuthUser = JSON.parse(storedUser);
        setState({ user, token: storedToken, isLoading: false });
      } catch {
        // Malformed user data — clear storage and start fresh
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setState({ user: null, token: null, isLoading: false });
      }
    } else {
      // Token missing or expired
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setState({ user: null, token: null, isLoading: false });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      // Surface a user-friendly message based on status code
      if (response.status === 401 || response.status === 400) {
        throw new Error("Credenciales incorrectas. Verifica tu email y contraseña.");
      }
      if (response.status === 422) {
        throw new Error("Datos inválidos. Verifica los campos del formulario.");
      }
      throw new Error("Error del servidor. Intenta nuevamente en unos momentos.");
    }

    const data = await response.json();
    const { access_token, user } = data as {
      access_token: string;
      token_type: string;
      user: AuthUser;
    };

    localStorage.setItem(TOKEN_KEY, access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    setState({ user, token: access_token, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setState({ user: null, token: null, isLoading: false });
    navigate("/admin/login");
  }, [navigate]);

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
