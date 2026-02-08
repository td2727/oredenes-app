


# 🏥 Administrador de Órdenes Médicas

Aplicación web moderna para la gestión de órdenes médicas (Tomografía, Radiografía, Ortodoncia, Cefalometría) con autenticación de usuarios, roles y sincronización multi-dispositivo.

## 🚀 Inicio Súper Rápido

**¿Solo quieres probar la app?** ¡Funciona inmediatamente sin configuración!

```bash
npm install
npm run dev
```

Abre http://localhost:3000 e inicia sesión con:
- **Email:** `loradavid000@gmail.com`
- **Contraseña:** `3008david`

> 💡 En desarrollo usa una base de datos simulada en memoria. Para producción con datos reales, ve a [Desplegar a Producción](#-desplegar-a-producción).

## ✨ Características Principales

- 🔐 **Autenticación de usuarios** con roles (Admin/Usuario)
- 📝 **Gestión completa de órdenes médicas** (Tomografía, Radiografía, Ortodoncia, Cefalometría)
- 👥 **Sistema multi-usuario** con base de datos en línea
- 🌐 **Sincronización en tiempo real** entre todos los dispositivos
- 🔒 **Seguridad** - cada usuario solo ve sus propias órdenes
- 👨‍💼 **Panel de administración** para gestionar usuarios y ver todas las órdenes
- 🔍 **Filtros por estado** - Pendientes, En Proceso, Completadas, Canceladas
- 📱 **Progressive Web App (PWA)** - instálala como app nativa
- 🎨 **Diseño responsive** optimizado para móviles y tablets
- 💾 **Base de datos Cloudflare D1** - datos persistentes en la nube

## 🎯 Desplegar a Producción

### Opción 1: Script Automático (⚡ Recomendado)

**Mac/Linux:**
```bash
./setup-production.sh
```

**Windows:**
```bash
setup-production.bat
```

### Opción 2: Manual (Paso a Paso)

```bash
# 1. Instalar y autenticar Wrangler
npm install -g wrangler
wrangler login

# 2. Crear base de datos
wrangler d1 create medical-orders-db
# Guarda el database_id que te da

# 3. Configurar wrangler.jsonc
# Pega tu database_id en wrangler.jsonc

# 4. Crear tablas
wrangler d1 execute medical-orders-db --remote --file=./schema.sql

# 5. Crear usuario admin
wrangler d1 execute medical-orders-db --remote --file=./create-admin.sql

# 6. Compilar y desplegar
npm run build
wrangler deploy
```

### 📖 Guías Detalladas

- **[RESUMEN-DESPLIEGUE.md](./RESUMEN-DESPLIEGUE.md)** - Resumen rápido con comandos
- **[GUIA-CONFIGURACION-PRODUCCION.md](./GUIA-CONFIGURACION-PRODUCCION.md)** - Guía completa paso a paso

Tu app estará disponible en:
```
https://medical-orders-app.TU-USUARIO.workers.dev
```

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar la base de datos

**⚠️ IMPORTANTE**: Antes de usar la app, debes configurar la base de datos D1.

Sigue la guía completa en [DATABASE-SETUP.md](./DATABASE-SETUP.md)

Resumen rápido:
```bash
# Crear base de datos
npx wrangler d1 create medical-orders-db

# Actualizar wrangler.jsonc con el database_id

# Inicializar esquema
npx wrangler d1 execute medical-orders-db --file=./schema.sql
```

### 3. Desarrollo local

Edita el archivo `src/config/admin.ts`:

```typescript
export const MAIN_ADMIN_CONFIG = {
  email: 'loradavid000@gmail.com',    // Tu correo
  password: '3008david',               // Tu contraseña
  name: 'David Lora'                   // Tu nombre
};
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La app estará disponible en: `http://localhost:3000`

## 🔐 Credenciales de Acceso

**Administrador Principal:**
- Email: `loradavid000@gmail.com`
- Contraseña: `3008david`

Los usuarios regulares pueden registrarse desde la pantalla de login.

## 📱 Instalación como PWA

### Android (Chrome):
1. Abre la app en Chrome
2. Toca "Agregar a pantalla de inicio"
3. Confirma la instalación

### iOS (Safari):
1. Abre la app en Safari
2. Toca el botón "Compartir"
3. Selecciona "Agregar a pantalla de inicio"

### Desktop (Chrome/Edge):
1. Busca el ícono de instalación en la barra de direcciones
2. Haz clic en "Instalar"

## 🏗️ Compilar para Producción

```bash
npm run build
```

Esto generará los archivos optimizados en la carpeta `dist/`.

## 🚀 Desplegar

### Webflow Cloud (Recomendado)

El proyecto está configurado para desplegar en Webflow Cloud con Cloudflare Workers.

### Cloudflare Pages

```bash
npm run build
wrangler pages publish dist
```

### Otros Servicios

Puedes desplegar en cualquier servicio que soporte Astro:
- Vercel
- Netlify
- Railway
- Render

## 📂 Estructura del Proyecto

```
/
├── src/
│   ├── components/        # Componentes React
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── CreateOrderForm.tsx
│   │   ├── OrdersList.tsx
│   │   ├── AdminManagement.tsx
│   │   └── MedicalOrdersApp.tsx
│   ├── config/           # Configuración
│   │   └── admin.ts      # Config del admin principal
│   ├── layouts/          # Layouts de Astro
│   │   └── main.astro
│   ├── lib/             # Lógica de negocio
│   │   ├── auth.ts      # Autenticación
│   │   └── orders.ts    # Gestión de órdenes
│   ├── pages/           # Páginas de Astro
│   │   └── index.astro
│   ├── types/           # Tipos de TypeScript
│   │   └── order.ts
│   └── styles/          # Estilos globales
│       └── global.css
├── public/              # Archivos estáticos
│   ├── manifest.json    # PWA manifest
│   ├── sw.js           # Service Worker
│   └── clear-storage.js
└── generated/          # Archivos generados por Webflow
```

## 🔧 Scripts Disponibles

```bash
npm run dev         # Inicia servidor de desarrollo
npm run build       # Compila para producción
npm run preview     # Preview de la build con Wrangler
npm run astro       # CLI de Astro
npm run cf-typegen  # Genera tipos de Cloudflare
```

## ⚠️ Notas de Seguridad

**Para Producción:**

1. **NO uses localStorage para datos sensibles** - Implementa un backend real con base de datos
2. **Hash de contraseñas** - Las contraseñas deben ser hasheadas (bcrypt, argon2)
3. **JWT Tokens** - Usa tokens seguros para autenticación
4. **HTTPS** - Asegúrate de usar HTTPS en producción
5. **HIPAA Compliance** - Si manejas datos médicos reales, asegura cumplimiento con HIPAA

**Este sistema es perfecto para:**
- ✅ Desarrollo y pruebas
- ✅ Demos y prototipos
- ✅ Uso interno en redes privadas

**Para producción con datos médicos reales, necesitas:**
- ❌ Base de datos real (PostgreSQL, MongoDB, etc.)
- ❌ Backend con API REST o GraphQL
- ❌ Autenticación con OAuth2/JWT
- ❌ Encriptación de datos sensibles
- ❌ Auditoría y logs de acceso

## 📚 Documentación Adicional

- [QUICKSTART.md](./QUICKSTART.md) - Guía de inicio rápido
- [FEATURES.md](./FEATURES.md) - Lista completa de características
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guía de despliegue
- [CONFIGURACION-ADMIN.md](./CONFIGURACION-ADMIN.md) - Configuración del administrador
- [NATIVE-APP-GUIDE.md](./NATIVE-APP-GUIDE.md) - Guía para crear apps nativas

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👤 Autor

**David Lora**
- Email: loradavid000@gmail.com

## 🙏 Agradecimientos

- Construido con [Astro](https://astro.build/)
- UI components por [shadcn/ui](https://ui.shadcn.com/)
- Iconos por [Lucide](https://lucide.dev/)
- Desplegado en [Webflow Cloud](https://webflow.com/)

---

**¿Necesitas ayuda?** Abre un issue en GitHub o contáctame directamente.

**¡Gracias por usar este sistema! 🚀**



