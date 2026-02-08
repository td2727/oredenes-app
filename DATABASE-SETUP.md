# Configuración de Base de Datos

## 📋 Resumen

Esta aplicación ahora usa **Cloudflare D1** (base de datos SQL) para almacenar datos en línea. Todos los dispositivos se conectan a la misma base de datos en la nube.

## 🚀 Configuración Inicial

### 1. Crear la base de datos D1

```bash
# Crear base de datos en Cloudflare
npx wrangler d1 create medical-orders-db
```

Esto te dará un output como:
```
✅ Successfully created DB 'medical-orders-db'

[[d1_databases]]
binding = "DB"
database_name = "medical-orders-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 2. Actualizar wrangler.jsonc

Copia el `database_id` del paso anterior y reemplaza `preview-database-id` en el archivo `wrangler.jsonc`:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "medical-orders-db",
    "database_id": "TU-DATABASE-ID-AQUI"
  }
]
```

### 3. Inicializar el esquema de la base de datos

```bash
# Aplicar el esquema a la base de datos
npx wrangler d1 execute medical-orders-db --file=./schema.sql
```

Esto creará:
- Tabla de usuarios (`users`)
- Tabla de órdenes médicas (`orders`)
- Índices para mejor rendimiento
- Usuario administrador inicial

### 4. Verificar la base de datos

```bash
# Ver las tablas creadas
npx wrangler d1 execute medical-orders-db --command="SELECT name FROM sqlite_master WHERE type='table'"

# Ver el usuario admin creado
npx wrangler d1 execute medical-orders-db --command="SELECT id, email, name, role FROM users"
```

## 🔐 Usuario Administrador Inicial

El sistema crea automáticamente un administrador:

- **Email**: `loradavid000@gmail.com`
- **Contraseña**: `3008david`
- **Rol**: Admin

> ⚠️ **Importante**: En producción, cambia esta contraseña inmediatamente.

## 🧪 Desarrollo Local

Para desarrollo local, necesitas una base de datos de prueba:

```bash
# Crear base de datos local para desarrollo
npx wrangler d1 execute medical-orders-db --local --file=./schema.sql
```

En desarrollo, usa:
```bash
npm run dev
```

## 🌐 Despliegue en Producción

### 1. Construir la aplicación

```bash
npm run build
```

### 2. Desplegar a Cloudflare Workers

```bash
npx wrangler deploy
```

Esto desplegará:
- La aplicación en Cloudflare Workers
- Se conectará automáticamente a la base de datos D1

### 3. Verificar el despliegue

Visita la URL que te proporciona Wrangler después del despliegue.

## 📊 Estructura de la Base de Datos

### Tabla: users

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | TEXT | ID único del usuario |
| email | TEXT | Email (único) |
| password_hash | TEXT | Contraseña hasheada |
| name | TEXT | Nombre del usuario |
| role | TEXT | 'admin' o 'user' |
| created_at | DATETIME | Fecha de creación |
| updated_at | DATETIME | Fecha de actualización |

### Tabla: orders

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | TEXT | ID único de la orden |
| user_id | TEXT | ID del usuario que creó la orden |
| patient_name | TEXT | Nombre del paciente |
| order_type | TEXT | Tomografía, Radiografía, Ortodoncia, Cefalometría |
| status | TEXT | Pendiente, En Proceso, Completada |
| description | TEXT | Descripción opcional |
| priority | TEXT | Alta, Media, Baja |
| created_at | DATETIME | Fecha de creación |
| updated_at | DATETIME | Fecha de actualización |

## 🔧 Comandos Útiles

### Ver datos en la base de datos

```bash
# Ver todos los usuarios
npx wrangler d1 execute medical-orders-db --command="SELECT * FROM users"

# Ver todas las órdenes
npx wrangler d1 execute medical-orders-db --command="SELECT * FROM orders"

# Contar órdenes por estado
npx wrangler d1 execute medical-orders-db --command="SELECT status, COUNT(*) as total FROM orders GROUP BY status"
```

### Hacer respaldo de la base de datos

```bash
# Exportar todos los datos
npx wrangler d1 export medical-orders-db --output=backup.sql
```

### Restaurar respaldo

```bash
# Importar datos desde un archivo
npx wrangler d1 execute medical-orders-db --file=backup.sql
```

### Resetear la base de datos (⚠️ Borra todos los datos)

```bash
# Eliminar todas las tablas y volver a crear
npx wrangler d1 execute medical-orders-db --command="DROP TABLE IF EXISTS orders; DROP TABLE IF EXISTS users;"
npx wrangler d1 execute medical-orders-db --file=./schema.sql
```

## 🔒 Seguridad

### Cambiar contraseña del admin

1. Genera un nuevo hash de contraseña:
```bash
# En Node.js
node -e "const crypto = require('crypto'); const password = 'TU_NUEVA_CONTRASEÑA'; const hash = crypto.createHash('sha256').update(password).digest('hex'); console.log(hash);"
```

2. Actualiza en la base de datos:
```bash
npx wrangler d1 execute medical-orders-db --command="UPDATE users SET password_hash = 'TU_NUEVO_HASH' WHERE email = 'loradavid000@gmail.com'"
```

### Crear un nuevo administrador

```bash
npx wrangler d1 execute medical-orders-db --command="INSERT INTO users (id, email, password_hash, name, role) VALUES ('admin-2', 'nuevo@email.com', 'HASH_DE_CONTRASEÑA', 'Nombre Admin', 'admin')"
```

## 🌍 Acceso desde Múltiples Dispositivos

Una vez desplegado:

1. **Todos los dispositivos** pueden acceder a la misma URL
2. **Los datos se sincronizan** automáticamente entre dispositivos
3. **Cada usuario** ve solo sus propias órdenes
4. **Los admins** pueden ver todas las órdenes

## 📱 Conexión Offline

La base de datos requiere conexión a internet. Si no hay conexión:
- Los usuarios verán un error de conexión
- Podrán intentar reconectar con el botón "Actualizar"
- Los datos no se guardan localmente (todo está en la nube)

## 🆘 Solución de Problemas

### Error: "Database not configured"

1. Verifica que `wrangler.jsonc` tiene el `database_id` correcto
2. Asegúrate de haber ejecutado `wrangler d1 create`
3. Reinicia el servidor de desarrollo

### Error: "Table doesn't exist"

1. Ejecuta el esquema: `npx wrangler d1 execute medical-orders-db --file=./schema.sql`
2. Verifica las tablas: `npx wrangler d1 execute medical-orders-db --command="SELECT name FROM sqlite_master WHERE type='table'"`

### No puedo iniciar sesión

1. Verifica que el usuario existe en la base de datos
2. Usa las credenciales del admin inicial: `loradavid000@gmail.com` / `3008david`
3. Si olvidaste tu contraseña, sigue los pasos en "Cambiar contraseña del admin"

## 📚 Recursos Adicionales

- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [SQL Reference](https://www.sqlite.org/lang.html)

## ✅ Checklist de Configuración

- [ ] Crear base de datos D1
- [ ] Actualizar `wrangler.jsonc` con database_id
- [ ] Ejecutar schema.sql
- [ ] Verificar usuario admin
- [ ] Probar en desarrollo local
- [ ] Construir aplicación
- [ ] Desplegar a producción
- [ ] Cambiar contraseña del admin
- [ ] Probar acceso desde múltiples dispositivos
