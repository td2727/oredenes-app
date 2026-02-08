# 👥 Gestión de Administradores

Guía completa para gestionar administradores en tu aplicación de órdenes médicas.

---

## ✨ Nuevas Características

### ✅ Removido
- ❌ Recuadro azul con credenciales de prueba en el login (ya no aparece)

### ✅ Agregado
- ➕ **Formulario para agregar administradores** directamente desde el panel
- 🎯 **Creación rápida** de nuevos admins con email, nombre y contraseña
- 🔐 **Asignación automática** de rol de administrador

---

## 🎯 Cómo Funciona

### 1. Acceder al Panel de Administración

Como administrador, verás una pestaña "Gestión" en la app principal:

1. Inicia sesión como admin
2. Haz clic en la pestaña **"Gestión"**
3. Verás el panel de administración completo

---

## ➕ Agregar Nuevo Administrador

### Opción 1: Desde el Panel (Nuevo) ⭐

En la sección morada **"Agregar Nuevo Administrador"**:

1. **Nombre Completo**: Ingresa el nombre (Ej: Dr. Juan Pérez)
2. **Email**: Ingresa el correo electrónico
3. **Contraseña**: Mínimo 6 caracteres
4. Haz clic en **"Agregar Administrador"**

✅ El usuario se creará automáticamente con permisos de administrador

```
┌─────────────────────────────────────────────┐
│  ➕ Agregar Nuevo Administrador             │
├─────────────────────────────────────────────┤
│  Nombre: [Dr. Juan Pérez          ]        │
│  Email:  [juan@hospital.com       ]        │
│  Password: [••••••••              ]        │
│                                             │
│  [🛡️ Agregar Administrador]                │
└─────────────────────────────────────────────┘
```

### Opción 2: Promover Usuario Existente

Si un usuario ya está registrado:

1. Busca al usuario en la lista
2. Haz clic en **"Hacer Admin"** (botón azul con escudo)
3. Confirma la acción

---

## 👥 Gestión de Usuarios Existentes

### Ver Lista de Usuarios

El panel muestra:
- 📊 **Estadísticas**: Total, Admins, Usuarios normales
- 📋 **Lista completa** con nombre, email, rol, fecha de registro

### Cambiar Roles

**Hacer Administrador:**
```
Usuario Normal → Clic en "Hacer Admin" → Confirmar → Admin
```

**Quitar Admin:**
```
Admin → Clic en "Quitar Admin" → Confirmar → Usuario Normal
```

### Eliminar Usuarios

**⚠️ CUIDADO**: Esta acción es permanente

1. Localiza al usuario
2. Haz clic en el ícono de basura 🗑️
3. Confirma la eliminación

**Nota:** No puedes eliminar tu propia cuenta.

---

## 🔐 Seguridad y Mejores Prácticas

### Contraseñas

- **Mínimo 6 caracteres** (recomendado: 12+)
- Usa combinación de letras, números y símbolos
- Instruye a los nuevos admins a cambiar su contraseña

### Recomendaciones

✅ **Hacer:**
- Usar emails corporativos (@hospital.com, @clinica.com)
- Crear contraseñas únicas para cada admin
- Revisar regularmente la lista de administradores
- Remover acceso a empleados que ya no trabajan

❌ **No hacer:**
- Compartir credenciales de admin
- Usar contraseñas simples (123456, password, etc.)
- Dar permisos de admin innecesariamente
- Dejar cuentas inactivas

---

## 📊 Roles y Permisos

### Administrador (Admin)

✅ **Puede:**
- Ver **todas** las órdenes de todos los usuarios
- Cambiar estado de **cualquier** orden
- Eliminar **cualquier** orden
- Ver lista de **todos** los usuarios
- Promover/degradar usuarios
- Agregar nuevos administradores
- Eliminar usuarios

### Usuario Normal (User)

✅ **Puede:**
- Ver **solo sus propias** órdenes
- Crear nuevas órdenes
- Cambiar estado de **sus propias** órdenes

❌ **No puede:**
- Ver órdenes de otros usuarios
- Acceder al panel de administración
- Cambiar roles
- Eliminar otros usuarios

---

## 🎯 Casos de Uso

### Caso 1: Nueva Clínica

**Situación:** Acabas de desplegar la app para una clínica nueva

**Pasos:**
1. Inicia sesión con el admin principal (loradavid000@gmail.com)
2. Ve a "Gestión"
3. Agrega los administradores de la clínica:
   - Director médico
   - Jefe de radiología
   - Administrador de sistema
4. Comparte credenciales de forma segura

### Caso 2: Nuevo Empleado Admin

**Situación:** Contratan a un nuevo jefe de departamento que necesita acceso admin

**Opción A - Crear directamente:**
```
1. Panel de Gestión
2. Agregar Nuevo Administrador
3. Llenar datos del nuevo empleado
4. Enviar credenciales de forma segura
```

**Opción B - Promover existente:**
```
1. El empleado se registra como usuario normal
2. Admin va a Panel de Gestión
3. Busca al usuario en la lista
4. Clic en "Hacer Admin"
```

### Caso 3: Empleado Deja la Empresa

**Situación:** Un administrador ya no trabaja en la clínica

**Pasos:**
1. Ve a Panel de Gestión
2. Localiza al usuario
3. **Opción A:** Degradar a usuario normal (mantiene acceso limitado)
4. **Opción B:** Eliminar completamente (pierde todo acceso)

### Caso 4: Múltiples Administradores

**Situación:** Tienes varios departamentos que necesitan sus propios admins

**Estructura recomendada:**
```
🏥 Hospital Principal
├── 👤 Admin Principal (Super Admin)
│   └── Email: director@hospital.com
├── 👤 Radiología
│   └── Email: jefe.radiologia@hospital.com
├── 👤 Ortodoncia
│   └── Email: jefe.ortodoncia@hospital.com
└── 👤 Administración
    └── Email: admin.sistemas@hospital.com
```

Todos con permisos de admin, pueden ver todas las órdenes de sus departamentos.

---

## 🔄 Flujo Completo de Gestión

### Flujo: Agregar Nuevo Admin

```
┌──────────────┐
│ Login Admin  │
└──────┬───────┘
       │
       v
┌──────────────┐
│ Clic "Gestión"│
└──────┬───────┘
       │
       v
┌──────────────────────────┐
│ "Agregar Nuevo Admin"    │
│ - Nombre: Dr. Pérez      │
│ - Email: perez@mail.com  │
│ - Password: ********     │
└──────┬───────────────────┘
       │
       v
┌──────────────────────┐
│ Clic "Agregar Admin" │
└──────┬───────────────┘
       │
       v
┌──────────────────────┐
│ ✅ Admin Creado      │
│ Aparece en la lista  │
└──────────────────────┘
```

### Flujo: Promover Usuario

```
┌──────────────┐
│ Usuario se   │
│ registra     │
└──────┬───────┘
       │
       v
┌──────────────┐
│ Admin ve     │
│ lista        │
└──────┬───────┘
       │
       v
┌──────────────────┐
│ Clic "Hacer      │
│ Admin"           │
└──────┬───────────┘
       │
       v
┌──────────────────┐
│ Confirmar        │
└──────┬───────────┘
       │
       v
┌──────────────────┐
│ ✅ Usuario       │
│ ahora es Admin   │
└──────────────────┘
```

---

## 📋 API Endpoints Usados

### POST `/api/auth/register`
Crea un nuevo usuario (usado internamente al agregar admin)

### PATCH `/api/admin/users/:id/role`
Cambia el rol de un usuario (user ↔️ admin)

### DELETE `/api/admin/users/:id`
Elimina un usuario completamente

### GET `/api/admin/users`
Obtiene lista de todos los usuarios

---

## 🆘 Solución de Problemas

### Error: "El email ya está registrado"

**Solución:**
- El email ya existe en el sistema
- Si necesitas que sea admin, búscalo en la lista y presiónale "Hacer Admin"
- Si necesitas recrearlo, primero elimínalo y luego créalo de nuevo

### Error: "Usuario creado pero no se pudo hacer admin"

**Solución:**
- El usuario se creó correctamente como usuario normal
- Ve a la lista de usuarios
- Encuentra al usuario
- Haz clic en "Hacer Admin" manualmente

### No veo el botón "Agregar Administrador"

**Solución:**
- Verifica que iniciaste sesión como administrador
- Solo los admins pueden ver el panel de gestión
- Cierra sesión y vuelve a iniciar con credenciales de admin

### Eliminé a un admin por error

**Solución:**
- Si tienes backup de la base de datos, puedes restaurar
- Si no, créalo de nuevo con el formulario
- La nueva cuenta será independiente de la anterior

---

## ✅ Checklist de Gestión

### Setup Inicial
- [ ] Admin principal tiene acceso
- [ ] Contraseña del admin principal cambiada
- [ ] Lista de admins necesarios identificada
- [ ] Emails corporativos preparados

### Agregar Administradores
- [ ] Usar formulario "Agregar Nuevo Administrador"
- [ ] Usar contraseñas seguras
- [ ] Enviar credenciales de forma segura (no por email plano)
- [ ] Instruir a cambiar contraseña en primer login

### Mantenimiento Regular
- [ ] Revisar lista de admins mensualmente
- [ ] Remover acceso a empleados que dejaron la empresa
- [ ] Verificar que no hay cuentas duplicadas
- [ ] Hacer backup de la base de datos

---

## 🎓 Mejores Prácticas

### Organización

**Nombrar usuarios consistentemente:**
```
✅ Bueno:
- Dr. Juan Pérez
- Dra. María González
- Admin - Pedro López

❌ Malo:
- juan
- maria g
- pedro123
```

**Usar emails corporativos:**
```
✅ Bueno:
- juan.perez@hospital.com
- maria.gonzalez@clinica.com

❌ Malo:
- juanito123@gmail.com
- mary_g@hotmail.com
```

### Seguridad

**Contraseñas iniciales:**
- Genera contraseñas aleatorias seguras
- Envíalas por canal seguro (SMS, WhatsApp cifrado, en persona)
- Instruye a cambiarla inmediatamente

**Auditoría:**
- Mantén registro de quién tiene acceso admin
- Revisa logs de actividad regularmente
- Remueve acceso cuando sea necesario

---

## 📞 Soporte

Si tienes problemas:
1. Revisa esta guía
2. Consulta [FAQ-BACKEND.md](./FAQ-BACKEND.md)
3. Contacto: loradavid000@gmail.com

---

¡Sistema de gestión de administradores listo! 🎉
