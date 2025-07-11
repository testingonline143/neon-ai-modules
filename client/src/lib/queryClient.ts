import { QueryClient } from "@tanstack/react-query";

const apiRequest = async (url: string, options?: RequestInit) => {
  // Use environment-specific API URL or fallback to current origin
  const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
  const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : url;
  
  const response = await fetch(fullUrl, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const [url] = queryKey as [string];
        return apiRequest(url);
      },
    },
  },
});

export { apiRequest };