#!/bin/bash

echo "Generando archivos core del dashboard..."

# Theme Provider
cat > components/providers/theme-provider.tsx << 'EOF'
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
EOF

mkdir -p components/providers

# Config
cat > config/api.config.ts << 'EOF'
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  withCredentials: true,
};

export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    verify2FA: '/auth/2fa/verify',
  },
  users: {
    list: '/users',
    create: '/users',
    get: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
  roles: {
    list: '/roles',
    create: '/roles',
    get: (id: string) => `/roles/${id}`,
    update: (id: string) => `/roles/${id}`,
    delete: (id: string) => `/roles/${id}`,
  },
  analytics: {
    dashboard: '/analytics/dashboard',
    users: '/analytics/users',
    revenue: '/analytics/revenue',
  },
  notifications: {
    list: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
  },
  files: {
    upload: '/files/upload',
    list: '/files',
    delete: (id: string) => `/files/${id}`,
  },
  health: '/health',
};
EOF

# Types
cat > types/index.ts << 'EOF'
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  isTwoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  resource: string;
  action: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    perPage: number;
  };
}

export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  totalOrders: number;
}

export interface ChartData {
  name: string;
  value: number;
}
EOF

# API Client
cat > lib/api/client.ts << 'EOF'
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/config/api.config';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      withCredentials: API_CONFIG.withCredentials,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();
            const response = await this.client.post('/auth/refresh', {
              refreshToken,
            });

            const { accessToken } = response.data;
            this.setToken(accessToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }

            return this.client(originalRequest);
          } catch (refreshError) {
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  public getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient().getClient();
EOF

echo "Archivos core generados exitosamente!"

