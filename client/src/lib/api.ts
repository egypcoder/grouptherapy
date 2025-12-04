
export async function apiRequest(url: string, options: RequestInit = {}) {
  const sessionId = localStorage.getItem("admin_session");
  
  const headers: HeadersInit = {
    ...options.headers,
  };
  
  if (sessionId) {
    headers.Authorization = `Bearer ${sessionId}`;
  }
  
  if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (response.status === 401) {
    localStorage.removeItem("admin_session");
    window.location.href = "/admin/login";
    throw new Error("Authentication required");
  }
  
  return response;
}
