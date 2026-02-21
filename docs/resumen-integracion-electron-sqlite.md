# Resumen Tecnico del Proyecto (Electron + Backend Embebido + SQLite)

Ultima actualizacion: 2026-02-15

## 1. Objetivo de los cambios

Se realizo una evolucion del proyecto para pasar de una app web tradicional a una app de escritorio, manteniendo React en frontend y Express en backend, pero empaquetando todo en Electron.

Objetivos concretos:

- Ejecutar frontend y backend dentro de la misma aplicacion desktop.
- Eliminar dependencia de MySQL local y usar una base embebida (SQLite).
- Mantener compatibilidad con la API existente para no romper el frontend.
- Facilitar distribucion con instalador (`electron-builder`).

## 2. Estado previo

Antes de los cambios:

- Frontend: CRA (`react-scripts`) en `src/`.
- Backend: Express en `backend/`, con arranque acoplado y conexion MySQL (`mysql2`).
- Base de datos: MySQL (`toribio-webapp`) configurada en codigo.
- No existia runtime Electron.

Problemas del estado previo:

- Dependencia de tener MySQL instalado/configurado en cada PC.
- Frontend y backend se ejecutaban como procesos separados y no empaquetados juntos.
- Distribucion desktop no estaba preparada.

## 3. Arquitectura actual

Arquitectura final:

1. **Electron main process**
   - Archivo: `electron/main.js`
   - Crea ventana principal (`BrowserWindow`).
   - Inicia y detiene el backend embebido.
   - En desarrollo carga `http://localhost:3000`.
   - En produccion carga `build/index.html`.

2. **Electron preload**
   - Archivo: `electron/preload.js`
   - Expone una API minima y segura al renderer.
   - Se usa `contextIsolation: true` y `nodeIntegration: false`.

3. **Frontend React (renderer)**
   - Sigue siendo CRA.
   - Consume backend local por HTTP (`127.0.0.1:8080`).

4. **Backend Express embebible**
   - `backend/app.js` exporta app Express (sin `listen`).
   - `backend/server.js` maneja `startServer/stopServer`.
   - `backend/index.js` queda como punto de entrada simple para modo backend standalone.

5. **Base de datos SQLite**
   - `backend/config/dbConfig.js` usa `sqlite` + `sqlite3`.
   - Inicializa automaticamente tablas `users` y `payments`.
   - Mantiene interfaz compatible con el codigo existente (`query`, `execute`, `getConnection`).

## 4. Decisiones tecnicas y por que se tomaron

### 4.1 Electron con backend embebido (mismo proceso de app)

Decision:

- Iniciar backend desde Electron main.

Motivo:

- Una sola app para el usuario final.
- Menos pasos de operacion.
- Menor riesgo de errores por backend no iniciado.

### 4.2 Migracion de MySQL a SQLite

Decision:

- Reemplazar `mysql2` por SQLite local embebida.

Motivo:

- Evitar instalacion/configuracion de servidor MySQL en cada equipo.
- Mejor experiencia offline.
- Menor complejidad operativa.

### 4.3 Mantener contrato de acceso a datos

Decision:

- Implementar capa SQLite con metodos compatibles con el contrato usado por modelos (`query/execute/getConnection`).

Motivo:

- Minimizar cambios en controllers/models.
- Reducir riesgo de regresiones funcionales.

### 4.4 Seguridad de renderer

Decision:

- `contextIsolation: true`
- `nodeIntegration: false`
- Uso de `preload`

Motivo:

- Seguir buenas practicas de Electron para reducir superficie de ataque.

### 4.5 Packaging con electron-builder

Decision:

- Configurar bloque `build` en `package.json`.

Motivo:

- Generar instalador desktop y distribuir de forma estandar.

## 5. Archivos creados

| Archivo | Que se agrego | Por que |
|---|---|---|
| `backend/server.js` | `startServer` y `stopServer` con manejo de lifecycle | Permitir backend embebido y standalone |
| `electron/main.js` | Runtime principal de Electron | Integrar ventana + backend local |
| `electron/preload.js` | Bridge seguro hacia renderer | Seguridad y aislamiento |
| `electron/start-electron.js` | Launcher que limpia `ELECTRON_RUN_AS_NODE` | Evitar fallo de arranque en algunos entornos |
| `docs/resumen-integracion-electron-sqlite.md` | Esta documentacion | Dejar trazabilidad tecnica |

## 6. Archivos modificados

| Archivo | Cambio principal | Motivo |
|---|---|---|
| `backend/app.js` | Dejo de hacer `listen` y ahora exporta `app`; carga `.env` por ruta explicita | Separar construccion de app del arranque de servidor |
| `backend/index.js` | Usa `startServer()` | Unificar punto de arranque backend |
| `backend/config/dbConfig.js` | Reescritura completa a SQLite + init de esquema + API compatible | Migracion de DB sin romper modelos |
| `backend/models/paymentModel.js` | Ajustes menores de logs y query por fecha (`DATE(date)`) | Compatibilidad y robustez con SQLite |
| `backend/utils/logger.js` | Logger mas tolerante (`logger` y `logger.error`) | Evitar errores por distintos tipos de payload |
| `backend/package.json` | `main/scripts` hacia `server.js`; dependencias SQLite | Soporte al nuevo backend |
| `backend/package-lock.json` | Actualizacion automatica por instalacion | Mantener lockfile consistente |
| `package.json` | Scripts desktop/dev/build, `main`, config `electron-builder`, dependencias runtime | Soportar Electron + backend embebido + empaquetado |
| `package-lock.json` | Actualizacion automatica por nuevas dependencias | Consistencia de dependencias |
| `src/utils/const.js` | `API.URI` configurable via `REACT_APP_API_URL` | Flexibilidad entre dev/build |
| `.gitignore` | Ignora `dist`, `backend/data`, archivos `.sqlite*` | Evitar commitear artefactos locales |
| `README.md` | Documenta flujo desktop y SQLite | Onboarding y operacion |

## 7. Archivos eliminados

No se eliminaron archivos del proyecto en esta migracion.

## 8. Como correr el proyecto ahora

### Desktop dev (recomendado)

```bash
npm run dev:electron
```

Levanta:

- React dev server (puerto 3000)
- Electron
- Backend embebido en Electron (puerto 8080)

### Backend solo

```bash
npm run start:backend
```

### Build web

```bash
npm run build
```

### Build instalador desktop

```bash
npm run dist
```

## 9. Base de datos y ubicaciones

- **Electron**: DB en `app.getPath('userData')/data/toribio.sqlite`
- **Backend standalone**: DB en `backend/data/toribio.sqlite`
- Se puede forzar ruta con variable `SQLITE_DB_PATH`.

## 10. Riesgos, limites y pendientes recomendados

1. **Seed inicial de usuario**: no existe seed automatico de admin; hoy se crea por API/manual.
2. **Migracion de datos MySQL a SQLite**: no hay script de migracion historica.
3. **Vulnerabilidades npm**: hay advisories en dependencias; conviene plan de actualizacion controlada.
4. **Warnings de lint existentes**: no bloquean build, pero conviene limpieza progresiva.

## 11. Resumen ejecutivo corto

Se transformo el proyecto en una app desktop ejecutable con Electron, con backend Express embebido y base SQLite local, priorizando simplicidad de despliegue, compatibilidad con la logica existente y seguridad basica del renderer.
