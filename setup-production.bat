@echo off
setlocal enabledelayedexpansion

:: Script de configuración automática para producción
:: Medical Orders App

echo ========================================
echo Medical Orders App - Configuracion
echo ========================================
echo.

:: Verificar que wrangler está instalado
where wrangler >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Wrangler no esta instalado
    echo Instalando wrangler...
    call npm install -g wrangler
)

echo [OK] Wrangler instalado
echo.

:: Paso 1: Autenticación
echo Paso 1: Autenticacion en Cloudflare
echo Si no estas autenticado, se abrira tu navegador...
call wrangler whoami || call wrangler login
echo.

:: Paso 2: Crear base de datos
echo Paso 2: Creando base de datos D1
set /p create_db="Crear nueva base de datos? (s/n): "

if /i "%create_db%"=="s" (
    echo Creando base de datos 'medical-orders-db'...
    call wrangler d1 create medical-orders-db
    echo.
    echo [IMPORTANTE] Copia el 'database_id' del output anterior
    echo              y pegalo en el archivo wrangler.jsonc
    echo.
    pause
)

echo.

:: Paso 3: Crear tablas
echo Paso 3: Creando tablas en la base de datos
set /p create_tables="Crear tablas en la base de datos? (s/n): "

if /i "%create_tables%"=="s" (
    echo Ejecutando schema.sql...
    call wrangler d1 execute medical-orders-db --remote --file=./schema.sql
    if !ERRORLEVEL! EQU 0 (
        echo [OK] Tablas creadas exitosamente
    ) else (
        echo [ERROR] Error al crear tablas
        exit /b 1
    )
)

echo.

:: Paso 4: Crear usuario admin
echo Paso 4: Creando usuario administrador
set /p create_admin="Crear usuario admin? (s/n): "

if /i "%create_admin%"=="s" (
    echo Creando admin: loradavid000@gmail.com...
    call wrangler d1 execute medical-orders-db --remote --file=./create-admin.sql
    if !ERRORLEVEL! EQU 0 (
        echo [OK] Usuario admin creado
        echo [INFO] Email: loradavid000@gmail.com
        echo [INFO] Contraseña: 3008david
        echo [IMPORTANTE] Cambiar la contraseña despues del primer login
    ) else (
        echo [ERROR] Error al crear usuario admin
    )
)

echo.

:: Paso 5: Build
echo Paso 5: Compilando la aplicacion
set /p build_app="Compilar la app? (s/n): "

if /i "%build_app%"=="s" (
    echo Ejecutando build...
    call npm run build
    if !ERRORLEVEL! EQU 0 (
        echo [OK] App compilada exitosamente
    ) else (
        echo [ERROR] Error al compilar
        exit /b 1
    )
)

echo.

:: Paso 6: Deploy
echo Paso 6: Desplegando a Cloudflare Workers
set /p deploy_app="Desplegar ahora? (s/n): "

if /i "%deploy_app%"=="s" (
    echo Desplegando...
    call wrangler deploy
    if !ERRORLEVEL! EQU 0 (
        echo.
        echo ==========================================
        echo App desplegada exitosamente!
        echo ==========================================
        echo.
        echo Tu app esta lista en la URL que aparece arriba
        echo.
        echo Proximos pasos:
        echo 1. Abre la URL en tu navegador
        echo 2. Inicia sesion con:
        echo    Email: loradavid000@gmail.com
        echo    Contraseña: 3008david
        echo 3. CAMBIA LA CONTRASEÑA inmediatamente
        echo 4. Comparte la URL con tus clientes
        echo.
    ) else (
        echo [ERROR] Error al desplegar
        exit /b 1
    )
) else (
    echo Para desplegar manualmente, ejecuta: wrangler deploy
)

echo.
echo [OK] Configuracion completada
echo.
pause
