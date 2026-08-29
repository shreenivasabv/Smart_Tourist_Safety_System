# Smart Tourist Safety System — Project Context

## Purpose and scope

Smart Tourist Safety System is a full-stack pilot operations platform for a protected tourist area. It allows an administrative control room to register tourists, ingest their GPS updates, assess whether they are inside configured geofences, monitor the live situation on a map, manage incidents and response partners, send email safety alerts, and export operational reports.

It is an academic/prototype-style system, not a production-hardened deployment. The intended future extension is a tourist mobile app that reports location to the backend; it should not access MongoDB directly.

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, React Router 7, Vite 8, Tailwind CSS 4, Axios |
| Maps | Leaflet and React Leaflet; OpenStreetMap tile service |
| Backend | Node.js, Express 5, CommonJS |
| Persistence | MongoDB through Mongoose 9; GeoJSON with `2dsphere` indexes |
| Security/support | JWT, bcrypt, Helmet, CORS, express-rate-limit, Morgan, dotenv |
| Notifications | Nodemailer using Gmail SMTP; push delivery is not integrated |
| Tooling | Nodemon, Oxlint, npm lockfiles |

## Repository layout

```text
Smart_Tourist_Safety_System/
├── Readme.md                         # Setup, API outline, system notes
├── PROJECT_CONTEXT.md                 # This document
├── backend/
│   ├── index.js                       # Express startup, middleware, route mounting, jobs
│   ├── config/db.js                   # MongoDB connection
│   ├── controllers/                   # Request/business-logic handlers
│   ├── middleware/authMiddleware.js   # JWT verifier (currently not mounted on routes)
│   ├── models/                        # Mongoose models
│   │   └── Gps/                       # Zone and location-history models
│   ├── routes/                        # HTTP route definitions
│   │   └── Gps/                       # GPS, zone, and live-dashboard routes
│   ├── utils/                         # Geospatial logic, email, scheduled jobs
│   ├── .env                           # Local secrets/configuration (not committed)
│   └── package.json
└── frontend/
    ├── index.html                     # Vite HTML shell
    ├── vite.config.js                 # React and Tailwind Vite plugins
    ├── src/
    │   ├── main.jsx                   # React mount point
    │   ├── App.jsx                    # Top-level public/protected routing
    │   ├── pages/                     # Login/password and admin route composition
    │   ├── components/                # Feature/UI components
    │   │   ├── Dashboards/            # Overview cards and recent incident tables
    │   │   ├── Tourists/              # Active tourist registration/list UI
    │   │   ├── Monitoring/            # Leaflet live-monitoring map
    │   │   ├── Incidents/             # Incident workflow
    │   │   ├── Operations/            # Analytics, reports, settings, response units
    │   │   ├── layouts/               # Sidebar and top navigation
    │   │   └── common/                # PageShell wrapper
    │   ├── layouts/                   # Page-level Monitoring and legacy Tourist layouts
    │   ├── services/                  # Axios API wrappers
    │   ├── constants/                 # Deployment label and curated map-region presets
    │   └── assets/, public/           # Static visual assets/icons
    └── package.json
```

`node_modules`, frontend `dist`, and frontend `build` are generated directories. `frontend/src/layouts/Tourists/TouristsPage.jsx` is a legacy/unused prototype: it calls an unavailable `/api/users/register` endpoint and is not the Tourist page rendered by the admin dashboard.

## Entry points and runtime configuration

### Backend

`backend/index.js` loads dotenv, connects to MongoDB, creates the Express app, applies middleware, mounts routes, listens on `PORT` (default `5000`), creates a default admin if absent, and starts background jobs.

Mounted route bases are:

- `/api/auth`
- `/api/tourist-dashboard`
- `/api/tourists`
- `/api/alerts`
- `/api/incidents`
- `/api/response-units`
- `/api/gps`
- `/api/zones`
- `/api/dashboard`

`GET /` is an unauthenticated backend health-style response.

On first startup, the server seeds `admin@gmail.com` / `admin123` if that email does not exist. This is suitable only for a local demo and must be replaced before real use.

### Frontend

`frontend/src/main.jsx` mounts `App` into `#root`. `App.jsx` exposes public login, forgot-password, and reset-password routes; every other path renders `AdminDashboard` behind `ProtectedRoute`.

The frontend development script runs Vite on `127.0.0.1:3000`; the backend CORS allowlist also includes ports 3000 and 5173 on `localhost`/`127.0.0.1`. Axios service modules hard-code `http://localhost:5000/api`; there is no frontend environment-based API URL yet.

## Architecture and design approach

The system follows a conventional layered Express application:

```text
React page/component → service (Axios) → Express route → controller
→ Mongoose model / utility → MongoDB or external email service
```

- **Route/controller/model separation:** routes only bind endpoints; controllers perform validation/workflows; Mongoose models own persistent schema constraints.
- **Document-oriented geospatial design:** Tourist current location and LocationHistory points are GeoJSON Points; Zone polygons are GeoJSON Polygons and use spatial indexes.
- **Derived live state:** each GPS write recalculates speed, online state, zone status, current zone, and risk level on the Tourist document, while preserving an immutable location-history record.
- **Polling rather than realtime sockets:** the monitoring screen fetches dashboard stats, active zones, and live tourists every second. There is no WebSocket/SSE layer.
- **Dashboard composition:** operations, analytics, and reports share `getOperationsSnapshot`, which combines existing stats, incidents, and tourists endpoints in parallel.
- **Client-side command UI:** incident actions and response-unit CRUD update the API then reload the data. Browser preferences and JWT are stored in `localStorage`.

## Frontend routes and main components

| Route | Component | Responsibility |
| --- | --- | --- |
| `/login` | `pages/Login.jsx` | Admin sign-in and local JWT storage |
| `/forgot-password` | `pages/ForgotPassword.jsx` | Request reset email |
| `/reset-password/:token` | `pages/ResetPassword.jsx` | Submit new password |
| `/` | `DashboardHomePage` | Operational cards plus recent incident/alert tables |
| `/tourists` | `components/Tourists/TouristDashboard.jsx` | Register, list, and delete tourist records |
| `/monitoring` | `layouts/Monitoring/MonitoringPage.jsx` | Poll live data and render map/geofence overlays |
| `/incidents` | `IncidentsWorkspace` | Create, filter, acknowledge, respond to, and resolve incidents |
| `/police`, `/hospitals` | `ResponseUnitDirectory` | CRUD response units filtered by type |
| `/analytics` | `AnalyticsDashboard` | Risk and operational metrics |
| `/reports` | `ReportsDashboard` | Client-side CSV exports |
| `/settings` | `SystemSettings` | Alert capability display and browser-only preferences |

Key frontend implementation notes:

- `ProtectedRoute` only checks that `localStorage.token` is nonempty; it does not validate expiration or communicate with the API.
- `LiveMonitoringMap` merges database zones with front-end-only curated boundaries/risk zones for Hampi, Mysuru Palace, and Old Goa. Those presets are visual overlays, not persisted Zone documents.
- `TouristForm` submits the schema-backed tourist fields. `TouristTable` presently supports deletion but not editing even though the backend supports updates.
- CSV reports are generated in the browser through `Blob`, `URL.createObjectURL`, and a temporary anchor; no report files are stored on the server.

## Backend API

All endpoints currently lack route-level authentication middleware, including mutations.

### Authentication — `/api/auth`

| Method/path | Purpose |
| --- | --- |
| `POST /register` | Create an admin with a bcrypt-hashed password |
| `POST /login` | Validate email/password and return a one-day JWT plus safe admin fields |
| `POST /forgot-password` | Store a random 32-byte hex reset token valid for one hour; email a reset URL |
| `POST /reset-password/:token` | Validate token/expiry, hash the new password, clear reset fields |
| `GET /logout` | Returns success only; token invalidation is client-side deletion |

### Tourist records — `/api/tourists`

| Method/path | Purpose |
| --- | --- |
| `POST /` | Register a tourist |
| `GET /` | List tourists newest first |
| `GET /:id` | Get one tourist |
| `PUT /:id` | Update a tourist document |
| `DELETE /:id` | Delete a tourist document |

`GET /api/tourist-dashboard/` separately returns legacy registration/status counts (`totalTourists`, `trackingReady`, `zonePending`, `safeVisitors`, `monitoringVisitors`, `supportVisitors`).

### GPS and tracking — `/api/gps`

| Method/path | Purpose |
| --- | --- |
| `POST /update` | Generic location update; accepts tourist ID, latitude, longitude and optional device metadata |
| `POST /mobile-update` | Same workflow, defaults source to `android-app`, returns `202 Accepted` |
| `GET /current/:touristId` | Latest position/state for one tourist; computes online status at read time |
| `GET /history/:touristId` | Descending location history; supports `from`, `to`, `limit` query parameters |
| `GET /status/:touristId` | Last-seen and online/offline status |
| `GET /all-current` | Current locations with valid nonzero coordinates |

### Zones and geofences — `/api/zones`

| Method/path | Purpose |
| --- | --- |
| `POST /` | Create a zone from a name and a ring of at least three `[lng, lat]` pairs; closes the ring automatically |
| `GET /` | List zones; optional `active=true|false` |
| `GET /:id` | Get one zone |
| `PUT /:id` | Update metadata, active state, or polygon coordinates |
| `DELETE /:id` | Delete a zone |
| `POST /check` | Determine whether a supplied latitude/longitude is inside an active zone |
| `POST /recalculate-all` | Re-evaluate stored current locations after zone changes |

### Live dashboard — `/api/dashboard`

| Method/path | Purpose |
| --- | --- |
| `GET /active-tourists` | Tourists with `lastSeen` within five minutes |
| `GET /outside-safe-zone` | Tourists whose derived `zoneStatus` is `outside` |
| `GET /risk-level` | Low/medium/high tourist counts |
| `GET /tourists-live` | Current position/status feed for all tourists; online state recomputed |
| `GET /stats` | Combined count payload used by monitoring, analytics, reports, and overview cards |

### Alerts — `/api/alerts`

| Method/path | Purpose |
| --- | --- |
| `GET /capabilities` | Tell UI whether email is configured and report that push is registration-only |
| `POST /device/register` | Save a tourist device token, platform, preferred channel, and registration date |
| `POST /send` | Send an email alert and/or accept a placeholder push alert request; records `lastAlertSentAt` for linked tourist |

### Incidents — `/api/incidents`

| Method/path | Purpose |
| --- | --- |
| `GET /` | List incidents, optionally filtered by `status`, `priority`, and capped `limit` |
| `GET /summary` | Open/acknowledged/responding total, active critical count, and resolved-today count |
| `POST /` | Create incident; creates a unique reference and can link a tourist |
| `PATCH /:id` | Whitelisted partial update of incident details/status |

When an incident links a tourist with a valid current location, the backend snapshots both tourist name and location into the Incident. Incident changes deliberately do not alter tourist or location-history records. Setting status to `resolved` or `closed` sets `resolvedAt`; moving back to an active state clears it.

### Response units — `/api/response-units`

| Method/path | Purpose |
| --- | --- |
| `GET /` | List police/hospital units; optional `type` filter |
| `POST /` | Create a response unit |
| `PATCH /:id` | Update a unit |
| `DELETE /:id` | Delete a unit |

## Database models and relationships

| Model | Important fields | Relationships / indexes |
| --- | --- | --- |
| `Admin` | name, unique email, bcrypt password, reset token/expiry | timestamps |
| `Tourist` | identity/contact/visit fields; consent; legacy `status`; current GeoJSON location; speed, last-seen, online, zone/risk, device and alert metadata | `currentZone → Zone`; `currentLocation` 2dsphere index; unique email |
| `LocationHistory` | Tourist ID, GeoJSON Point, speed, accuracy, source, device timestamp/battery/heading/altitude, zone status at point, recorded time | `tourist → Tourist`; spatial index and compound `{ tourist, recordedAt }` index |
| `Zone` | name/description, low/medium/high risk, safe/restricted/sensitive type, active flag, GeoJSON Polygon | optional `createdBy → Admin`; polygon 2dsphere index |
| `Incident` | generated reference, optional tourist/name snapshot, type, priority, workflow status, title/details, optional Point snapshot, reporter/assignee/resolution | `tourist → Tourist`; reference/createdAt/location indexes |
| `ResponseUnit` | name, police/hospital type, coverage/contact, availability, capacity, notes | indexes on type and status |

There is no cascade cleanup: deleting a Tourist does not explicitly delete its history or linked incidents. Zone deletion can leave a Tourist `currentZone` reference stale until a subsequent GPS update or a recalculation.

## Authentication and authorization

Authentication flow:

1. `Login.jsx` posts credentials to `/api/auth/login`.
2. The backend compares the submitted password against the stored bcrypt hash and signs a JWT containing admin ID/email with a one-day expiry.
3. The browser stores only the returned token in `localStorage` and navigates to `/`.
4. `ProtectedRoute` permits UI routing if a token exists. Logout simply removes it from local storage.
5. The `authMiddleware` can verify the raw `Authorization` header with `JWT_SECRET` and place its claims in `req.user`, but it is not imported/applied by active routes. Axios services do not attach the token either.

Therefore, authentication is currently a UI gate, **not API authorization**. Password-reset tokens are stored in plaintext in MongoDB; reset URLs are hard-coded to frontend port 5173 although the supplied Vite script runs on port 3000.

## Core data flows and business logic

### GPS update and geofence evaluation

```text
Mobile/app client
  → POST /api/gps/update or /mobile-update
  → validate tourist and numeric coordinates
  → calculate speed from prior fix using Haversine distance (clamped to 300 km/h)
  → MongoDB $geoIntersects against active Zone polygons
  → insert LocationHistory point
  → update Tourist current location, lastSeen, online, zone/risk, and device metadata
  → monitoring/dashboard polling reads the updated Tourist state
```

Coordinates are consistently stored as `[longitude, latitude]` in GeoJSON. A point outside every active zone receives `zoneStatus: outside`, `currentZone: null`, and `riskLevel: high`. Inside a `safe` zone it is `inside`; inside `restricted` or `sensitive` zones it remains `outside`, with that zone's configured risk. `findContainingZone` returns the first matching active zone, so overlapping-zone precedence is not explicitly defined.

### Connectivity and alerting

- A tourist is online when their last GPS ping is no older than five minutes.
- `offlineStatusJob` runs once per minute and changes stale stored `onlineStatus: online` values to `offline`; several read endpoints independently calculate live status to avoid cron lag.
- `touristAlertJob` starts only when `EMAIL` and `EMAIL_PASSWORD` are configured. At its configured interval it emails tourists outside a zone or at high risk, subject to a per-tourist cooldown tracked in `lastAlertSentAt`.
- Manual alert requests can email a direct address or linked tourist. A requested push channel is only logged/returned as accepted when a device token exists; Firebase/FCM dispatch has not been implemented.

### Incident operations

Control-room staff log incidents with a type, priority, title, location label, description, reporter, and optional tourist. The UI advances records through `open → acknowledged → responding → resolved` (the data model also supports `closed`). Dashboard alert tables treat incidents as the operational alert queue.

## Environment variables

The local `backend/.env` currently defines the first four variables below. Do not commit values; `.env` is excluded by the root `.gitignore`.

| Variable | Required/use |
| --- | --- |
| `MONGO_URI` | Required by `config/db.js` to connect Mongoose |
| `JWT_SECRET` | Required to sign login JWTs and verify them in the available middleware |
| `EMAIL` | Gmail account/sender for reset and safety emails |
| `EMAIL_PASSWORD` | Gmail app password/SMTP credential |
| `PORT` | Optional server port; defaults to `5000` |
| `ALERT_JOB_INTERVAL_MS` | Optional alert-job interval; defaults to 5 minutes |
| `ALERT_COOLDOWN_MS` | Optional repeat-alert cooldown; defaults to alert-job interval |

## External dependencies and integrations

- **MongoDB:** required operational datastore and spatial query engine.
- **Gmail/Nodemailer:** required only for reset/manual/scheduled email. The alert-capability endpoint exposes whether these credentials are available.
- **OpenStreetMap:** Leaflet tile URL is used directly by the browser. Zone/tourist overlays remain logically present if tiles fail to load.
- **Future mobile/FCM:** API contracts save device tokens and accept push-channel requests, but neither a mobile app nor Firebase Cloud Messaging credentials/client are present.

`multer` is listed in backend dependencies but is not used in the current code.

## Implemented features

- Admin registration/login and email password-reset flow.
- Tourist registration, listing, retrieval, update API, and deletion.
- GPS ingestion with telemetry metadata, speed calculation, location history, and online/offline calculation.
- CRUD geofence zones and batch zone-state recalculation.
- Live monitoring map with database zones, curated region overlays, tourist markers and information popups.
- Combined dashboard/analytics metrics and recent incident tables.
- Incident creation, filtering, priority/status workflow, and location/name snapshots.
- Police/hospital response-unit directory CRUD.
- Email capability/status, manual email alerts, scheduled risk/out-of-zone alerts, and future device-token registration.
- Browser-local operator preferences and client-generated CSV reports.

## Important configuration and operational files

| File | Why it matters |
| --- | --- |
| `backend/index.js` | Server lifecycle, security middleware, CORS origins, rate limit, route bases, seeded admin, scheduled jobs |
| `backend/config/db.js` | Fails the process when MongoDB connection cannot be established |
| `backend/.env` | Secrets and runtime endpoint/job settings |
| `backend/package.json` | `npm run dev` / `npm start` both run Nodemon |
| `frontend/vite.config.js` | Enables React and Tailwind Vite plugins; no proxy is defined |
| `frontend/package.json` | Vite dev server fixed at `127.0.0.1:3000`; build/lint commands |
| `frontend/src/constants/monitoringRegions.js` | Front-end visual presets for Hampi, Mysuru Palace, and Old Goa |
| `frontend/.oxlintrc.json` | React/Oxc lint configuration |
| `Readme.md` | Setup instructions, payload examples, roadmap, and system-level notes |

## Known gaps and integration cautions

- No active backend authorization: protect route groups and attach JWT through Axios before exposing the API.
- Inputs are only partially validated. GPS validates number finiteness but not latitude/longitude range; tourist update/delete semantics do not distinguish missing IDs robustly.
- Authentication security needs production work: seed credentials, token storage, reset-token hashing, expiry handling in the UI, logout revocation, and a configurable public frontend URL.
- The monitoring page makes three API calls every second; this is adequate for a small pilot but should be replaced or throttled for scale.
- `dashboardService.js` contains wrappers for `/api/dashboard/summary`, `/alerts`, `/incidents`, and `/analytics`, which are not implemented by the current backend and are not used by the active UI.
- The unused legacy tourist layout references a nonexistent `/api/users/register` plus blockchain fields; it is separate from the working TouristDashboard.
- There are no automated tests in either package (`backend`'s test script intentionally exits with an error).

