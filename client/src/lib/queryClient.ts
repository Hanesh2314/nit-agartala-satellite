import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Helper to determine if we're in production (Netlify) or development mode
const isProduction = import.meta.env.PROD;
const API_BASE_URL = isProduction ? '/.netlify/functions/api' : '';

// Helper to transform API paths to match our environment
const getApiPath = (path: string): string => {
  // If already prefixed with /.netlify/functions/api, use as is
  if (path.startsWith('/.netlify/functions/api')) {
    return path;
  }
  
  // If in production and path starts with /api, transform it
  if (isProduction && path.startsWith('/api')) {
    return `/.netlify/functions/api${path.substring(4)}`;
  }
  
  // Otherwise, return the path as is
  return path;
};

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  formData?: FormData,
): Promise<Response> {
  // Transform the URL for production if needed
  const transformedUrl = getApiPath(url);
  
  let headers: HeadersInit = {};
  let body: any = undefined;
  
  if (formData) {
    // If we have FormData, don't set Content-Type (browser will set with boundary)
    body = formData;
  } else if (data) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(data);
  }
  
  const res = await fetch(transformedUrl, {
    method,
    headers,
    body,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Transform the URL for production if needed
    const path = queryKey[0] as string;
    const transformedPath = getApiPath(path);
    
    const res = await fetch(transformedPath, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
