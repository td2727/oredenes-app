#!/bin/bash

# Script de configuración de base de datos
# Para el Administrador de Órdenes Médicas

echo "🏥 Configuración de Base de Datos - Órdenes Médicas"
echo "=================================================="
echo ""

# Verificar que wrangler está instalado
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx no está instalado"
    echo "Por favor instala Node.js primero"
    exit 1
fi

echo "📋 Paso 1: Creando base de datos en Cloudflare D1..."
echo ""

# Crear la base de datos
npx wrangler d1 create medical-orders-db

echo ""
echo "⚠️  IMPORTANTE:"
echo "Copia el 'database_id' del output anterior"
echo "y actualiza el archivo wrangler.jsonc"
echo ""
echo "Presiona Enter cuando hayas actualizado wrangler.jsonc..."
read

echo ""
echo "📋 Paso 2: Inicializando esquema de base de datos..."
echo ""

# Aplicar el esquema
npx wrangler d1 execute medical-orders-db --file=./schema.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Base de datos configurada exitosamente!"
    echo ""
    echo "📋 Paso 3: Verificando usuario administrador..."
    echo ""
    
    # Verificar que el admin existe
    npx wrangler d1 execute medical-orders-db --command="SELECT email, name, role FROM users WHERE role='admin'"
    
    echo ""
    echo "🎉 ¡Configuración completada!"
    echo ""
    echo "📝 Credenciales del administrador:"
    echo "   Email: loradavid000@gmail.com"
    echo "   Contraseña: 3008david"
    echo ""
    echo "⚠️  Recuerda cambiar la contraseña en producción"
    echo ""
    echo "🚀 Para iniciar el servidor de desarrollo:"
    echo "   npm run dev"
    echo ""
    echo "📚 Para más información, consulta DATABASE-SETUP.md"
else
    echo ""
    echo "❌ Error al configurar la base de datos"
    echo "Por favor revisa los errores arriba"
    exit 1
fi
