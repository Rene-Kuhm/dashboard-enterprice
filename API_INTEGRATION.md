# API Integration Guide

## Overview

This dashboard integrates with a backend API (typically NestJS) for all data operations.

## API Client Configuration

Located in `lib/api/index.ts`:

```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh
    }
    return Promise.reject(error);
  }
);
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout

### Users
- `GET /users` - List users (paginated)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /users/:id/activity` - Get user activity log

### Roles
- `GET /roles` - List all roles
- `GET /roles/:id` - Get role by ID
- `POST /roles` - Create new role
- `PATCH /roles/:id` - Update role
- `DELETE /roles/:id` - Delete role
- `GET /permissions` - List all permissions

### Analytics
- `GET /analytics` - Get dashboard analytics
- `GET /analytics/revenue` - Get revenue data
- `GET /analytics/users` - Get user growth data

### Notifications
- `GET /notifications` - List notifications
- `PATCH /notifications/mark-read` - Mark notifications as read
- `DELETE /notifications/:id` - Delete notification

### Files
- `GET /files` - List files
- `POST /files/upload` - Upload file(s)
- `GET /files/:id` - Get file details
- `DELETE /files/:id` - Delete file
- `GET /files/:id/download` - Download file

### Settings
- `GET /settings` - Get application settings
- `PATCH /settings` - Update settings

## Using TanStack Query

### Basic Query
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    const response = await api.get('/users');
    return response.data;
  },
});
```

### Mutation
```typescript
const mutation = useMutation({
  mutationFn: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    toast.success('User created successfully');
  },
});
```

### Pagination
```typescript
const { data } = useQuery({
  queryKey: ['users', page, pageSize],
  queryFn: async () => {
    const response = await api.get(`/users?page=${page}&limit=${pageSize}`);
    return response.data;
  },
  keepPreviousData: true,
});
```

## Error Handling

```typescript
try {
  const response = await api.get('/users');
  return response.data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
  }
  throw error;
}
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Dashboard Enterprise
```

## CORS Configuration

Backend must allow requests from the dashboard domain:

```typescript
// NestJS example
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
});
```

## Authentication Flow

1. User submits login credentials
2. Backend validates and returns JWT tokens
3. Tokens stored in localStorage/cookies
4. API client adds token to all requests
5. Backend validates token on each request
6. On 401 error, attempt token refresh
7. If refresh fails, redirect to login

## Best Practices

1. **Always use TanStack Query** for server state
2. **Type all API responses** with TypeScript
3. **Handle loading states** in UI
4. **Show user-friendly error messages**
5. **Implement optimistic updates** where appropriate
6. **Cache aggressively** with proper invalidation
7. **Use query keys consistently**
8. **Implement retry logic** for failed requests
