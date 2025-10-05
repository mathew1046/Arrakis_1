// Real API client that connects to Flask backend

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
}

class ApiClient {
  private baseURL = 'http://localhost:5000/api';

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Only set default Content-Type if not FormData
    const defaultHeaders: Record<string, string> = {};
    
    // Don't set Content-Type for FormData (browser will set it with boundary)
    if (!(options.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || 'Request failed',
          status: response.status,
        } as ApiError;
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError) {
        // Network error
        throw {
          message: 'Network error: Unable to connect to server',
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: T | FormData, options: RequestInit = {}): Promise<ApiResponse<any>> {
    const config: RequestInit = {
      method: 'POST',
      ...options,
    };

    if (data instanceof FormData) {
      config.body = data;
      // Don't set Content-Type header - browser will set it with boundary
      // Remove Content-Type from headers if it exists
      if (config.headers) {
        const headers = { ...config.headers };
        delete (headers as any)['Content-Type'];
        config.headers = headers;
      }
    } else {
      config.body = JSON.stringify(data);
    }

    return this.request(endpoint, config);
  }

  async put<T>(endpoint: string, data: T): Promise<ApiResponse<any>> {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string): Promise<ApiResponse<any>> {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Authentication
  async authenticate(username: string, password: string): Promise<ApiResponse<any>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }
}

export const apiClient = new ApiClient();
