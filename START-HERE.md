
# 🚀 EMPIEZA AQUÍ - Guía Rápida

## 👋 ¡Bienvenido!

Tu **Administrador de Órdenes Médicas** ahora tiene un **backend real con base de datos en la nube**. 

## ⚡ Inicio Rápido (2 minutos) - ¡NUEVO!

### ✅ Funciona Inmediatamente - Sin Configuración

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar desarrollo
npm run dev

# 3. ¡Ya está! Abre http://localhost:3000
```

**¡Así de fácil!** La app usa una base de datos simulada en memoria para desarrollo local.

**Credenciales:**
- Email: `loradavid000@gmail.com`
- Contraseña: `3008david`

> 💡 **Nota:** En desarrollo, los datos se guardan en memoria (RAM) y se pierden al reiniciar. Para datos permanentes, configura Cloudflare D1 (ver abajo).

## 🌐 Para Producción (5 minutos adicionales)

Cuando estés listo para desplegar con datos reales:

### Paso 1: Configurar Base de Datos

**Opción A - Script Automático (Recomendado)**

Mac/Linux:
```bash
./setup-database.sh
```

Windows:
```bash
setup-database.bat
```

**Opción B - Manual**

```bash
# 1. Crear base de datos
npx wrangler d1 create medical-orders-db

# 2. Copia el database_id que te da
# 3. Pégalo en wrangler.jsonc en la sección d1_databases

# 4. Inicializar esquema
npx wrangler d1 execute medical-orders-db --file=./schema.sql
```

### Paso 2: Iniciar Desarrollo
```bash
npm run dev
```

Abre: http://localhost:3000

### Paso 3: Iniciar Sesión

Usa las credenciales del admin:
- **Email**: `loradavid000@gmail.com`
- **Contraseña**: `3008david`

## 🎯 ¿Qué Puedes Hacer Ahora?

### Como Administrador

1. ✅ **Ver todas las órdenes** del sistema
2. ✅ **Crear nuevas órdenes** médicas
3. ✅ **Gestionar usuarios** (hacer admins, eliminar)
4. ✅ **Ver estadísticas** del sistema

### Como Usuario Normal

1. ✅ **Registrarte** con tu email
2. ✅ **Crear tus órdenes** médicas
3. ✅ **Ver solo tus órdenes**
4. ✅ **Cambiar estados** de tus órdenes

## 🌐 ¿Cómo Funciona?

### Arquitectura

```
┌─────────────────┐
│   Navegador     │ ← Usuario interactúa aquí
│   (React)       │
└────────┬────────┘
         │
         ↓ HTTP/REST
┌─────────────────┐
│ Cloudflare      │ ← Backend automático
│ Workers         │
└────────┬────────┘
         │
         ↓ SQL
┌─────────────────┐
│ Cloudflare D1   │ ← Base de datos en la nube
│ (SQLite)        │
└─────────────────┘
```

### Flujo de Datos

1. **Usuario crea una orden** → 
2. **React envía POST a `/api/orders`** →
3. **Cloudflare Workers valida y guarda en D1** →
4. **Todos los dispositivos ven la nueva orden** ✅

## 📱 Acceso Multi-Dispositivo

Una vez desplegado, accede desde:
- 🖥️ Tu computadora
- 📱 Tu teléfono
- 📟 Tu tablet
- 🌍 Cualquier lugar del mundo

¡Todos ven los mismos datos en tiempo real!

## 🚀 Desplegar a Producción

### 1. Construir
```bash
npm run build
```

### 2. Desplegar
```bash
npx wrangler deploy
```

### 3. Configurar Base de Datos de Producción
```bash
# La primera vez, inicializa la BD de producción
npx wrangler d1 execute medical-orders-db --file=./schema.sql --remote
```

### 4. ¡Listo!

Cloudflare te dará una URL como:
```
https://astro.TU-USUARIO.workers.dev
```

Comparte esa URL con tu equipo.

## 📚 Documentación Completa

### Empezar
- 📖 [README.md](./README.md) - Documentación principal
- 🎯 [QUICKSTART.md](./QUICKSTART.md) - Guía rápida

### Backend y Base de Datos
- ⭐ [BACKEND-DATABASE-UPDATE.md](./BACKEND-DATABASE-UPDATE.md) - Resumen de cambios
- 💾 [DATABASE-SETUP.md](./DATABASE-SETUP.md) - Configuración de BD
- 🔄 [MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md) - Migrar desde v1

### Referencia
- ❓ [FAQ-BACKEND.md](./FAQ-BACKEND.md) - Preguntas frecuentes
- 📝 [CHANGELOG-V2.md](./CHANGELOG-V2.md) - Qué cambió
- 🗂️ [DOCUMENTATION-INDEX.md](./DOCUMENTATION-INDEX.md) - Índice completo

### Despliegue
- 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md) - Cómo desplegar
- ✅ [PRODUCTION-CHECKLIST.md](./PRODUCTION-CHECKLIST.md) - Lista de verificación
- 📱 [NATIVE-APP-GUIDE.md](./NATIVE-APP-GUIDE.md) - Crear app nativa

## 🔐 Seguridad

### IMPORTANTE: Cambia la Contraseña del Admin

En producción, **DEBES** cambiar la contraseña por seguridad:

```bash
# 1. Genera hash de nueva contraseña
node -e "const crypto = require('crypto'); const pass = 'TU_NUEVA_CONTRASEÑA'; console.log(crypto.createHash('sha256').update(pass).digest('hex'));"

# 2. Actualiza en la base de datos
npx wrangler d1 execute medical-orders-db --remote --command="UPDATE users SET password_hash = 'TU_HASH_AQUI' WHERE email = 'loradavid000@gmail.com'"
```

## 🛠️ Comandos Útiles

### Desarrollo
```bash
npm run dev                    # Iniciar servidor local
npm run build                  # Construir para producción
```

### Base de Datos
```bash
# Ver usuarios
npx wrangler d1 execute medical-orders-db --command="SELECT * FROM users"

# Ver órdenes
npx wrangler d1 execute medical-orders-db --command="SELECT * FROM orders"

# Backup
npx wrangler d1 export medical-orders-db --output=backup.sql

# Restaurar
npx wrangler d1 execute medical-orders-db --file=backup.sql
```

### Despliegue
```bash
npx wrangler deploy            # Desplegar a producción
npx wrangler tail              # Ver logs en tiempo real
npx wrangler d1 list          # Ver bases de datos
```

## 🎓 Tutorial Paso a Paso

### 1. Primera Vez - Configuración

```bash
# a. Instalar
npm install

# b. Crear BD
npx wrangler d1 create medical-orders-db

# c. Actualizar wrangler.jsonc con el database_id

# d. Inicializar esquema
npx wrangler d1 execute medical-orders-db --file=./schema.sql

# e. Iniciar
npm run dev
```

### 2. Uso Diario - Desarrollo

```bash
# Iniciar servidor
npm run dev

# En otro terminal, ver logs de BD (opcional)
npx wrangler tail
```

### 3. Despliegue - Producción

```bash
# Construir
npm run build

# Desplegar
npx wrangler deploy

# Primera vez: inicializar BD de producción
npx wrangler d1 execute medical-orders-db --file=./schema.sql --remote
```

## ❓ Preguntas Frecuentes

### ¿Necesito Cloudflare?
**Sí**, la app usa Cloudflare Workers + D1 para el backend.

### ¿Cuánto cuesta?
**Gratis** para uso normal. Cloudflare tiene un plan gratuito muy generoso.

### ¿Funciona sin internet?
**No**, necesitas conexión para acceder a la base de datos.

### ¿Mis datos están seguros?
**Sí**, Cloudflare encripta todo con HTTPS y almacenamiento seguro.

### ¿Puedo usar mi propio dominio?
**Sí**, configura un dominio en Cloudflare Dashboard.

### ¿Funciona en móviles?
**Sí**, es totalmente responsive y puede instalarse como PWA.

## 🆘 ¿Problemas?

### Error: "Database not configured"
```bash
# Asegúrate de haber creado la BD
npx wrangler d1 list

# Si no existe, créala
npx wrangler d1 create medical-orders-db
```

### Error: "Table doesn't exist"
```bash
# Inicializa el esquema
npx wrangler d1 execute medical-orders-db --file=./schema.sql
```

### No puedo iniciar sesión
```bash
# Verifica que el admin existe
npx wrangler d1 execute medical-orders-db --command="SELECT * FROM users WHERE role='admin'"
```

### Otros problemas
Ver [FAQ-BACKEND.md](./FAQ-BACKEND.md) para más soluciones.

## 🎊 ¡Listo para Empezar!

Ahora que tienes todo configurado:

1. ✅ Inicia sesión como admin
2. ✅ Crea algunas órdenes de prueba
3. ✅ Registra otros usuarios
4. ✅ Prueba desde tu móvil
5. ✅ Despliega a producción

## 📞 Recursos

- 📚 [Documentación Completa](./DOCUMENTATION-INDEX.md)
- 🌐 [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- 💬 [Cloudflare Community](https://community.cloudflare.com/)

---

**¿Listo?** 

```bash
npm run dev
```

**¡Empieza a gestionar tus órdenes médicas ahora!** 🚀🏥

