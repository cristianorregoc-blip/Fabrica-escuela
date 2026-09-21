# Fabrica-escuela

## Integracion local

El frontend usa `VITE_API_BASE_URL` para apuntar al backend Spring Boot. La configuracion local no versionada esta en `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

`.env.example` contiene el valor de referencia sin secretos. Las solicitudes autenticadas envian la cookie `AUTH_SESSION` con `credentials: 'include'`; el frontend no guarda sesiones, contrasenas, tokens ni datos de tarjeta en almacenamiento del navegador.

Para el despliegue, configurar en Vercel `VITE_API_BASE_URL=https://<servicio-backend-en-render>.onrender.com` cuando exista la URL real. En Render, mantener las variables del backend fuera del frontend, incluyendo `AUTH_COOKIE_SECURE=true`, el origen exacto de Vercel, las variables de base de datos y las variables de pagos. El backend debe permitir el origen local exacto (`http://localhost:5173` o el puerto usado por Vite), `Access-Control-Allow-Credentials: true` y, posteriormente, el dominio real de Vercel. No usar `*` con credenciales.

## Verificacion

```text
npm run build
npx tsc --noEmit
```

El servidor de desarrollo de Figma Make usa el puerto definido por `PORT` (por defecto `8443`). Para una prueba local convencional puede ejecutarse `npm run dev -- --host 0.0.0.0`.