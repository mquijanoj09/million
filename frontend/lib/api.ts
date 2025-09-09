export interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

export const config: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  timeout: 10000,
};

export class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API request failed: ${error.message}`);
      }
      throw new Error("Unknown API error");
    }
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
      headers,
    });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async delete<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      headers,
    });
  }
}

export const apiClient = new ApiClient(config);
