const BASE_URL = "https://sak.yetzo.com/api/v1"

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  token?: string; // Optional JWT token
};

/**
 * A clean, standard fetch wrapper for Yetzo API calls.
 * Works seamlessly in both Client (CSR via /api/proxy) and Server (SSR direct to Django).
 */
export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  // Strip '/v1' prefix if it was passed manually to prevent '/v1/v1/' duplication
  const cleanEndpoint = endpoint.startsWith('/v1/') ? endpoint.replace('/v1/', '/') : endpoint;
  const url = `${BASE_URL}${cleanEndpoint.startsWith('/') ? cleanEndpoint : `/${cleanEndpoint}`}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (!headers["Authorization"]) {
    if (options.token) {
      headers["Authorization"] = `Bearer ${options.token}`;
    } else if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        headers["Authorization"] = `Bearer ${storedToken}`;
      }
    }
  }

  const fetchConfig: RequestInit = {
    method: options.method || "GET",
    headers,
    cache: options.cache,
    ...(options.next && { next: options.next }),
  };

  if (options.body && options.method !== "GET") {
    fetchConfig.body = typeof options.body === "string" ? options.body : JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, fetchConfig);

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: `Non-JSON Response (${response.status}): ` + text.substring(0, 100) };
    }

    if (!response.ok) {
      const err: any = new Error(data.message || data.detail || `API Error: ${response.status}`);
      err.status = response.status;
      throw err;
    }

    return data as T;
  } catch (error: any) {
    if (error?.status !== 401) {
      console.error(`[ApiClient Error] ${url}:`, error);
    }
    throw error;
  }
}
