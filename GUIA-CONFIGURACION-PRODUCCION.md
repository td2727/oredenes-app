# 🚀 Guía de Configuración para Producción

Esta guía te llevará paso a paso para configurar la base de datos y desplegar tu app para que los clientes puedan usarla.

## 📋 Pre-requisitos

1. Tener una cuenta en Cloudflare (es gratis)
2. Tener instalado Wrangler CLI
3. Estar autenticado en Wrangler

---

## Paso 1: Instalar y Autenticar Wrangler

### 1.1 Instalar Wrangler (si no lo tienes)
```bash
npm install -g wrangler
```

### 1.2 Autenticarse en Cloudflare
```bash
wrangler login
```
Esto abrirá tu navegador para que autorices la conexión.

---

## Paso 2: Crear la Base de Datos en Cloudflare

### 2.1 Crear la base de datos D1
```bash
wrangler d1 create medical-orders-db
```

**¡IMPORTANTE!** Guarda el output que te da. Se verá algo así:
```
[[d1_databases]]
binding = "DB"
database_name = "medical-orders-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 2.2 Copiar el database_id
Copia el `database_id` que te dio el comando anterior.

---

## Paso 3: Configurar wrangler.jsonc

Abre el archivo `wrangler.jsonc` y actualiza la sección de `d1_databases`:

```jsonc
{
  "name": "medical-orders-app",
  "compatibility_date": "2024-01-01",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "medical-orders-db",
      "database_id": "PEGA-AQUI-TU-DATABASE-ID"  // ← Reemplaza esto
    }
  ]
}
```

---

## Paso 4: Crear las Tablas en la Base de Datos

### 4.1 Ejecutar el script de creación de tablas

**En Mac/Linux:**
```bash
wrangler d1 execute medical-orders-db --remote --file=./schema.sql
```

**En Windows (PowerShell):**
```powershell
wrangler d1 execute medical-orders-db --remote --file=.\schema.sql
```

Deberías ver un mensaje de éxito confirmando que las tablas fueron creadas.

---

## Paso 5: Crear el Usuario Administrador Principal

### 5.1 Crear un archivo temporal para el admin

Crea un archivo llamado `create-admin.sql` con este contenido:

```sql
INSERT INTO users (id, email, password, name, role, created_at)
VALUES (
  'admin-001',
  'loradavid000@gmail.com',
  -- Contraseña hasheada (cambiar en producción)
  '$2a$10$abcdefghijklmnopqrstuv',
  'David Lora',
  'admin',
  datetime('now')
);
```

### 5.2 Ejecutar el script para crear el admin
```bash
wrangler d1 execute medical-orders-db --remote --file=./create-admin.sql
```

---

## Paso 6: Configurar Variables de Entorno

### 6.1 Actualizar el archivo `.env` (para desarrollo local)
```env
WEBFLOW_CMS_SITE_API_TOKEN=tu-token-aqui
WEBFLOW_API_HOST=https://api.webflow.com
```

### 6.2 Configurar secrets en Cloudflare (para producción)
```bash
# Si necesitas agregar tokens u otras variables sensibles
wrangler secret put WEBFLOW_CMS_SITE_API_TOKEN
# Te pedirá que ingreses el valor
```

---

## Paso 7: Desplegar a Cloudflare Workers

### 7.1 Construir la aplicación
```bash
npm run build
```

### 7.2 Desplegar
```bash
wrangler deploy
```

Esto desplegará tu app y te dará una URL como:
```
https://medical-orders-app.tu-cuenta.workers.dev
```

---

## Paso 8: Configurar Dominio Personalizado (Opcional)

### 8.1 En el Dashboard de Cloudflare

1. Ve a **Workers & Pages**
2. Selecciona tu worker `medical-orders-app`
3. Ve a **Settings** > **Triggers**
4. En **Custom Domains**, haz clic en **Add Custom Domain**
5. Ingresa tu dominio (ej: `ordenes.midominio.com`)
6. Sigue las instrucciones para configurar el DNS

---

## Paso 9: Verificar que Todo Funciona

### 9.1 Pruebas básicas

1. **Abrir la app** en la URL que te dio Cloudflare
2. **Registrar un usuario** de prueba
3. **Crear una orden** de prueba
4. **Verificar que aparece** en la lista
5. **Cambiar el estado** de la orden
6. **Filtrar** por diferentes estados

### 9.2 Verificar la base de datos

Para ver los datos en tu base de datos:
```bash
wrangler d1 execute medical-orders-db --remote --command="SELECT * FROM users;"
wrangler d1 execute medical-orders-db --remote --command="SELECT * FROM orders;"
```

---

## 🔐 Seguridad en Producción

### Cambiar la Contraseña del Admin

1. **Generar un hash seguro de tu contraseña:**

```bash
# Instalar bcrypt globalmente (solo una vez)
npm install -g bcryptjs

# Crear un script rápido para hashear
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('TU-CONTRASEÑA-AQUI', 10));"
```

2. **Actualizar la contraseña en la base de datos:**

```bash
wrangler d1 execute medical-orders-db --remote --command="UPDATE users SET password='HASH-GENERADO-AQUI' WHERE email='loradavid000@gmail.com';"
```

---

## 📊 Monitoreo y Mantenimiento

### Ver logs en tiempo real
```bash
wrangler tail
```

### Ver estadísticas de uso
Ve al Dashboard de Cloudflare > Workers & Pages > Tu worker

### Hacer respaldo de la base de datos
```bash
# Exportar usuarios
wrangler d1 execute medical-orders-db --remote --command="SELECT * FROM users;" > backup-users.sql

# Exportar órdenes
wrangler d1 execute medical-orders-db --remote --command="SELECT * FROM orders;" > backup-orders.sql
```

---

## 🆘 Solución de Problemas

### Error: "Database not found"
- Verifica que el `database_id` en `wrangler.jsonc` sea correcto
- Ejecuta `wrangler d1 list` para ver tus bases de datos

### Error: "Table already exists"
- Las tablas ya están creadas, puedes continuar

### Error al autenticar
- Verifica que el hash de la contraseña sea correcto
- Intenta crear un nuevo usuario desde el formulario de registro

### La app no se actualiza
- Haz `wrangler deploy` de nuevo
- Limpia el caché del navegador (Ctrl + Shift + R)

---

## 📱 Compartir con Clientes

Una vez desplegada, puedes compartir la URL con tus clientes:

```
https://medical-orders-app.tu-cuenta.workers.dev
```

O si configuraste un dominio personalizado:
```
https://ordenes.tudominio.com
```

### Instrucciones para los clientes:

1. **Primera vez:** Hacer clic en "Registrarse"
2. Ingresar su email y contraseña
3. Ya pueden crear y ver sus órdenes
4. Los admins pueden ver todas las órdenes

---

## 📞 Contacto y Soporte

Si tienes problemas:
- Revisa los logs con `wrangler tail`
- Verifica la base de datos con los comandos SQL
- Revisa la documentación de Cloudflare: https://developers.cloudflare.com/d1/

---

## ✅ Checklist Final

Antes de dar acceso a clientes, verifica:

- [ ] Base de datos creada y configurada
- [ ] Tablas creadas (users, orders)
- [ ] Usuario admin principal creado
- [ ] App desplegada y accesible
- [ ] Registro de usuarios funciona
- [ ] Crear órdenes funciona
- [ ] Filtros funcionan
- [ ] Cambio de estado funciona
- [ ] (Opcional) Dominio personalizado configurado

---

¡Listo! Tu app está en producción y lista para usar 🎉
