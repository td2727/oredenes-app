# Configuración del Administrador Principal

## 📋 Resumen

El sistema ahora incluye una gestión completa de administradores con las siguientes características:

- ✅ **Admin Principal**: Un administrador que no puede ser eliminado
- ✅ **Agregar Admins**: Los administradores pueden agregar otros administradores
- ✅ **Eliminar Admins**: Los administradores pueden eliminar otros admins (excepto el principal y a sí mismos)
- ✅ **Pantalla de Login Limpia**: Ya no muestra credenciales de prueba

---

## 🔧 Configurar Tu Admin Principal

### Paso 1: Abrir el archivo de configuración

Abre el archivo: `src/config/admin.ts`

### Paso 2: Cambiar tus datos

Reemplaza los valores por defecto con tu información:

```typescript
export const MAIN_ADMIN_CONFIG = {
  // Tu correo electrónico
  email: 'tuemail@ejemplo.com',
  
  // Tu contraseña segura
  password: 'TuContraseñaSegura123!',
  
  // Tu nombre completo
  name: 'Tu Nombre Completo'
};
```

**Ejemplo real:**

```typescript
export const MAIN_ADMIN_CONFIG = {
  email: 'doctor.perez@clinica.com',
  password: 'Medicina2024!Segura',
  name: 'Dr. Juan Pérez'
};
```

### Paso 3: Guardar y reiniciar

1. Guarda el archivo
2. Si la aplicación está corriendo, reiníciala:
   ```bash
   npm run dev
   ```
3. ⚠️ **IMPORTANTE**: Si ya tienes datos en localStorage, debes limpiarlos para que se cree el nuevo admin:
   - Abre las herramientas de desarrollador del navegador (F12)
   - Ve a la pestaña "Application" o "Almacenamiento"
   - Limpia "Local Storage"
   - Recarga la página

---

## 🎯 Uso del Sistema

### Iniciar Sesión como Admin Principal

1. Ve a la página de login
2. Ingresa tu email y contraseña configurados
3. Haz clic en "Iniciar Sesión"

### Agregar Nuevos Administradores

1. Inicia sesión como administrador
2. Haz clic en el botón "Administradores" en la navegación
3. Haz clic en "Agregar Admin"
4. Completa el formulario:
   - Nombre completo del nuevo admin
   - Correo electrónico
   - Contraseña (mínimo 6 caracteres)
5. Haz clic en "Agregar Administrador"

### Ver Administradores

En la sección "Administradores" verás:

- **Badge "Principal"**: El administrador principal (no puede ser eliminado)
- **Badge "Tú"**: Tu cuenta actual
- **Botón de Eliminar**: Solo aparece para admins que no son el principal ni tú mismo

### Eliminar Administradores

1. Ve a la sección "Administradores"
2. Encuentra el administrador que quieres eliminar
3. Haz clic en el icono de basura (🗑️)
4. Confirma la eliminación

**Restricciones:**
- ❌ No puedes eliminar al administrador principal
- ❌ No puedes eliminarte a ti mismo
- ✅ Puedes eliminar cualquier otro administrador

---

## 🔐 Seguridad

### Recomendaciones para Producción

⚠️ **El sistema actual usa localStorage y es solo para demostración.**

Para un sistema real con datos médicos **DEBES**:

1. **Implementar un backend real**:
   - Node.js + Express o similar
   - Base de datos (PostgreSQL, MySQL, MongoDB)

2. **Hashear contraseñas**:
   ```bash
   npm install bcrypt
   ```
   ```typescript
   import bcrypt from 'bcrypt';
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

3. **Usar autenticación JWT o sesiones**:
   ```bash
   npm install jsonwebtoken
   ```

4. **HTTPS obligatorio**:
   - Certificado SSL/TLS
   - Forzar conexiones seguras

5. **Cumplimiento HIPAA** (para datos médicos):
   - Auditoría de accesos
   - Encriptación de datos
   - Respaldos seguros
   - Políticas de privacidad

---

## 🚀 Características del Sistema de Admins

### Permisos de Administrador

Los administradores pueden:
- ✅ Ver todas las órdenes de todos los usuarios
- ✅ Crear órdenes para cualquier usuario
- ✅ Editar el estado de las órdenes
- ✅ Eliminar órdenes
- ✅ Agregar nuevos administradores
- ✅ Eliminar administradores (excepto el principal)

### Permisos de Usuario Regular

Los usuarios regulares pueden:
- ✅ Ver solo sus propias órdenes
- ✅ Crear nuevas órdenes
- ❌ No pueden ver órdenes de otros usuarios
- ❌ No pueden agregar administradores

---

## 📱 Navegación

### Para Administradores

El menú de navegación muestra:
1. **Mis Órdenes** - Ver todas las órdenes del sistema
2. **Nueva Orden** - Crear una nueva orden médica
3. **Administradores** - Gestionar administradores del sistema

### Para Usuarios

El menú de navegación muestra:
1. **Mis Órdenes** - Ver solo tus órdenes
2. **Nueva Orden** - Crear una nueva orden médica

---

## 🛠️ Solución de Problemas

### No puedo iniciar sesión con mis nuevas credenciales

**Solución**: Limpia el localStorage del navegador:

1. Presiona F12 para abrir las herramientas de desarrollador
2. Ve a "Application" → "Local Storage"
3. Elimina todas las entradas
4. Recarga la página

### Olvidé mi contraseña de admin

**Solución**: Como usa localStorage, puedes restablecerla:

1. Abre las herramientas de desarrollador (F12)
2. Ve a la consola
3. Ejecuta:
   ```javascript
   localStorage.clear()
   ```
4. Recarga la página
5. El sistema creará el admin con las credenciales del archivo `src/config/admin.ts`

### No aparece el botón "Administradores"

**Causa**: No has iniciado sesión como administrador.

**Solución**: Asegúrate de usar las credenciales configuradas en `src/config/admin.ts`

---

## 📋 Checklist de Configuración

Antes de usar en producción, verifica:

- [ ] Configuré mi email en `src/config/admin.ts`
- [ ] Configuré una contraseña segura en `src/config/admin.ts`
- [ ] Configuré mi nombre en `src/config/admin.ts`
- [ ] Limpié el localStorage si tenía datos anteriores
- [ ] Puedo iniciar sesión con mis nuevas credenciales
- [ ] Puedo agregar nuevos administradores
- [ ] La pantalla de login no muestra credenciales de prueba

---

## 🎓 Próximos Pasos

1. **Personaliza tu correo**: Edita `src/config/admin.ts`
2. **Prueba el sistema**: Inicia sesión y agrega un admin de prueba
3. **Implementa backend**: Para producción, migra a un backend real
4. **Despliega**: Sigue las instrucciones en `DEPLOYMENT.md`

---

## 📞 Estructura de Archivos Relacionados

```
src/
├── config/
│   └── admin.ts              ← Configuración del admin principal
├── lib/
│   └── auth.ts               ← Lógica de autenticación
├── components/
│   ├── LoginForm.tsx         ← Formulario de login (sin credenciales de prueba)
│   ├── AdminManagement.tsx   ← Gestión de administradores
│   └── MedicalOrdersApp.tsx  ← App principal con navegación
└── types/
    └── order.ts              ← Tipos de datos
```

---

**¡Tu sistema está listo! Configura tu admin principal y comienza a usar la aplicación.** 🎉
