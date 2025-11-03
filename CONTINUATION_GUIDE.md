# Guía de Continuación - Dashboard Enterprise

## 🎯 Lo que se ha implementado

### ✅ Fundación Completa (100%)
1. **15 componentes UI** de shadcn/ui listos para usar
2. **DataTable avanzado** con sorting, filtering, pagination
3. **5 Zod schemas** para validación completa
4. **3 utilidades core**: export (CSV/Excel/PDF), format, date
5. **Todas las dependencias** instaladas y configuradas

### ✅ Código Listo para Producción
- TypeScript estricto (0 errores)
- Componentes totalmente tipados
- Validaciones robustas
- Funciones de export enterprise-grade
- Utils reutilizables

## 🚀 Continuación Paso a Paso

### Paso 1: Completar Módulo de Users

#### 1.1 Crear User Dialog (Create/Edit)

```bash
# Ubicación: app/(dashboard)/users/_components/user-dialog.tsx
```

```typescript
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userSchema, type UserFormData } from "@/lib/validations/user.schema"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: UserFormData) => Promise<void>
  defaultValues?: Partial<UserFormData>
  mode: "create" | "edit"
}

export function UserDialog({ open, onOpenChange, onSubmit, defaultValues, mode }: UserDialogProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create User" : "Edit User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select {...register("role")}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
          </div>

          {mode === "create" && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "create" ? "Create" : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

#### 1.2 Actualizar Users Page

```typescript
// app/(dashboard)/users/page.tsx
"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserTable } from "./_components/user-table"
import { UserDialog } from "./_components/user-dialog"
import { toast } from "sonner"
import { apiClient } from "@/lib/api/client"

export default function UsersPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await apiClient.get("/users")
      return res.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return apiClient.post("/users", data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setDialogOpen(false)
      toast.success("User created successfully")
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return apiClient.patch(`/users/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setDialogOpen(false)
      toast.success("User updated successfully")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return apiClient.delete(`/users/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("User deleted successfully")
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button onClick={() => { setSelectedUser(null); setDialogOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <UserTable
        data={data?.data || []}
        isLoading={isLoading}
        onEdit={(user) => { setSelectedUser(user); setDialogOpen(true) }}
        onDelete={(user) => deleteMutation.mutate(user.id)}
        onToggleStatus={(user) => updateMutation.mutate({
          id: user.id,
          data: { isActive: !user.isActive }
        })}
      />

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(data) =>
          selectedUser
            ? updateMutation.mutateAsync({ id: selectedUser.id, data })
            : createMutation.mutateAsync(data)
        }
        defaultValues={selectedUser}
        mode={selectedUser ? "edit" : "create"}
      />
    </div>
  )
}
```

### Paso 2: Crear Módulo de Analytics

```bash
# Ubicación: app/(dashboard)/analytics/page.tsx
```

```typescript
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function AnalyticsPage() {
  // Mock data - reemplazar con real API data
  const revenueData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 4500 },
    { month: "May", revenue: 6000 },
    { month: "Jun", revenue: 5500 },
  ]

  const userGrowthData = [
    { month: "Jan", users: 100 },
    { month: "Feb", users: 150 },
    { month: "Mar", users: 200 },
    { month: "Apr", users: 280 },
    { month: "May", users: 350 },
    { month: "Jun", users: 420 },
  ]

  const roleDistribution = [
    { name: "Admin", value: 10 },
    { name: "User", value: 300 },
    { name: "Moderator", value: 50 },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">+180 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">+0.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4m 35s</div>
            <p className="text-xs text-muted-foreground">+12s from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Distribution by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### Paso 3: Implementar Command Palette (⌘K)

```bash
# Ubicación: components/shared/command-palette.tsx
```

```typescript
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { FileIcon, UserIcon, Settings, BarChart3, Bell } from "lucide-react"

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/users"))}>
            <UserIcon className="mr-2 h-4 w-4" />
            Users
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/analytics"))}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/notifications"))}>
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/files"))}>
            <FileIcon className="mr-2 h-4 w-4" />
            Files
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

Luego agregar al layout:

```typescript
// app/(dashboard)/layout.tsx
import { CommandPalette } from "@/components/shared/command-palette"

export default function DashboardLayout({ children }) {
  return (
    <>
      <CommandPalette />
      {/* resto del layout */}
    </>
  )
}
```

### Paso 4: Crear Tests

```bash
# Ubicación: tests/unit/utils/format.test.ts
```

```typescript
import { describe, it, expect } from "vitest"
import { formatCurrency, formatFileSize, formatDate, getInitials } from "@/lib/utils/format"

describe("format utils", () => {
  describe("formatCurrency", () => {
    it("should format USD correctly", () => {
      expect(formatCurrency(1234.56)).toBe("$1,234.56")
    })

    it("should format EUR correctly", () => {
      expect(formatCurrency(1234.56, "EUR", "de-DE")).toContain("1.234,56")
    })
  })

  describe("formatFileSize", () => {
    it("should format bytes", () => {
      expect(formatFileSize(500)).toBe("500 Bytes")
    })

    it("should format KB", () => {
      expect(formatFileSize(1024)).toBe("1 KB")
    })

    it("should format MB", () => {
      expect(formatFileSize(1024 * 1024)).toBe("1 MB")
    })
  })

  describe("getInitials", () => {
    it("should get initials from full name", () => {
      expect(getInitials("John Doe")).toBe("JD")
    })

    it("should handle single name", () => {
      expect(getInitials("John")).toBe("J")
    })
  })
})
```

### Paso 5: Configurar CI/CD

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run build
```

## 📚 Recursos Útiles

### Documentación Oficial
- [Next.js 15](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Recharts](https://recharts.org/)
- [Zod](https://zod.dev/)

### Ejemplos de Referencia
- Ver archivos ya creados en `lib/validations/` para patterns
- Ver `components/ui/data-table.tsx` para tabla avanzada
- Ver `lib/utils/export.ts` para funciones de export

## 🎯 Orden Recomendado de Implementación

1. ✅ Fundación (Completado)
2. **Módulo Users completo** (dialogs, detail page, export)
3. **Command Palette** (⌘K - mejora UX inmediatamente)
4. **Módulo Analytics** (gráficos visuales impresionantes)
5. **Módulo Roles** (gestión de permisos)
6. **Módulo Notifications** (centro de notificaciones)
7. **Módulo Files** (upload con drag & drop)
8. **Módulo Settings** (configuración con tabs)
9. **Módulo Profile** (perfil con 2FA)
10. **Dashboard Home mejorado** (más KPIs y gráficos)
11. **i18n** (internacionalización)
12. **Tests** (unitarios + E2E)
13. **CI/CD** (pipeline completo)
14. **Documentación** (ARCHITECTURE, etc.)

## 💡 Tips de Implementación

1. **Usa los schemas de Zod ya creados** - Están listos para producción
2. **Reutiliza DataTable** - Ya tiene sorting, filtering, pagination
3. **Usa las funciones de format** - Para fechas, moneda, etc.
4. **Implementa loading states** - Usa Skeleton component
5. **Agrega toast notifications** - Para feedback de acciones (sonner)
6. **Maneja errores** - Try/catch en mutations con toast.error()
7. **TypeScript estricto** - Todos los tipos deben estar definidos

## 🚀 Para Empezar Ahora

```bash
# 1. Instala dependencias faltantes (si las hay)
npm install

# 2. Ejecuta el dev server
npm run dev

# 3. Abre el navegador
# http://localhost:3000

# 4. Comienza con el primer módulo
# Crea: app/(dashboard)/users/_components/user-dialog.tsx
```

---

**Todo el código base está listo y funcionando. Solo falta implementar los módulos restantes siguiendo los ejemplos proporcionados. ¡Éxito! 🎉**
