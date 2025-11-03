# Quick Start Guide - Dashboard Enterprise

Guía rápida para comenzar a desarrollar en 5 minutos.

## 1. Instalación

```bash
cd D:\dashboard-enterprise
npm install
```

## 2. Configuración

Crea `.env.local` basado en el ejemplo:

```bash
cp .env.local.example .env.local
```

Edita `.env.local`:

```env
# URL de tu backend NestJS
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_TIMEOUT=30000

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=genera-una-clave-secreta-aqui

# OAuth Google (opcional)
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

NODE_ENV=development
```

Para generar `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## 3. Iniciar Servidor

```bash
npm run dev
```

Abre `http://localhost:3000` en tu navegador.

## 4. Primera Prueba

1. Ve a `http://localhost:3000`
2. Serás redirigido a `/dashboard`
3. Si no estás autenticado, irás a `/login`
4. Ingresa credenciales de tu backend NestJS
5. Explora el dashboard

## 5. Verificar Conexión con Backend

Asegúrate de que tu backend NestJS esté corriendo en `http://localhost:3001`.

El dashboard intentará conectarse automáticamente.

## Comandos Útiles

```bash
# Desarrollo
npm run dev          # Servidor con hot reload

# Build
npm run build        # Build de producción
npm start            # Servidor de producción

# Calidad
npm run lint         # Verificar código
npm run type-check   # Verificar tipos
npm run format       # Formatear código

# Testing
npm test             # Ejecutar tests
```

## Estructura Rápida

```
app/
  (auth)/login/          # Página de login
  (dashboard)/           # Dashboard con sidebar
    page.tsx             # Dashboard home
    users/               # Módulo de usuarios
    roles/               # (Por implementar)
    analytics/           # (Por implementar)

components/
  ui/                    # Componentes de UI
  layouts/               # Sidebar y Header
  shared/                # Componentes compartidos

lib/
  api/client.ts          # Cliente HTTP configurado
  hooks/                 # Custom hooks
  utils/                 # Utilidades

config/
  api.config.ts          # Endpoints del backend

types/
  index.ts               # Types del backend
```

## Agregar Nuevo Módulo

### Ejemplo: Módulo de Productos

1. **Crear página**:
```typescript
// app/(dashboard)/products/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export default function ProductsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiClient.get('/products');
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Products</h1>
      {/* Tu UI aquí */}
    </div>
  );
}
```

2. **Agregar al sidebar**:
```typescript
// components/layouts/sidebar.tsx
const menuItems = [
  // ... items existentes
  { href: '/dashboard/products', label: 'Products', icon: Package },
];
```

3. **Crear hook personalizado** (opcional):
```typescript
// lib/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiClient.get('/products');
      return response.data;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return apiClient.post('/products', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
```

## Agregar Componente UI

### Usando shadcn CLI

```bash
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
```

### Crear manualmente

```typescript
// components/ui/badge.tsx
import { cn } from '@/lib/utils/cn';

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        className
      )}
      {...props}
    />
  );
}
```

## Dark Mode

El dark mode ya está configurado. Usa el toggle en el header o:

```typescript
import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();
setTheme('dark'); // o 'light'
```

## API Client

El cliente API ya maneja:
- ✅ Tokens JWT automáticamente
- ✅ Refresh token si expira
- ✅ Redirección a login si falla auth
- ✅ Error handling

Simplemente usa:

```typescript
import { apiClient } from '@/lib/api/client';

// GET
const response = await apiClient.get('/users');

// POST
const response = await apiClient.post('/users', { name: 'John' });

// PUT
const response = await apiClient.put('/users/1', { name: 'Jane' });

// DELETE
const response = await apiClient.delete('/users/1');
```

## TanStack Query

Para data fetching reactivo:

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

// Query (GET)
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});

// Mutation (POST, PUT, DELETE)
const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});
```

## Formularios

Usa React Hook Form + Zod:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
}
```

## Toasts (Notifications)

```typescript
import { toast } from 'sonner';

toast.success('Operation successful!');
toast.error('Something went wrong');
toast.info('Info message');
toast.warning('Warning message');
```

## Troubleshooting

### Backend no responde
1. Verifica que el backend esté corriendo en `http://localhost:3001`
2. Verifica CORS en el backend
3. Revisa la consola del navegador para errores

### Error de autenticación
1. Verifica las credenciales
2. Revisa que el endpoint `/auth/login` funcione
3. Verifica `NEXTAUTH_SECRET` en `.env.local`

### Errores de TypeScript
```bash
npm run type-check
```

### Problemas de styling
```bash
# Reconstruir Tailwind
rm -rf .next
npm run dev
```

## Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [NextAuth.js Docs](https://next-auth.js.org)

---

**¡Listo!** Ya puedes empezar a desarrollar. Revisa `PROJECT_STATUS.md` para ver qué está implementado y qué falta.
