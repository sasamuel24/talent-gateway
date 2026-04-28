const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
const TOKEN_KEY = "cq_candidate_token";

function getCandidateToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

async function candidateFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getCandidateToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("cq_candidate_user");
    window.location.href = "/candidato/login";
    return response;
  }

  if (!response.ok) {
    let message = response.statusText;
    try {
      const body = await response.clone().json();
      if (body?.detail) {
        message = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
      }
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return response;
}

export async function candidateApiGet<T>(path: string): Promise<T> {
  const res = await candidateFetch(path, { method: "GET" });
  return res.json() as Promise<T>;
}
