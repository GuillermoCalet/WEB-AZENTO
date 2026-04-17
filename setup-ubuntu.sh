#!/bin/bash

# ===========================================
# Script de instalación para AZento Web
# Compatible con Ubuntu 20.04+
# ===========================================

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sin color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════╗"
echo "║     🚀 AZento Web - Setup Ubuntu          ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 1. Actualizar sistema
echo -e "${YELLOW}📦 Actualizando sistema...${NC}"
sudo apt update && sudo apt upgrade -y

# 2. Instalar curl y git si no están
echo -e "${YELLOW}📦 Instalando dependencias del sistema...${NC}"
sudo apt install -y curl git build-essential

# 3. Instalar Node.js (v20 LTS)
if command_exists node; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js ya instalado: ${NODE_VERSION}${NC}"
else
    echo -e "${YELLOW}📦 Instalando Node.js v20 LTS...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    echo -e "${GREEN}✅ Node.js instalado: $(node -v)${NC}"
fi

# 4. Instalar pnpm
if command_exists pnpm; then
    PNPM_VERSION=$(pnpm -v)
    echo -e "${GREEN}✅ pnpm ya instalado: ${PNPM_VERSION}${NC}"
else
    echo -e "${YELLOW}📦 Instalando pnpm...${NC}"
    sudo npm install -g pnpm
    echo -e "${GREEN}✅ pnpm instalado: $(pnpm -v)${NC}"
fi

# 5. Instalar dependencias del proyecto
echo -e "${YELLOW}📦 Instalando dependencias del proyecto...${NC}"
pnpm install

# 6. Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}📄 Creando archivo .env de ejemplo...${NC}"
    cat > .env << 'EOF'
# ===================================
# Configuración de Email (Gmail SMTP)
# ===================================
GMAIL_USER=tu-email@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx

# ===================================
# Configuración de Twilio (WhatsApp)
# ===================================
TWILIO_ACCOUNT_SID=tu-account-sid
TWILIO_AUTH_TOKEN=tu-auth-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+34XXXXXXXXX

# ===================================
# Email de destino para notificaciones
# ===================================
NOTIFICATION_EMAIL=tu-email-notificaciones@gmail.com
EOF
    echo -e "${GREEN}✅ Archivo .env creado. Edítalo con tus credenciales.${NC}"
else
    echo -e "${GREEN}✅ Archivo .env ya existe${NC}"
fi

# Resumen final
echo ""
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════╗"
echo "║     ✅ Instalación completada             ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${BLUE}Próximos pasos:${NC}"
echo "  1. Edita el archivo .env con tus credenciales"
echo "  2. Ejecuta: pnpm dev"
echo "  3. Abre: http://localhost:4321"
echo ""
echo -e "${YELLOW}Comandos útiles:${NC}"
echo "  pnpm dev      → Servidor de desarrollo"
echo "  pnpm build    → Construir para producción"
echo "  pnpm preview  → Previsualizar build"
echo ""
