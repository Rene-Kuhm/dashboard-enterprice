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
