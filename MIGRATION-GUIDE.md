# 🔄 Guía de Migración de localStorage a Base de Datos

## ⚠️ Importante

Si ya has estado usando la aplicación con datos en **localStorage**, necesitarás migrar tus datos a la nueva base de datos.

## 📋 ¿Qué pasó con mis datos?

### Datos Antiguos (localStorage)
- Guardados solo en tu navegador
- No se comparten entre dispositivos
- Se pierden al limpiar el navegador

### Datos Nuevos (Base de Datos D1)
- Guardados en la nube
- Accesibles desde cualquier dispositivo
- Persistentes y seguros

## 🚀 Proceso de Migración

### Paso 1: Respaldar datos antiguos (Opcional)

Si quieres guardar tus datos antiguos:

1. Abre la **consola del navegador** (F12)
2. Ve a la pestaña **Console**
3. Ejecuta este código:

```javascript
// Exportar datos antiguos
const backup = {
  users: JSON.parse(localStorage.getItem('users') || '[]'),
  orders: JSON.parse(localStorage.getItem('orders') || '[]'),
  admins: JSON.parse(localStorage.getItem('admins') || '[]')
};

// Descargar como archivo
const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'backup-ordenes-medicas.json';
a.click();
```

Esto descargará un archivo `backup-ordenes-medicas.json` con todos tus datos.

### Paso 2: Limpiar localStorage (Recomendado)

Para evitar confusiones, limpia los datos antiguos:

1. En la consola del navegador, ejecuta:

```javascript
localStorage.removeItem('users');
localStorage.removeItem('orders');
localStorage.removeItem('admins');
localStorage.removeItem('currentUser');
console.log('✅ Datos antiguos eliminados');
```

O simplemente usa el botón de limpiar almacenamiento en la app (si está disponible).

### Paso 3: Configurar la Base de Datos

Sigue las instrucciones en [DATABASE-SETUP.md](./DATABASE-SETUP.md):

```bash
# 1. Crear base de datos
npx wrangler d1 create medical-orders-db

# 2. Actualizar wrangler.jsonc con el database_id

# 3. Inicializar esquema
npx wrangler d1 execute medical-orders-db --file=./schema.sql
```

### Paso 4: Crear tu cuenta de nuevo

1. Inicia la aplicación: `npm run dev`
2. Haz clic en **"Regístrate aquí"**
3. Crea tu cuenta con tu email y contraseña
4. ¡Listo! Ahora tus datos estarán en la nube

### Paso 5: Recrear tus órdenes (Si es necesario)

Si tenías órdenes importantes en localStorage:

1. Abre el archivo de respaldo `backup-ordenes-medicas.json`
2. Revisa las órdenes que tenías
3. Créalas manualmente en la nueva app

> 💡 **Tip**: Si tienes muchas órdenes, puedes pedir ayuda para crear un script de migración automático.

## 🔐 ¿Qué pasa con los administradores?

### Administrador Principal

El sistema ahora tiene un administrador predefinido:

- **Email**: `loradavid000@gmail.com`
- **Contraseña**: `3008david`

### Otros Administradores

Si tenías otros administradores configurados:

1. Inicia sesión como admin principal
2. Ve a **"Administrar"** → **"Gestión de Usuarios"**
3. Busca a los usuarios que quieres hacer admin
4. Haz clic en **"Hacer Admin"**

## 📊 Comparación: Antes vs Ahora

| Característica | localStorage (Antes) | Base de Datos D1 (Ahora) |
|---------------|---------------------|--------------------------|
| Almacenamiento | Solo navegador | Nube (Cloudflare) |
| Multi-dispositivo | ❌ No | ✅ Sí |
| Persistencia | Se pierde fácil | ✅ Permanente |
| Sincronización | ❌ No | ✅ Tiempo real |
| Respaldos | Manual | ✅ Automático |
| Seguridad | Básica | ✅ Mejorada |
| Usuarios múltiples | Limitado | ✅ Ilimitado |

## 🆘 Problemas Comunes

### "No puedo iniciar sesión con mi cuenta antigua"

**Solución**: Las cuentas de localStorage no existen en la base de datos. Debes:
1. Crear una cuenta nueva
2. O iniciar sesión como admin principal

### "Mis órdenes antiguas no aparecen"

**Solución**: Las órdenes de localStorage no se transfieren automáticamente. Debes:
1. Recrearlas manualmente
2. O usar el respaldo que hiciste en el Paso 1

### "Veo datos antiguos mezclados con nuevos"

**Solución**: Limpia localStorage completamente:
```javascript
localStorage.clear();
location.reload();
```

### "Soy admin pero no tengo permisos"

**Solución**: 
1. Cierra sesión
2. Limpia localStorage
3. Inicia sesión con las credenciales del admin principal
4. Ve a "Administrar" y otorga permisos a tu cuenta

## 💾 Script de Migración Automática (Avanzado)

Si tienes muchos datos y quieres migrarlos automáticamente:

```javascript
// ESTE SCRIPT ES SOLO UN EJEMPLO
// Úsalo bajo tu propio riesgo

async function migrateData() {
  const oldOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  if (!currentUser.id) {
    alert('Por favor inicia sesión primero');
    return;
  }
  
  for (const order of oldOrders) {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          patientName: order.patientName,
          orderType: order.orderType,
          description: order.description,
          priority: order.priority || 'Media'
        })
      });
      
      if (response.ok) {
        console.log('✅ Migrada:', order.patientName);
      } else {
        console.error('❌ Error:', order.patientName);
      }
    } catch (error) {
      console.error('Error migrando orden:', error);
    }
  }
  
  alert('Migración completada. Revisa la consola para detalles.');
}

// Ejecutar migración
migrateData();
```

## ✅ Checklist de Migración

- [ ] Respaldar datos de localStorage (opcional)
- [ ] Limpiar localStorage
- [ ] Configurar base de datos D1
- [ ] Crear cuenta nueva o usar admin principal
- [ ] Recrear órdenes importantes
- [ ] Configurar otros administradores (si aplica)
- [ ] Verificar que todo funciona
- [ ] Eliminar respaldo antiguo (si ya no lo necesitas)

## 🎯 Beneficios de la Migración

Después de migrar, disfrutarás de:

1. **Acceso desde cualquier lugar** 🌐
   - Tu computadora
   - Tu teléfono
   - Tu tablet
   - Cualquier navegador

2. **Datos seguros** 🔒
   - No se pierden al limpiar el navegador
   - Respaldos automáticos
   - Encriptación en tránsito

3. **Colaboración real** 👥
   - Múltiples usuarios al mismo tiempo
   - Ver órdenes de otros (si eres admin)
   - Cambios en tiempo real

4. **Escalabilidad** 📈
   - Miles de órdenes sin problemas
   - Rendimiento optimizado
   - Búsquedas rápidas

## 📞 ¿Necesitas Ayuda?

Si tienes problemas con la migración:

1. Revisa [DATABASE-SETUP.md](./DATABASE-SETUP.md)
2. Consulta [BACKEND-DATABASE-UPDATE.md](./BACKEND-DATABASE-UPDATE.md)
3. Lee la [documentación de Cloudflare D1](https://developers.cloudflare.com/d1/)

## 🎊 ¡Felicitaciones!

Una vez completada la migración, tendrás una aplicación moderna y profesional lista para uso en producción.

¡Bienvenido a la nueva era de tu Administrador de Órdenes Médicas! 🚀
