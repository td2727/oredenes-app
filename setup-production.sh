#!/bin/bash

# Script de configuración automática para producción
# Medical Orders App

echo "🏥 Medical Orders App - Configuración de Producción"
echo "=================================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que wrangler está instalado
if ! command -v wrangler &> /dev/null
then
    echo -e "${RED}❌ Wrangler no está instalado${NC}"
    echo "Instalando wrangler..."
    npm install -g wrangler
fi

echo -e "${GREEN}✓ Wrangler instalado${NC}"
echo ""

# Paso 1: Autenticación
echo -e "${BLUE}Paso 1: Autenticación en Cloudflare${NC}"
echo "Si no estás autenticado, se abrirá tu navegador..."
wrangler whoami || wrangler login
echo ""

# Paso 2: Crear base de datos
echo -e "${BLUE}Paso 2: Creando base de datos D1${NC}"
read -p "¿Crear nueva base de datos? (s/n): " create_db

if [ "$create_db" == "s" ]; then
    echo "Creando base de datos 'medical-orders-db'..."
    wrangler d1 create medical-orders-db
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANTE: Copia el 'database_id' del output anterior${NC}"
    echo -e "${YELLOW}    y pégalo en el archivo wrangler.jsonc${NC}"
    echo ""
    read -p "Presiona Enter cuando hayas actualizado wrangler.jsonc..."
fi

echo ""

# Paso 3: Crear tablas
echo -e "${BLUE}Paso 3: Creando tablas en la base de datos${NC}"
read -p "¿Crear tablas en la base de datos? (s/n): " create_tables

if [ "$create_tables" == "s" ]; then
    echo "Ejecutando schema.sql..."
    wrangler d1 execute medical-orders-db --remote --file=./schema.sql
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Tablas creadas exitosamente${NC}"
    else
        echo -e "${RED}❌ Error al crear tablas${NC}"
        exit 1
    fi
fi

echo ""

# Paso 4: Crear usuario admin
echo -e "${BLUE}Paso 4: Creando usuario administrador${NC}"
read -p "¿Crear usuario admin? (s/n): " create_admin

if [ "$create_admin" == "s" ]; then
    echo "Creando admin: loradavid000@gmail.com..."
    wrangler d1 execute medical-orders-db --remote --file=./create-admin.sql
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Usuario admin creado${NC}"
        echo -e "${YELLOW}⚠️  Email: loradavid000@gmail.com${NC}"
        echo -e "${YELLOW}⚠️  Contraseña: 3008david${NC}"
        echo -e "${RED}⚠️  IMPORTANTE: Cambiar la contraseña después del primer login${NC}"
    else
        echo -e "${RED}❌ Error al crear usuario admin${NC}"
    fi
fi

echo ""

# Paso 5: Build
echo -e "${BLUE}Paso 5: Compilando la aplicación${NC}"
read -p "¿Compilar la app? (s/n): " build_app

if [ "$build_app" == "s" ]; then
    echo "Ejecutando build..."
    npm run build
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ App compilada exitosamente${NC}"
    else
        echo -e "${RED}❌ Error al compilar${NC}"
        exit 1
    fi
fi

echo ""

# Paso 6: Deploy
echo -e "${BLUE}Paso 6: Desplegando a Cloudflare Workers${NC}"
read -p "¿Desplegar ahora? (s/n): " deploy_app

if [ "$deploy_app" == "s" ]; then
    echo "Desplegando..."
    wrangler deploy
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}=================================================="
        echo -e "🎉 ¡App desplegada exitosamente!"
        echo -e "==================================================${NC}"
        echo ""
        echo "Tu app está lista en la URL que aparece arriba ☝️"
        echo ""
        echo -e "${YELLOW}Próximos pasos:${NC}"
        echo "1. Abre la URL en tu navegador"
        echo "2. Inicia sesión con:"
        echo "   Email: loradavid000@gmail.com"
        echo "   Contraseña: 3008david"
        echo "3. CAMBIA LA CONTRASEÑA inmediatamente"
        echo "4. Comparte la URL con tus clientes"
        echo ""
    else
        echo -e "${RED}❌ Error al desplegar${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}Para desplegar manualmente, ejecuta: wrangler deploy${NC}"
fi

echo ""
echo -e "${GREEN}✓ Configuración completada${NC}"
echo ""
