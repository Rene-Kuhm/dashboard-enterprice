# Enterprise Dashboard

Dashboard profesional enterprise-grade para el backend NestJS

## Estado del Proyecto

Este proyecto ha sido iniciado con la base completa para un dashboard enterprise. Todo el setup inicial, configuración, dependencias y arquitectura base están listos.

### Ya Implementado

1. **Setup Completo**
   - Next.js 16.0.1 con App Router
   - TypeScript en modo estricto
   - Tailwind CSS + PostCSS
   - ESLint + Prettier
   - Vitest + React Testing Library

2. **Dependencias Core**
   - NextAuth.js (autenticación)
   - Axios (HTTP client con interceptors)
   - TanStack Query (data fetching)
   - Zustand (state management)
   - React Hook Form + Zod
   - Recharts (gráficos)
   - shadcn/ui components
   - next-themes (dark mode)
   - sonner (toasts)

3. **Estructura Completa**
   - Directorios organizados
   - Configuración de TypeScript
   - Tailwind con variables CSS
   - API client configurado
   - Types del backend
   - Test setup

4. **Código Base**
   - Root layout
   - Providers (Query, Session, Theme)
   - Estilos globales
   - Login page completa
   - API client con refresh token
   - Middleware para rutas protegidas
   - Componentes UI base

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local

# 3. Iniciar desarrollo
npm run dev
```

## Variables de Entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_TIMEOUT=30000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=optional
GOOGLE_CLIENT_SECRET=optional
NODE_ENV=development
```

## Scripts

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm start` - Servidor de producción
- `npm run lint` - ESLint
- `npm run lint:fix` - Fix ESLint
- `npm run format` - Prettier
- `npm run type-check` - TypeScript check
- `npm test` - Tests con Vitest
- `npm run test:ui` - Tests con UI
- `npm run test:coverage` - Coverage

## Stack Tecnológico

- Next.js 16 (App Router)
- React 19
- TypeScript 5.9
- Tailwind CSS 4.1
- Radix UI (shadcn/ui)
- TanStack Query 5
- Zustand 5
- React Hook Form + Zod
- NextAuth.js 5
- Axios
- Recharts 3
- Vitest
- Lucide React

## Estructura

```
dashboard-enterprise/
├── app/
│   ├── (auth)/            # Páginas de autenticación
│   ├── (dashboard)/       # Páginas del dashboard
│   ├── api/               # API routes
│   ├── globals.css
│   ├── layout.tsx
│   └── providers.tsx
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layouts/           # Layout components
│   ├── charts/            # Chart components
│   ├── forms/             # Form components
│   ├── shared/            # Shared components
│   └── providers/         # Provider components
├── lib/
│   ├── api/               # API client
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utilities
│   └── validations/       # Zod schemas
├── types/                 # TypeScript types
├── stores/                # Zustand stores
├── config/                # Configuration
├── tests/                 # Tests
└── docs/                  # Documentation
```

## Próximos Pasos

Para completar el dashboard, necesitas implementar:

1. **Componentes UI faltantes**
   - Table, Dialog, Select, Checkbox, etc.
   - DataTable custom

2. **Layout del Dashboard**
   - Sidebar con navegación
   - Header con user menu

3. **Módulos Principales**
   - Dashboard home con métricas
   - CRUD de usuarios
   - CRUD de roles
   - Analytics con gráficos
   - Notificaciones
   - Gestión de archivos
   - Settings
   - Profile con 2FA

4. **Features Avanzadas**
   - Export CSV/PDF
   - Multi-idioma (i18n)
   - Real-time updates
   - WebSocket integration

5. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests (Playwright)

6. **CI/CD**
   - GitHub Actions workflow
   - Automated testing
   - Deployment pipeline

## Integración con Backend

El dashboard se conecta al backend NestJS en `http://localhost:3001`

Endpoints configurados en `config/api.config.ts`:
- `/auth/*` - Autenticación
- `/users` - Usuarios
- `/roles` - Roles
- `/analytics/*` - Analytics
- `/notifications` - Notificaciones
- `/files` - Archivos
- `/health` - Health checks

## Seguridad

- CSRF protection
- XSS prevention
- Secure headers
- JWT + refresh tokens
- Protected routes
- Input validation

## Deployment

### Vercel
```bash
npm i -g vercel
vercel
```

### Docker
```bash
docker build -t dashboard-enterprise .
docker run -p 3000:3000 dashboard-enterprise
```

## Licencia

Privado - Enterprise Project
