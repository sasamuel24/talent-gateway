import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = `${import.meta.env.VITE_API_URL ?? "http://localhost:8080"}/api/v1`;
const TOKEN_KEY = "cq_candidate_token";
const USER_KEY = "cq_candidate_user";

export interface CandidateUser {
  id: string;
  name: string;
  email: string;
}

interface CandidateAuthState {
  candidate: CandidateUser | null;
  token: string | null;
  isLoading: boolean;
}

interface CandidateAuthContextValue extends CandidateAuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
}

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
  return exp > Math.floor(Date.now() / 1000);
}

const CandidateAuthContext = createContext<CandidateAuthContextValue | null>(null);

export function CandidateAuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [state, setState] = useState<CandidateAuthState>({
    candidate: null,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedToken && storedUser && isTokenValid(storedToken)) {
      try {
        const candidate: CandidateUser = JSON.parse(storedUser);
        setState({ candidate, token: storedToken, isLoading: false });
        return;
      } catch {
        // malformed — fall through to clear
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setState({ candidate: null, token: null, isLoading: false });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/candidate-auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      if (res.status === 401) throw new Error("Correo o contraseña incorrectos.");
      throw new Error("Error del servidor. Intenta de nuevo.");
    }
    const data = await res.json();
    const candidate: CandidateUser = {
      id: data.candidate_id,
      name: data.name,
      email: data.email,
    };
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(candidate));
    setState({ candidate, token: data.access_token, isLoading: false });
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, phone?: string) => {
      const res = await fetch(`${API_BASE}/candidate-auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });
      if (!res.ok) {
        if (res.status === 409) throw new Error("Ya existe una cuenta con ese correo.");
        throw new Error("Error al crear la cuenta. Intenta de nuevo.");
      }
      const data = await res.json();
      const candidate: CandidateUser = {
        id: data.candidate_id,
        name: data.name,
        email: data.email,
      };
      localStorage.setItem(TOKEN_KEY, data.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(candidate));
      setState({ candidate, token: data.access_token, isLoading: false });
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setState({ candidate: null, token: null, isLoading: false });
    navigate("/");
  }, [navigate]);

  return (
    <CandidateAuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </CandidateAuthContext.Provider>
  );
}

export function useCandidateAuth(): CandidateAuthContextValue {
  const ctx = useContext(CandidateAuthContext);
  if (!ctx) throw new Error("useCandidateAuth must be used inside <CandidateAuthProvider>");
  return ctx;
}
