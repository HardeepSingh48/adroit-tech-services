const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  errorCode?: string;
  errors?: Array<{ field: string; message: string }>;
}

export class ApiError extends Error {
  statusCode: number;
  errorCode?: string;
  errors?: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    statusCode: number,
    errorCode?: string,
    errors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
  }
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      let errorMsg = data.message || data.errorCode || 'An error occurred during request execution.';
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        const details = data.errors.map((e: { field: string; message: string }) => e.message || `${e.field} is invalid`).join('. ');
        errorMsg = `${errorMsg}: ${details}`;
      }
      throw new ApiError(errorMsg, response.status, data.errorCode, data.errors);
    }

    return data;
  } catch (error: unknown) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}
