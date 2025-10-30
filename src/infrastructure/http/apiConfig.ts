/**
 * API Configuration
 *
 * Centraliza todas as configurações relacionadas à API backend.
 * Utiliza variáveis de ambiente para facilitar diferentes ambientes (dev, staging, prod).
 */

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5103/api/v1',
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': 'pt-BR',
  },
} as const;

export const TENANT_CONFIG = {
  tenantId: process.env.NEXT_PUBLIC_TENANT_ID || 'f0e25b5a-598d-4bb9-942f-5f6710cb200a',
} as const;

export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'ERP UNIO',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
} as const;
