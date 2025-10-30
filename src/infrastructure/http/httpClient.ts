/**
 * HTTP Client
 *
 * Cliente HTTP centralizado usando Axios.
 * Substitui todas as chamadas fetch() manuais espalhadas pelo código.
 *
 * Benefícios:
 * - Headers automáticos (X-Tenant-Id, Authorization, X-Correlation-Id)
 * - Interceptors para refresh token e tratamento de erros
 * - Tipagem TypeScript completa
 * - Logging centralizado
 * - Retry logic (futuro)
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { API_CONFIG, TENANT_CONFIG } from './apiConfig';
import { v4 as uuidv4 } from 'uuid';

export class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers,
    });

    this.setupInterceptors();
  }

  /**
   * Configura interceptors para request e response
   */
  private setupInterceptors(): void {
    // Request interceptor - adiciona headers automáticos
    this.client.interceptors.request.use(
      (config) => {
        // Headers obrigatórios
        config.headers['X-Tenant-Id'] = TENANT_CONFIG.tenantId;
        config.headers['X-Correlation-Id'] = uuidv4();

        // Recupera dados de autenticação do localStorage
        if (typeof window !== 'undefined') {
          const authData = this.getAuthData();

          if (authData?.tokens?.accessToken) {
            config.headers['Authorization'] = `Bearer ${authData.tokens.accessToken}`;
          }

          if (authData?.user) {
            config.headers['X-User-Id'] = authData.user.id;
            config.headers['X-User-Name'] = authData.user.nome;
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - trata erros globalmente
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        // Token expirado - redireciona para login
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-storage');
            window.location.href = '/login';
          }
        }

        // Loga erros no console (pode ser enviado para serviço de logging)
        console.error('[HTTP Client Error]', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
        });

        return Promise.reject(error);
      }
    );
  }

  /**
   * Recupera dados de autenticação do localStorage
   */
  private getAuthData(): any {
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (!authStorage) return null;

      const parsed = JSON.parse(authStorage);
      return parsed.state; // Zustand persist formato
    } catch (error) {
      console.error('Erro ao recuperar dados de autenticação:', error);
      return null;
    }
  }

  /**
   * GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /**
   * Download de arquivo (blob)
   */
  async downloadFile(url: string, filename: string): Promise<void> {
    const response = await this.client.get(url, {
      responseType: 'blob',
    });

    // Cria link temporário para download
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}

// Singleton instance - reutilizada em toda aplicação
export const httpClient = new HttpClient();
