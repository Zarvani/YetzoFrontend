const BASE_URL = "/api/proxy";

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
 */
export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Token is now injected securely by the Next.js /api/proxy route via HttpOnly cookies
  const fetchConfig: RequestInit = {
    method: options.method || "GET",
    headers,
    cache: options.cache,
    ...(options.next && { next: options.next }),
  };

  if (options.body && options.method !== "GET") {
    fetchConfig.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, fetchConfig);

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.detail || `API Error: ${response.status}`);
    }

    return data as T;
  } catch (error) {
    console.error(`[ApiClient Error] ${url}:`, error);
    throw error;
  }
}
