# Entorno de Desarrollo - Sistema Web DII

Este directorio contiene el entorno de desarrollo local para el portal del Departamento de Ingeniería Industrial (DII). Está configurado con Docker Compose para facilitar el *Hot Reloading* (HMR) y la sincronización en tiempo real entre el código fuente y los contenedores.

## 🚀 Inicio Rápido

Para levantar el entorno de desarrollo completo, sigue estos pasos:

1. Duplica el archivo `.env.example` y renómbralo a `.env` en la carpeta backend.
2. Completa las variables de entorno necesarias (claves JWT, credenciales SMTP para 2FA, etc.).
3. Levanta los contenedores ejecutando:

```bash
docker compose up --build
```

Esto iniciará los servicios en modo interactivo:
- **Frontend** (Vite/React): `http://localhost:5173`
- **Backend** (Node.js): `http://localhost:3000`
- **Postgres**: `localhost:5432`

---

## Estructura del Proyecto

```text
development/
├── backend/            # API REST (Node.js/Express)
│   ├── src/
│   │   ├── controllers/# Lógica de negocio (Thin Controllers)
│   │   ├── models/     # Consultas a BD y Túneles Binarios (BYTEA)
│   │   └── services/   # Servicios externos (ej. emailService para 2FA)
│   └── .env            # Secretos
│   └── .env.exaample   # Plantilla de variables de entorno requeridas
├── frontend/           # App SPA (React + Vite)
│   ├── src/            # Código fuente UI y Contexto de Autenticación
│   ├── public/         # Archivos estáticos
│   └── vite.config.js  # Configuración de compilación
│   └── .env            # Variables Publicas
│   └── .env.example    # Plantilla de variables de entorno requeridas
├── postgres_data/      # Volumen local: Base de datos persistente
└── docker-compose.yml  # Configuración de orquestación local
```
---
---
---

## Configuración Docker

### Frontend (Desarrollo)
- El contenedor monta el volumen local `./frontend` hacia `/app`.
- Esto permite que cualquier cambio que hagas en el código de React se refleje automáticamente (**HMR**) sin reiniciar Docker.
- Usa el puerto `5173`.

### Backend (Desarrollo)
- Monta `./backend` hacia `/app`.
- Depende del servicio `postgres`.
- Conectado a la red `dev-net`.

### Base de Datos
- **Postgres**: Imagen versión 16.
- Los datos se guardan en la carpeta local `./postgres_data` para que no se pierdan al apagar los contenedores.

---

## Proceso de Build (Producción)

Si deseas generar los archivos para llevar a producción (`Deployment`), debes generar el build del frontend:

1. Entra a la carpeta frontend:
   ```bash
   cd frontend
   ```
2. Ejecuta el build:
   ```bash
   npm run build
   ```
3. Los archivos se generarán en la carpeta `../dist/`.

> [!NOTE]
> La carpeta `dist` resultante es la que debe copiarse a la carpeta de `Deployment` para la puesta en marcha final.

---

## Notas Adicionales

- **Variables de Entorno Cruciales:** El backend no levantará si faltan las variables de entorno para JWT y el servicio SMTP (necesario para el 2FA). Revisa el archivo .env.example para conocer las llaves obligatorias. Nunca subas tu archivo .env real al repositorio para evitar incidentes de seguridad en GitGuardian.

- **Limpieza de Base de Datos:** Si deseas resetear el sistema a su estado de fábrica (borrando todos los usuarios y proyectos de prueba), simplemente elimina la carpeta postgres_data de tu máquina local y vuelve a ejecutar docker compose up. Docker creará una base de datos en blanco y ejecutará los scripts de inicialización.

- **Peticiones a la API:** El frontend en entorno de desarrollo está configurado para usar http://localhost:3000 como base para todas las llamadas al backend mediante la variable VITE_API_URL.

