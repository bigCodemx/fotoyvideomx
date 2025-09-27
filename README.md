# fotoyvideomx

Proyecto Node.js con API REST para subir y compartir fotos/videos por cliente.

Pasos rápidos:

1. Copia `.env.example` a `.env` y ajusta las variables.
2. Instala dependencias: `npm install`.
3. Crea la base de datos: ejecuta el SQL en `models/init.sql` (por ejemplo usando mysql client).
4. Crea un admin: `node scripts/create_admin.js admin password`.
5. Inicia: `npm run dev` o `npm start`.

Rutas principales:
- `/api/auth/login` POST {username,password} -> token
- `/api/admin/clients` POST (JWT) -> crear cliente
- `/api/admin/upload` POST (JWT) -> subir archivos (form-data: code, files[])
- `/api/clientes/:code` GET -> información del cliente y archivos
- `/api/clientes/:code/download` GET -> zip de todos los archivos

Páginas públicas en `/public`: `admin.html`, `clientes.html`.
