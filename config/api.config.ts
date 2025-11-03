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
