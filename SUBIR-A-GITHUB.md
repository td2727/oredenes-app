# 📤 Cómo Subir el Proyecto a GitHub

## 📥 Paso 1: Descargar el Proyecto

El archivo `medical-orders-app.tar.gz` contiene todo tu proyecto.

### En Windows:
1. Descarga el archivo `medical-orders-app.tar.gz`
2. Usa **WinRAR**, **7-Zip** o **Windows 11** (tiene soporte nativo) para extraerlo
3. Extrae a una carpeta, por ejemplo: `C:\Projects\medical-orders-app`

### En Mac/Linux:
```bash
tar -xzf medical-orders-app.tar.gz -C ~/Projects/medical-orders-app
```

## 🌐 Paso 2: Crear Repositorio en GitHub

1. Ve a: https://github.com/new
2. Nombre del repositorio: `medical-orders-app` (o el que prefieras)
3. Descripción: "Sistema de gestión de órdenes médicas"
4. Elige: **Público** o **Privado** (según prefieras)
5. ❌ **NO marques** "Add a README file" (ya tienes uno)
6. ❌ **NO agregues** .gitignore (ya tienes uno)
7. Clic en "Create repository"

## 💻 Paso 3: Instalar Git (si no lo tienes)

### Windows:
- Descarga desde: https://git-scm.com/download/win
- Instala con las opciones por defecto

### Mac:
```bash
brew install git
```

### Linux:
```bash
sudo apt install git
```

## 🚀 Paso 4: Subir el Proyecto

Abre la terminal/CMD en la carpeta del proyecto y ejecuta:

```bash
# 1. Inicializar Git
git init

# 2. Agregar todos los archivos
git add .

# 3. Hacer el primer commit
git commit -m "🎉 Primer commit - Sistema de órdenes médicas"

# 4. Cambiar la rama a 'main' (GitHub usa 'main' por defecto)
git branch -M main

# 5. Conectar con tu repositorio de GitHub
# Reemplaza 'TU-USUARIO' con tu nombre de usuario de GitHub
git remote add origin https://github.com/TU-USUARIO/medical-orders-app.git

# 6. Subir el código
git push -u origin main
```

### 🔐 Si te pide credenciales:
- **Usuario**: Tu nombre de usuario de GitHub
- **Contraseña**: Usa un **Personal Access Token** (no tu contraseña de GitHub)

#### Crear un Personal Access Token:
1. Ve a: https://github.com/settings/tokens
2. Clic en "Generate new token (classic)"
3. Nombre: "Medical Orders App"
4. Marca el scope: **repo** (todos los permisos de repositorio)
5. Clic en "Generate token"
6. **COPIA EL TOKEN** (no lo volverás a ver)
7. Usa este token como contraseña cuando Git te lo pida

## ✅ Paso 5: Verificar

1. Ve a tu repositorio en GitHub
2. Deberías ver todos los archivos del proyecto
3. El README.md se mostrará automáticamente en la página principal

## 📝 Comandos Git Útiles para el Futuro

```bash
# Ver el estado de tus archivos
git status

# Agregar cambios
git add .

# Hacer commit de cambios
git commit -m "Descripción de los cambios"

# Subir cambios a GitHub
git push

# Ver el historial de commits
git log

# Crear una nueva rama
git checkout -b nombre-rama

# Cambiar de rama
git checkout main

# Ver las ramas
git branch
```

## 🔄 Actualizar el Repositorio Después

Cuando hagas cambios en el futuro:

```bash
git add .
git commit -m "Descripción de lo que cambiaste"
git push
```

## 🌟 Hacer el Proyecto Público (Opcional)

Si quieres que otros vean tu proyecto:

1. Ve a tu repositorio en GitHub
2. Settings → General
3. Scroll hasta "Danger Zone"
4. "Change repository visibility" → Make public

## 📱 Agregar Badges al README (Opcional)

Puedes agregar badges bonitos a tu README:

```markdown
![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?logo=astro)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwind-css)
```

## 🎉 ¡Listo!

Tu proyecto ya está en GitHub. Ahora puedes:
- ✅ Compartir el link con otros
- ✅ Trabajar desde diferentes computadoras
- ✅ Hacer backups automáticos
- ✅ Colaborar con otros desarrolladores
- ✅ Mostrar tu trabajo en tu portafolio

---

**¿Problemas?** Revisa estos recursos:
- [GitHub Docs](https://docs.github.com/)
- [Git Book](https://git-scm.com/book/es/v2)
- [GitHub Desktop](https://desktop.github.com/) - Si prefieres una interfaz gráfica

**¡Tu proyecto está listo para el mundo! 🚀**
