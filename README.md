# Pizzeria Napoles - Entrega final Backend

Repositorio del proyecto: https://github.com/MaxiCalamante/e-commerce-Pizzeria-Napoles

Imagen DockerHub: https://hub.docker.com/r/calamaxi/e-commerce-pizzeria-napoles

Tag usado para la entrega:

```bash
calamaxi/e-commerce-pizzeria-napoles:1.0.0
```

## Descripcion

Este proyecto contiene el e-commerce de Pizzeria Napoles y el backend usado para la entrega final. Para esta entrega se agrego el router `adoption.router.js`, tests funcionales para todos sus endpoints, Dockerfile optimizado y documentacion para reproducir la ejecucion.

## Estructura del proyecto

```txt
e-commerce-Pizzeria-Napoles/
|-- Dockerfile
|-- .dockerignore
|-- README.md
|-- backend/
|   |-- config/
|   |   `-- db.js
|   |-- controllers/
|   |   |-- auth.controller.js
|   |   `-- session.controller.js
|   |-- middlewares/
|   |   `-- auth.js
|   |-- models/
|   |   |-- Cart.js
|   |   `-- User.js
|   |-- routes/
|   |   |-- adoption.router.js
|   |   |-- auth.routes.js
|   |   `-- session.routes.js
|   |-- services/
|   |   `-- adoption.service.js
|   |-- strategies/
|   |   `-- passport.js
|   |-- tests/
|   |   `-- adoption.router.test.js
|   |-- package.json
|   |-- package-lock.json
|   `-- server.js
|-- src/
|   |-- components/
|   |-- context/
|   |-- data/
|   |-- services/
|   |-- App.jsx
|   |-- main.jsx
|   `-- index.css
|-- package.json
`-- package-lock.json
```

Carpetas principales:

- `backend/routes`: rutas de Express. Ahi esta `adoption.router.js`.
- `backend/services`: logica aislada para adopciones. El router recibe el service por inyeccion para poder testear con fakes.
- `backend/tests`: tests funcionales del router de adopciones.
- `backend/server.js`: inicializa Express, Mongo, sesiones, auth y monta `/api/adoptions`.
- `src`: frontend React del e-commerce.
- `Dockerfile`: imagen de backend para ejecutar la API.

## Endpoints de adopciones

Base URL local:

```bash
http://localhost:8080/api/adoptions
```

Endpoints cubiertos:

```txt
GET  /api/adoptions
GET  /api/adoptions/:aid
POST /api/adoptions/:uid/:pid
```

## Tests funcionales

Los tests estan en:

```txt
backend/tests/adoption.router.test.js
```

Se usa el test runner nativo de Node.js (`node:test`) y una app Express real levantada en un puerto temporal. Las dependencias externas se aislan usando un fake service inyectado en `createAdoptionRouter(service)`.

Casos cubiertos:

- `GET /api/adoptions`: exito y error 500 del service.
- `GET /api/adoptions/:aid`: exito, id invalido, adopcion inexistente y error 500.
- `POST /api/adoptions/:uid/:pid`: creacion exitosa, parametros invalidos, usuario inexistente, mascota inexistente, mascota ya adoptada y error 500.

Ejecutar tests:

```bash
cd backend
npm ci
npm test
```

Evidencia de ejecucion:

```txt
# tests 12
# suites 1
# pass 12
# fail 0
# cancelled 0
# skipped 0
# todo 0

# routes/adoption.router.js
# line %: 100.00
# branch %: 100.00
# funcs %: 100.00
```

## Dockerizacion

El Dockerfile esta en la raiz del proyecto.

Decisiones de optimizacion:

- Imagen base `node:22-slim`, compatible con las dependencias actuales del backend.
- Build en dos etapas para separar instalacion de dependencias y runtime.
- `npm ci --omit=dev` para instalar solo dependencias de produccion.
- `PUPPETEER_SKIP_DOWNLOAD=true` y `puppeteer` en `devDependencies`, para no incluir Chromium en la imagen final.
- `.dockerignore` para excluir frontend, imagenes, PDF, `node_modules`, logs y archivos locales.
- Usuario no root (`nodeapp`) para ejecutar la aplicacion.
- `COPY --chown` en vez de `chown -R`, reduciendo capas lentas.
- `HEALTHCHECK` contra `/health`.
- Instalacion minima de `ca-certificates` y `libcurl4`, necesarias para que `mongodb-memory-server` pueda iniciar en Debian slim cuando no se pasa `MONGO_URI`.

Construir la imagen:

```bash
docker build -t calamaxi/e-commerce-pizzeria-napoles:1.0.0 -t calamaxi/e-commerce-pizzeria-napoles:latest .
```

Ejecutar el contenedor:

```bash
docker run --rm --name pizzeria-napoles-api -p 8080:8080 calamaxi/e-commerce-pizzeria-napoles:1.0.0
```

Probar la API:

```bash
curl http://localhost:8080/health
curl http://localhost:8080/api/adoptions
curl -X POST http://localhost:8080/api/adoptions/user-1/pet-1 \
  -H "Content-Type: application/json" \
  -d "{\"notes\":\"Prueba desde Docker\"}"
```

## Imagen Docker

Nombre y tag:

```bash
calamaxi/e-commerce-pizzeria-napoles:1.0.0
calamaxi/e-commerce-pizzeria-napoles:latest
```

Publicar en DockerHub:

```bash
docker login
docker push calamaxi/e-commerce-pizzeria-napoles:1.0.0
docker push calamaxi/e-commerce-pizzeria-napoles:latest
```

URL publica esperada:

```txt
https://hub.docker.com/r/calamaxi/e-commerce-pizzeria-napoles
```

Evidencia de build:

```txt
added 178 packages, and audited 179 packages
found 0 vulnerabilities
naming to docker.io/calamaxi/e-commerce-pizzeria-napoles:1.0.0 done
naming to docker.io/calamaxi/e-commerce-pizzeria-napoles:latest done
```

Evidencia de ejecucion:

```txt
MongoDB Memory Server Started at mongodb://127.0.0.1:35737/
MongoDB Conectado exitosamente
Server listening on port 8080

GET /health
{"status":"ok"}

GET /api/adoptions
{"status":"success","payload":[]}

POST /api/adoptions/user-1/pet-1
{"status":"success","payload":{"id":"adoption-1782220499939","owner":{"id":"user-1","first_name":"Maximo","last_name":"Calamante","email":"maxi@example.com"},"pet":{"id":"pet-1","name":"Luna","specie":"dog","adopted":true},"notes":"Prueba desde Docker","adoptedAt":"2026-06-23T13:14:59.939Z"}}
```

## Escaneo basico de seguridad

Comando ejecutado:

```bash
cd backend
npm audit --omit=dev
```

Resultado:

```txt
found 0 vulnerabilities
```

Docker Scout se puede ejecutar despues de iniciar sesion en DockerHub:

```bash
docker login
docker scout quickview calamaxi/e-commerce-pizzeria-napoles:1.0.0
```

## Scripts disponibles

Backend:

```bash
cd backend
npm start
npm test
```

Frontend:

```bash
npm run dev
npm run build
npm run preview
```

## Variables de entorno

El backend puede usar un Mongo externo:

```env
MONGO_URI=mongodb://localhost:27017/pizzeria-napoles
PORT=8080
SESSION_SECRET=super_secret_session
JWT_SECRET=super_secret_jwt_key
```

Si no se define `MONGO_URI`, el backend levanta `mongodb-memory-server` para poder ejecutarse localmente y en Docker sin instalar MongoDB aparte.

## Autor

Maximo Calamante

