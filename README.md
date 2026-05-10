# AZento Web

Sitio web corporativo construido con Astro, React y TailwindCSS.

## 🚀 Instalación Rápida (Ubuntu)

**Opción 1: Script automático** (recomendado)

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/web-azento.git
cd web-azento

# Dar permisos y ejecutar script
chmod +x setup-ubuntu.sh
./setup-ubuntu.sh
```

**Opción 2: Instalación manual**

```bash
# 1. Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 2. Instalar pnpm
sudo npm install -g pnpm

# 3. Clonar e instalar
git clone https://github.com/tu-usuario/web-azento.git
cd web-azento
pnpm install
```

## 🧞 Comandos

| Comando           | Acción                                        |
| :---------------- | :-------------------------------------------- |
| `pnpm dev`        | Inicia servidor de desarrollo en `localhost:4321` |
| `pnpm build`      | Construye el sitio para producción en `./dist/` |
| `pnpm preview`    | Previsualiza el build local                   |
| `pnpm start`      | Previsualiza el build local                   |

## 📁 Estructura del Proyecto

```text
/
├── public/
│   └── images/           # Imágenes estáticas
├── src/
│   ├── components/       # Componentes Astro/React
│   ├── data/             # Datos (servicios, etc.)
│   ├── layouts/          # Layouts base
│   └── pages/            # Páginas y rutas
│       ├── api/          # Endpoints API
│       └── servicios/    # Páginas de servicios
└── package.json
```

## ⚙️ Configuración

1. Copia `.env.example` o edita `.env` con tus credenciales
2. Consulta [SETUP.md](SETUP.md) para configurar notificaciones (Email/WhatsApp)

## 📚 Documentación

- [ARSYS_DEPLOY.md](ARSYS_DEPLOY.md) - Despliegue en Arsys
- [SETUP.md](SETUP.md) - Configuración de notificaciones
- [DOCUMENTACION.md](DOCUMENTACION.md) - Documentación técnica
