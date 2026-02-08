# 💡 Tips y Mejores Prácticas para Producción

## 🔐 Seguridad

### 1. Cambiar Contraseñas Inmediatamente

Después de crear el admin con el script, cámbiala:

```bash
# Generar un hash seguro
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('TU-NUEVA-CONTRASEÑA', 10));"

# Actualizar en la base de datos
wrangler d1 execute medical-orders-db --remote --command="UPDATE users SET password='NUEVO-HASH' WHERE email='loradavid000@gmail.com';"
```

### 2. Usar Variables de Entorno

Para datos sensibles, usa secrets de Cloudflare:

```bash
# Agregar un secret
wrangler secret put MI_SECRET

# Usar en el código
const secret = env.MI_SECRET;
```

### 3. Rate Limiting

Considera agregar rate limiting para prevenir abuso:
- Limitar intentos de login
- Limitar creación de órdenes por usuario

### 4. CORS y Headers de Seguridad

Ya configurados en `astro.config.mjs`, pero verifica:
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options

---

## 📊 Monitoreo

### 1. Ver Logs en Tiempo Real

```bash
wrangler tail
```

### 2. Ver Logs Filtrados

```bash
# Solo errores
wrangler tail --status error

# Solo para una IP específica
wrangler tail --ip 192.168.1.1
```

### 3. Dashboard de Cloudflare

Ve a: https://dash.cloudflare.com
- Workers & Pages > Tu Worker
- Ahí puedes ver:
  - Requests por minuto
  - Errores
  - CPU time
  - Memoria usada

---

## 💾 Backups

### 1. Backup Automático (Recomendado)

Crea un script que se ejecute diariamente:

```bash
#!/bin/bash
# backup-daily.sh

DATE=$(date +%Y-%m-%d)
BACKUP_DIR="backups/$DATE"
mkdir -p $BACKUP_DIR

# Backup usuarios
wrangler d1 execute medical-orders-db --remote --command="SELECT * FROM users;" > "$BACKUP_DIR/users.json"

# Backup órdenes
wrangler d1 execute medical-orders-db --remote --command="SELECT * FROM orders;" > "$BACKUP_DIR/orders.json"

echo "Backup completado: $BACKUP_DIR"
```

### 2. Restaurar desde Backup

```bash
# Si necesitas restaurar
wrangler d1 execute medical-orders-db --remote --file=./backup.sql
```

---

## 🚀 Performance

### 1. Caché de Queries

Considera cachear queries frecuentes:
- Lista de usuarios (para admins)
- Estadísticas de órdenes

### 2. Índices en la Base de Datos

Ya incluidos en `schema.sql`:
- Índice en `users.email`
- Índice en `orders.user_id`
- Índice en `orders.status`

### 3. Paginación

Para apps con muchas órdenes, implementa paginación:

```typescript
// Ejemplo
const ORDERS_PER_PAGE = 20;
const offset = (page - 1) * ORDERS_PER_PAGE;

const query = `
  SELECT * FROM orders 
  WHERE user_id = ? 
  ORDER BY created_at DESC 
  LIMIT ? OFFSET ?
`;
```

---

## 🔄 Actualizaciones

### 1. Actualizar la App (Sin Downtime)

```bash
# 1. Hacer cambios en el código
# 2. Compilar
npm run build

# 3. Desplegar (Cloudflare maneja el rollout gradual)
wrangler deploy
```

### 2. Actualizar el Esquema de Base de Datos

**⚠️ CUIDADO:** Siempre haz backup antes

```bash
# 1. Backup
wrangler d1 execute medical-orders-db --remote --command="SELECT * FROM orders;" > backup-orders.json

# 2. Crear archivo de migración
# migration-add-column.sql
ALTER TABLE orders ADD COLUMN new_field TEXT;

# 3. Ejecutar migración
wrangler d1 execute medical-orders-db --remote --file=./migration-add-column.sql
```

---

## 👥 Multi-Tenancy (Múltiples Clínicas)

Si quieres que múltiples clínicas usen la misma app:

### Opción 1: Base de Datos por Cliente

Crea una DB para cada cliente:
```bash
wrangler d1 create clinic-hospital-a
wrangler d1 create clinic-hospital-b
```

### Opción 2: Columna organization_id

Agrega `organization_id` a las tablas:

```sql
ALTER TABLE users ADD COLUMN organization_id TEXT;
ALTER TABLE orders ADD COLUMN organization_id TEXT;

CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_orders_org ON orders(organization_id);
```

---

## 📱 Notificaciones Push

Para notificar a usuarios de nuevas órdenes:

### 1. Usar Cloudflare Workers + Web Push

```typescript
// Enviar notificación
async function sendNotification(userId: string, message: string) {
  // Implementar con Web Push API
  // https://developers.cloudflare.com/workers/examples/
}
```

### 2. Integrar con Servicios Externos

- Firebase Cloud Messaging (FCM)
- OneSignal
- Pusher

---

## 📧 Email Notifications

Integrar con servicios de email:

### 1. Cloudflare Email Workers

```typescript
import { EmailMessage } from "cloudflare:email";

export default {
  async email(message: EmailMessage, env: Env) {
    // Procesar email
  }
}
```

### 2. Servicios Externos

- SendGrid
- Mailgun
- Amazon SES

---

## 💰 Costos

### Cloudflare Workers Free Tier

- **100,000 requests/día** - Gratis
- **10ms CPU time por request** - Gratis
- **D1 Database**: 5 GB storage - Gratis

### Si Necesitas Más

**Workers Paid ($5/mes)**:
- 10 millones de requests/mes
- 30 segundos de CPU time por request

**D1 Paid ($5/10 GB)**:
- Hasta 10 GB de storage
- Reads y writes ilimitados

---

## 🧪 Testing

### 1. Testing Local

Prueba localmente antes de desplegar:

```bash
npm run dev
# Prueba todas las funciones
```

### 2. Testing en Staging

Crea un environment de staging:

```bash
# Crear DB de staging
wrangler d1 create medical-orders-db-staging

# Desplegar a staging
wrangler deploy --env staging
```

---

## 📈 Escalabilidad

### Cloudflare Workers Escala Automáticamente

- Sin configuración necesaria
- Maneja picos de tráfico automáticamente
- Distribución global en 275+ ciudades

### D1 Considerations

- Máximo 10 GB por base de datos (Free tier)
- Si necesitas más, considera:
  - Múltiples bases de datos
  - Cloudflare R2 para archivos
  - Cloudflare KV para caché

---

## 🎯 Métricas Importantes

### KPIs a Monitorear

1. **Requests por día**
2. **Tiempo de respuesta promedio**
3. **Tasa de error**
4. **Usuarios activos**
5. **Órdenes creadas por día**
6. **Uso de base de datos**

### Implementar Analytics

```typescript
// En cada request
const analytics = {
  timestamp: new Date().toISOString(),
  endpoint: request.url,
  method: request.method,
  userId: session.userId,
  responseTime: endTime - startTime,
};

// Enviar a analytics service
await env.ANALYTICS.put(`log-${Date.now()}`, JSON.stringify(analytics));
```

---

## 🔧 Troubleshooting

### Problema: "Database not configured"

**Solución:**
```bash
# Verificar que el database_id está en wrangler.jsonc
cat wrangler.jsonc

# Listar tus databases
wrangler d1 list

# Actualizar el ID en wrangler.jsonc
```

### Problema: "Too many requests"

**Solución:**
- Implementar caché
- Reducir queries innecesarios
- Usar Workers KV para datos frecuentes

### Problema: "Database locked"

**Solución:**
- D1 tiene límite de writes concurrentes
- Implementar queue para writes
- Usar Cloudflare Queues

---

## 📚 Recursos Adicionales

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [D1 Documentation](https://developers.cloudflare.com/d1/)
- [Astro Docs](https://docs.astro.build/)
- [React Docs](https://react.dev/)

---

## ✅ Checklist de Producción

Antes de dar acceso a clientes:

- [ ] Base de datos creada y configurada
- [ ] Contraseña del admin cambiada
- [ ] Backups configurados
- [ ] Monitoreo configurado
- [ ] Dominio personalizado (opcional)
- [ ] SSL/HTTPS activo
- [ ] Pruebas de login exitosas
- [ ] Pruebas de creación de órdenes
- [ ] Pruebas de filtros
- [ ] Pruebas en diferentes dispositivos
- [ ] Documentación entregada a clientes

---

¡Tu app está lista para escalar! 🚀
