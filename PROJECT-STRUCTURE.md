# 📁 Estructura del Proyecto

## Resumen Visual

```
medical-orders-app/
│
├── 📝 Documentación
│   ├── START-HERE.md                    ⭐ Empieza aquí
│   ├── README.md                        📖 Documentación principal
│   ├── BACKEND-DATABASE-UPDATE.md       🆕 Resumen de cambios v2.0
│   ├── DATABASE-SETUP.md                💾 Configuración de BD
│   ├── MIGRATION-GUIDE.md               🔄 Migrar desde v1
│   ├── FAQ-BACKEND.md                   ❓ Preguntas frecuentes
│   ├── CHANGELOG-V2.md                  📝 Changelog completo
│   ├── DEPLOYMENT.md                    🚀 Cómo desplegar
│   ├── QUICKSTART.md                    ⚡ Inicio rápido
│   ├── FEATURES.md                      ✨ Características
│   ├── NATIVE-APP-GUIDE.md              📱 App nativa
│   ├── PRODUCTION-CHECKLIST.md          ✅ Lista producción
│   ├── QUICK-REFERENCE.md               📋 Referencia rápida
│   ├── DOCUMENTATION-INDEX.md           🗂️ Índice completo
│   └── AUTHENTICATION-UPDATE.md         🔐 Auth v1
│
├── 🗄️ Base de Datos
│   ├── schema.sql                       📊 Esquema SQL
│   ├── setup-database.sh                🔧 Setup automático (Mac/Linux)
│   └── setup-database.bat               🔧 Setup automático (Windows)
│
├── ⚙️ Configuración
│   ├── wrangler.jsonc                   ☁️ Config Cloudflare
│   ├── astro.config.mjs                 🚀 Config Astro
│   ├── tsconfig.json                    📘 Config TypeScript
│   ├── package.json                     📦 Dependencias
│   ├── worker-configuration.d.ts        🔧 Types de Workers
│   └── .gitignore                       🚫 Archivos ignorados
│
├── 🎨 Frontend (src/)
│   │
│   ├── 📄 pages/
│   │   ├── index.astro                  🏠 Página principal
│   │   │
│   │   └── api/                         🔌 API REST
│   │       ├── auth/
│   │       │   ├── login.ts            🔐 POST /api/auth/login
│   │       │   └── register.ts         📝 POST /api/auth/register
│   │       │
│   │       ├── orders/
│   │       │   ├── index.ts            📋 GET/POST /api/orders
│   │       │   └── [id].ts             📋 GET/PATCH/DELETE /api/orders/:id
│   │       │
│   │       └── admin/
│   │           └── users/
│   │               ├── index.ts         👥 GET /api/admin/users
│   │               ├── [id].ts          🗑️ DELETE /api/admin/users/:id
│   │               └── [id]/role.ts     🔄 PATCH /api/admin/users/:id/role
│   │
│   ├── 🧩 components/
│   │   ├── MedicalOrdersApp.tsx        🏥 Componente principal
│   │   ├── LoginForm.tsx               🔐 Formulario login
│   │   ├── RegisterForm.tsx            📝 Formulario registro
│   │   ├── CreateOrderForm.tsx         ➕ Crear órdenes
│   │   ├── OrdersList.tsx              📋 Lista de órdenes
│   │   ├── AdminManagement.tsx         👨‍💼 Panel admin
│   │   ├── InstallPrompt.tsx           📱 Instalación PWA
│   │   │
│   │   └── ui/                         🎨 Componentes UI (shadCN)
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       ├── select.tsx
│   │       └── ... (50+ componentes)
│   │
│   ├── 📚 lib/
│   │   ├── db.ts                       💾 Repositorios y BD
│   │   ├── auth.ts                     🔐 Utilidades auth (v1)
│   │   ├── orders.ts                   📋 Utilidades orders (v1)
│   │   ├── base-url.ts                 🌐 Base URL config
│   │   └── utils.ts                    🔧 Utilidades generales
│   │
│   ├── 🎨 styles/
│   │   └── global.css                  🎨 Estilos globales
│   │
│   ├── 📐 layouts/
│   │   └── main.astro                  📐 Layout principal
│   │
│   ├── ⚙️ config/
│   │   └── admin.ts                    👨‍💼 Config admin (v1)
│   │
│   ├── 🎣 hooks/
│   │   └── use-mobile.ts               📱 Hook mobile
│   │
│   ├── 📦 types/
│   │   └── order.ts                    📊 Tipos de órdenes
│   │
│   └── 🧩 site-components/             🎨 Devlink components
│       └── ... (componentes Webflow)
│
├── 🌍 public/
│   ├── manifest.json                    📱 PWA manifest
│   ├── sw.js                           ⚙️ Service Worker
│   ├── icon-192.png                    🖼️ Icono app
│   ├── clear-storage.js                🗑️ Script limpiar storage
│   └── download.html                   📥 Página descarga
│
└── 🏗️ generated/
    ├── webflow.css                      🎨 Variables Webflow
    └── fonts.css                        🔤 Fuentes
```

## 📊 Estadísticas del Proyecto

### Archivos por Categoría

| Categoría | Cantidad | Descripción |
|-----------|----------|-------------|
| 📝 Documentación | 15 | Guías y referencias |
| 🔌 APIs | 9 | Endpoints REST |
| 🧩 Componentes | 60+ | React + shadCN |
| 📚 Bibliotecas | 6 | Utilidades y helpers |
| 🎨 Estilos | 3 | CSS y temas |
| ⚙️ Configuración | 5 | Config del proyecto |
| 🗄️ Base de Datos | 1 | Schema SQL |

### Líneas de Código (aproximado)

```
TypeScript/TSX:  ~5,000 líneas
SQL:            ~100 líneas
CSS:            ~300 líneas
Documentación:  ~3,500 líneas
Total:          ~9,000 líneas
```

## 🔑 Archivos Clave

### Para Empezar

1. **START-HERE.md** - Tu punto de partida
2. **README.md** - Documentación completa
3. **DATABASE-SETUP.md** - Setup de base de datos
4. **package.json** - Dependencias y scripts

### Backend y APIs

1. **schema.sql** - Esquema de base de datos
2. **src/lib/db.ts** - Repositorios y lógica de BD
3. **src/pages/api/** - Todos los endpoints REST
4. **wrangler.jsonc** - Configuración Cloudflare

### Frontend Principal

1. **src/components/MedicalOrdersApp.tsx** - App principal
2. **src/components/LoginForm.tsx** - Autenticación
3. **src/components/OrdersList.tsx** - Lista de órdenes
4. **src/pages/index.astro** - Página principal

### Configuración

1. **astro.config.mjs** - Config de Astro
2. **tsconfig.json** - Config de TypeScript
3. **wrangler.jsonc** - Config de Cloudflare Workers

## 🗺️ Flujo de Datos

### Autenticación

```
Usuario → LoginForm.tsx
         ↓
    POST /api/auth/login
         ↓
    src/pages/api/auth/login.ts
         ↓
    src/lib/db.ts (UserRepository)
         ↓
    Cloudflare D1 Database
         ↓
    Respuesta con datos de usuario
         ↓
    MedicalOrdersApp.tsx (guarda sesión)
```

### Crear Orden

```
Usuario → CreateOrderForm.tsx
         ↓
    POST /api/orders
         ↓
    src/pages/api/orders/index.ts
         ↓
    src/lib/db.ts (OrderRepository)
         ↓
    Cloudflare D1 Database
         ↓
    Orden creada
         ↓
    OrdersList.tsx (actualiza lista)
```

### Administración

```
Admin → AdminManagement.tsx
        ↓
   GET /api/admin/users
        ↓
   src/pages/api/admin/users/index.ts
        ↓
   Verifica permisos de admin
        ↓
   src/lib/db.ts (UserRepository)
        ↓
   Cloudflare D1 Database
        ↓
   Lista de usuarios
        ↓
   AdminManagement.tsx (muestra panel)
```

## 📦 Dependencias Principales

### Framework y Runtime

- **Astro 5.x** - Framework principal
- **React 19** - Biblioteca UI
- **TypeScript** - Type safety
- **Cloudflare Workers** - Backend runtime

### Base de Datos

- **Cloudflare D1** - Base de datos SQL
- **Wrangler** - CLI de Cloudflare

### UI y Estilos

- **Tailwind CSS 4.x** - Estilos
- **shadCN UI** - Componentes
- **Radix UI** - Primitivas accesibles
- **Lucide React** - Iconos

### Validación y Forms

- **Zod** - Validación de schemas
- **React Hook Form** - Manejo de formularios

## 🔄 Ciclo de Vida del Desarrollo

### 1. Desarrollo Local

```bash
npm run dev
# ↓
# Astro dev server en localhost:3000
# ↓
# Hot reload automático
# ↓
# Cloudflare Workers en modo local
# ↓
# D1 database local
```

### 2. Build

```bash
npm run build
# ↓
# Astro compila archivos
# ↓
# Genera dist/ folder
# ↓
# Prepara para Cloudflare Workers
# ↓
# Optimiza assets
```

### 3. Deploy

```bash
npx wrangler deploy
# ↓
# Sube código a Cloudflare
# ↓
# Conecta con D1 database
# ↓
# Deploy global en edge network
# ↓
# App disponible en producción
```

## 🎯 Puntos de Entrada

### Para Usuarios

1. **URL de la app** → 
2. **index.astro** →
3. **MedicalOrdersApp.tsx** →
4. Login o registro

### Para Desarrolladores

1. **src/pages/api/** - APIs
2. **src/lib/db.ts** - Lógica de BD
3. **src/components/** - UI components
4. **schema.sql** - Estructura de datos

### Para Administradores

1. Login como admin
2. Panel de administración
3. Gestión de usuarios
4. Ver todas las órdenes

## 🔍 Buscar en el Código

### Autenticación
```
src/pages/api/auth/
src/components/LoginForm.tsx
src/components/RegisterForm.tsx
```

### Órdenes
```
src/pages/api/orders/
src/components/CreateOrderForm.tsx
src/components/OrdersList.tsx
src/types/order.ts
```

### Base de Datos
```
schema.sql
src/lib/db.ts
src/pages/api/
```

### UI Components
```
src/components/ui/
src/styles/global.css
```

### Configuración
```
wrangler.jsonc
astro.config.mjs
tsconfig.json
package.json
```

## 📚 Próximos Pasos

1. **Lee START-HERE.md** para empezar
2. **Configura la base de datos** con DATABASE-SETUP.md
3. **Explora los componentes** en src/components/
4. **Revisa las APIs** en src/pages/api/
5. **Personaliza según necesites**

## 💡 Tips de Navegación

- 📁 Todo el código fuente está en `src/`
- 🔌 Todas las APIs están en `src/pages/api/`
- 🧩 Todos los componentes están en `src/components/`
- 📝 Toda la documentación está en la raíz
- 🗄️ El esquema de BD está en `schema.sql`

## 🎓 Aprende Más

- **Astro**: https://astro.build/
- **React**: https://react.dev/
- **Cloudflare D1**: https://developers.cloudflare.com/d1/
- **Tailwind CSS**: https://tailwindcss.com/
- **shadCN UI**: https://ui.shadcn.com/

---

**¿Preguntas?** Consulta [DOCUMENTATION-INDEX.md](./DOCUMENTATION-INDEX.md) para ver toda la documentación disponible.
