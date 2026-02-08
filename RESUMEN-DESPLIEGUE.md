# 🚀 Resumen Rápido - Desplegar a Producción

## Opción 1: Script Automático (Recomendado) ⚡

### En Mac/Linux:
```bash
./setup-production.sh
```

### En Windows:
```bash
setup-production.bat
```

El script te guiará paso a paso. Solo responde 's' o 'n' a cada pregunta.

---

## Opción 2: Manual (Paso a Paso) 📋

### 1️⃣ Instalar y autenticar Wrangler
```bash
npm install -g wrangler
wrangler login
```

### 2️⃣ Crear base de datos
```bash
wrangler d1 create medical-orders-db
```
**Guarda el `database_id` que te da**

### 3️⃣ Configurar wrangler.jsonc
Abre `wrangler.jsonc` y pega tu `database_id`:
```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "medical-orders-db",
      "database_id": "TU-DATABASE-ID-AQUI"
    }
  ]
}
```

### 4️⃣ Crear tablas
```bash
wrangler d1 execute medical-orders-db --remote --file=./schema.sql
```

### 5️⃣ Crear usuario admin
```bash
wrangler d1 execute medical-orders-db --remote --file=./create-admin.sql
```

### 6️⃣ Compilar
```bash
npm run build
```

### 7️⃣ Desplegar
```bash
wrangler deploy
```

---

## 📱 ¡Listo!

Tu app estará disponible en:
```
https://medical-orders-app.TU-USUARIO.workers.dev
```

### Credenciales de Admin:
- **Email:** loradavid000@gmail.com
- **Contraseña:** 3008david

⚠️ **IMPORTANTE:** Cambia la contraseña después del primer login

---

## 🔄 Actualizar la App

Cuando hagas cambios en el código:

```bash
npm run build
wrangler deploy
```

---

## 📊 Ver Logs

```bash
wrangler tail
```

---

## 💾 Backup de Base de Datos

```bash
# Exportar usuarios
wrangler d1 execute medical-orders-db --remote --command="SELECT * FROM users;" > backup-users.txt

# Exportar órdenes
wrangler d1 execute medical-orders-db --remote --command="SELECT * FROM orders;" > backup-orders.txt
```

---

## 🆘 Problemas Comunes

### "Database not found"
→ Verifica el `database_id` en `wrangler.jsonc`

### "Table already exists"
→ Las tablas ya están creadas, continúa al siguiente paso

### No puedo hacer login
→ Verifica que ejecutaste `create-admin.sql`

### La app no actualiza
→ Ejecuta `wrangler deploy` de nuevo
→ Limpia el caché del navegador (Ctrl + Shift + R)

---

## 📞 Más Información

Lee la guía completa: `GUIA-CONFIGURACION-PRODUCCION.md`

---

## ✅ Checklist

- [ ] Wrangler instalado y autenticado
- [ ] Base de datos creada
- [ ] `database_id` configurado en `wrangler.jsonc`
- [ ] Tablas creadas con `schema.sql`
- [ ] Usuario admin creado
- [ ] App compilada (`npm run build`)
- [ ] App desplegada (`wrangler deploy`)
- [ ] Login funciona correctamente
- [ ] Clientes pueden registrarse
- [ ] Órdenes se crean correctamente

---

¡Tu app de órdenes médicas está lista para producción! 🎉
