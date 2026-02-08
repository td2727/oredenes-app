# ❓ Preguntas Frecuentes - Backend y Base de Datos

## 🌐 Conectividad

### ¿Necesito conexión a internet para usar la app?

**Sí**, ahora que la app usa base de datos en la nube (Cloudflare D1), necesitas conexión a internet para:
- Iniciar sesión
- Ver órdenes
- Crear nuevas órdenes
- Actualizar el estado de órdenes

Sin internet, verás un mensaje de error de conexión.

### ¿Puedo usar la app sin conexión?

En esta versión no hay soporte offline completo. Sin embargo, puedes:
- Ver la última pantalla cargada
- Los datos en caché del navegador pueden mostrar información desactualizada

Para uso offline completo, necesitarías implementar Service Workers y almacenamiento local con sincronización.

### ¿Qué pasa si se cae Cloudflare?

Cloudflare tiene un uptime del 99.99%, pero si hay una interrupción:
- La app mostrará errores de conexión
- No podrás acceder a los datos temporalmente
- Una vez restaurado el servicio, todo volverá a funcionar

Los datos **NO se pierden**, solo no son accesibles temporalmente.

## 💾 Datos y Almacenamiento

### ¿Cuántas órdenes puedo crear?

**Plan Gratuito de Cloudflare D1**:
- 5 GB de almacenamiento
- 5 millones de lecturas al mes
- 100,000 escrituras al mes

Para uso típico de una clínica pequeña-mediana, esto es más que suficiente.

### ¿Los datos están encriptados?

**Sí**:
- **En tránsito**: HTTPS encripta todas las comunicaciones
- **En reposo**: Cloudflare encripta los datos en sus servidores
- **Contraseñas**: Hasheadas con SHA-256

### ¿Puedo hacer respaldos de mi base de datos?

**Sí**, puedes exportar todos los datos:

```bash
# Exportar base de datos completa
npx wrangler d1 export medical-orders-db --output=backup.sql

# Restaurar desde backup
npx wrangler d1 execute medical-orders-db --file=backup.sql
```

Recomendamos hacer respaldos semanales o mensuales.

### ¿Se pueden recuperar datos eliminados?

**No automáticamente**. Cuando eliminas:
- Un usuario: se eliminan también todas sus órdenes
- Una orden: se elimina permanentemente

Por eso es importante:
1. Hacer respaldos regulares
2. Confirmar antes de eliminar
3. Considerar un estado "archivado" en lugar de eliminar

## 👥 Usuarios y Autenticación

### ¿Cuántos usuarios puede tener el sistema?

**Ilimitados** dentro de las cuotas de Cloudflare D1. El plan gratuito soporta miles de usuarios sin problema.

### ¿Puedo cambiar mi contraseña?

Actualmente no hay interfaz para cambiar contraseña. Puedes hacerlo vía SQL:

```bash
# 1. Genera el hash de tu nueva contraseña
node -e "const crypto = require('crypto'); console.log(crypto.createHash('sha256').update('TU_NUEVA_CONTRASEÑA').digest('hex'));"

# 2. Actualiza en la base de datos
npx wrangler d1 execute medical-orders-db --command="UPDATE users SET password_hash = 'TU_HASH_AQUI' WHERE email = 'tu@email.com'"
```

### ¿Puedo recuperar mi contraseña olvidada?

Actualmente no hay sistema de recuperación de contraseña. Un administrador puede:
1. Cambiar tu contraseña desde la base de datos
2. Darte la nueva contraseña temporalmente
3. Tú la cambias después

**Próxima actualización**: Sistema de recuperación con email.

### ¿Puedo eliminar mi cuenta?

Un administrador puede eliminar tu cuenta desde el panel de administración. Esto eliminará:
- Tu usuario
- Todas tus órdenes
- Tu historial completo

⚠️ **Esta acción es irreversible**.

## 🔒 Seguridad y Permisos

### ¿Los usuarios normales pueden ver órdenes de otros?

**No**. Cada usuario solo ve sus propias órdenes. Solo los administradores pueden ver todas las órdenes.

### ¿Quién puede cambiar el estado de una orden?

- **Usuario propietario**: Puede cambiar el estado de sus propias órdenes
- **Administradores**: Pueden cambiar el estado de cualquier orden

### ¿Qué puede hacer un administrador?

Un admin puede:
- ✅ Ver todas las órdenes de todos los usuarios
- ✅ Crear, editar y eliminar cualquier orden
- ✅ Ver la lista de todos los usuarios
- ✅ Hacer a otros usuarios administradores
- ✅ Quitar permisos de admin
- ✅ Eliminar usuarios
- ✅ Ver estadísticas del sistema

Un admin **NO puede**:
- ❌ Quitarse sus propios permisos
- ❌ Eliminar su propia cuenta

### ¿Cómo se protegen las APIs?

- **Autenticación**: Se verifica el usuario en cada petición
- **Autorización**: Se verifican permisos antes de ejecutar acciones
- **Validación**: Se valida entrada en el servidor
- **CORS**: Configurado para solo aceptar peticiones del mismo origen

## 🚀 Rendimiento

### ¿Qué tan rápida es la app?

**Muy rápida**. Cloudflare Workers + D1 están optimizados para:
- Respuestas en < 100ms en promedio
- Escalamiento automático
- Red global de CDN

La velocidad depende de:
- Tu conexión a internet
- La ubicación geográfica (Cloudflare tiene nodos globales)
- La carga del servidor

### ¿Cuántos usuarios pueden usar la app simultáneamente?

**Miles sin problema**. Cloudflare Workers escala automáticamente. Cada petición se maneja independientemente.

### ¿La app se hace más lenta con muchas órdenes?

**No significativamente**. La base de datos tiene índices optimizados para:
- Búsquedas rápidas por usuario
- Filtrado por estado
- Ordenamiento por fecha

Hasta 100,000 órdenes: rendimiento excelente
Más de 100,000: considera paginación avanzada

## 💰 Costos

### ¿Cuánto cuesta usar Cloudflare D1?

**Plan Gratuito** (Forever Free):
- 5 GB almacenamiento
- 5M lecturas/mes
- 100K escrituras/mes
- **$0/mes**

**Plan Pagado** (si excedes el gratuito):
- $0.50 por GB adicional
- $1.00 por millón de lecturas adicionales
- $1.00 por millón de escrituras adicionales

Para una clínica pequeña: **$0/mes** (plan gratuito suficiente)
Para una clínica grande: **$5-20/mes** estimado

### ¿Hay cargos ocultos?

**No**. Todo es transparente:
- D1: Según uso (plan gratuito generoso)
- Workers: Incluido en D1
- Bandwidth: 10 TB gratis/mes

Monitorea tu uso en: https://dash.cloudflare.com

## 🔧 Desarrollo y Personalización

### ¿Puedo agregar más campos a las órdenes?

**Sí**, pero requiere:

1. Actualizar el esquema SQL:
```sql
ALTER TABLE orders ADD COLUMN nuevo_campo TEXT;
```

2. Actualizar los tipos en TypeScript:
```typescript
// src/lib/db.ts
interface Order {
  // ... campos existentes
  nuevo_campo?: string;
}
```

3. Actualizar las APIs y componentes

### ¿Puedo cambiar los tipos de órdenes?

**Sí**, edita el archivo `schema.sql`:

```sql
order_type TEXT NOT NULL CHECK(order_type IN (
  'Tomografía', 
  'Radiografía', 
  'Ortodoncia', 
  'Cefalometría',
  'NUEVO_TIPO_AQUI'
))
```

Luego actualiza en los componentes React.

### ¿Puedo usar otra base de datos en lugar de D1?

**Sí**, puedes adaptar el código para:
- PostgreSQL
- MySQL
- MongoDB
- Supabase
- PlanetScale

Necesitarías cambiar:
- `src/lib/db.ts` - Lógica de conexión
- Las APIs para usar el nuevo cliente
- `wrangler.jsonc` para configurar el binding

## 📱 App Móvil

### ¿Funciona en móviles?

**Sí**, la app es totalmente responsive y funciona en:
- iPhone (Safari, Chrome)
- Android (Chrome, Firefox)
- Tablets
- Computadoras

### ¿Puedo instalarla como app nativa?

**Sí**, como PWA (Progressive Web App):

1. Abre la app en el navegador móvil
2. Android: "Agregar a pantalla de inicio"
3. iOS: Safari → Compartir → "Agregar a pantalla de inicio"

### ¿Puedo publicarla en app stores?

**Sí**, con herramientas como:
- [PWA Builder](https://www.pwabuilder.com/)
- [Capacitor](https://capacitorjs.com/)
- [Cordova](https://cordova.apache.org/)

Ver [NATIVE-APP-GUIDE.md](./NATIVE-APP-GUIDE.md) para más detalles.

## 🆘 Errores Comunes

### "Database not configured"

**Causa**: No se configuró la base de datos D1

**Solución**:
```bash
npx wrangler d1 create medical-orders-db
# Actualiza wrangler.jsonc
npx wrangler d1 execute medical-orders-db --file=./schema.sql
```

### "Error de conexión. Verifica tu conexión a internet"

**Causas posibles**:
1. No hay internet
2. Firewall bloqueando Cloudflare
3. Servidor en mantenimiento

**Solución**:
1. Verifica tu conexión
2. Recarga la página
3. Espera unos minutos

### "No tienes permisos para realizar esta acción"

**Causa**: Intentas hacer algo que solo admins pueden

**Solución**:
- Si deberías ser admin: contacta a un administrador
- Si no: esto es esperado, solo admins pueden hacer ciertas acciones

### "Este email ya está registrado"

**Causa**: Ya existe un usuario con ese email

**Solución**:
1. Usa el botón "Inicia sesión aquí"
2. Si olvidaste tu contraseña, contacta a un admin
3. Usa otro email

## 📞 Soporte

### ¿Dónde puedo obtener ayuda?

1. **Documentación**:
   - [README.md](./README.md)
   - [DATABASE-SETUP.md](./DATABASE-SETUP.md)
   - [BACKEND-DATABASE-UPDATE.md](./BACKEND-DATABASE-UPDATE.md)

2. **Logs del servidor**:
```bash
npx wrangler tail
```

3. **Consola del navegador**:
   - F12 → Console
   - Revisa errores en rojo

4. **Comunidad Cloudflare**:
   - [Cloudflare Community](https://community.cloudflare.com/)
   - [Discord de Cloudflare](https://discord.gg/cloudflaredev)

### ¿Cómo reporto un bug?

1. Anota exactamente qué estabas haciendo
2. Copia el mensaje de error completo
3. Revisa la consola del navegador (F12)
4. Captura de pantalla si es posible
5. Describe los pasos para reproducir

### ¿Puedo contribuir al proyecto?

¡Por supuesto! El código está diseñado para ser modificable y extensible.

## 🎯 Mejores Prácticas

### Recomendaciones para Producción

1. **Seguridad**:
   - Cambia la contraseña del admin inicial
   - Usa HTTPS siempre
   - Haz respaldos regulares

2. **Rendimiento**:
   - Monitorea el uso de D1
   - Implementa paginación si tienes muchas órdenes
   - Usa el botón "Actualizar" en lugar de recargar la página

3. **Datos**:
   - Haz backups semanales
   - Archiva órdenes antiguas
   - Limpia usuarios inactivos

4. **Usuarios**:
   - Capacita a los usuarios en el uso
   - Define roles claramente
   - Documenta procesos internos

---

¿Tienes más preguntas? Consulta los otros documentos de la guía o contacta al equipo de soporte.
