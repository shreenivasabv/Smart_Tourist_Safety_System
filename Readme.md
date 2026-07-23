# Smart Tourist Safety System

Smart Tourist Safety System is a full-stack pilot safety platform for tourist registration, live monitoring, geofencing, incident visibility, and coordinated response operations.

The current codebase includes:

- a React + Vite admin dashboard
- an Express + MongoDB backend
- tourist registration and management APIs
- live GPS location ingestion endpoints for future mobile apps
- geofence zone APIs
- monitoring dashboards and map overlays
- incident logging and response workflow
- email alert support with a configurable scheduled alert job

## Architecture

### Frontend

- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- React Leaflet + Leaflet
- React Icons

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- JWT authentication for admin login
- Nodemailer for email alerts
- Helmet, CORS, Morgan, express-rate-limit

## Project Structure

```text
Smart_Tourist_Safety_System/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
    index.js
  frontend/
    src/
      components/
      constants/
      layouts/
      pages/
      services/
```

## Main Features

- Admin login, forgot password, and reset password
- Tourist registration and CRUD APIs
- Tourist list dashboard
- Monitoring dashboard with:
  - live tourist markers
  - selected tourist-region focus
  - protected boundaries
  - risk zones
  - zone overlays
- GPS tracking endpoints that accept smartphone latitude/longitude
- Location history storage
- Geofence evaluation for inside/outside risk detection
- Scheduled email alerts for high-risk or out-of-boundary tourists
- Device-token registration for future Android push integration
- Incident response workflow: create, prioritize, acknowledge, respond to, and resolve incidents

## Important Design Note

The future mobile app should not connect directly to MongoDB.

Use the backend APIs for:

- authentication
- tourist lookup
- location updates
- alert/device registration

That keeps validation, alerting, geofence evaluation, and audit history in one place.

## Environment Variables

Create `backend/.env` with values like:

```env
JWT_SECRET=abcdefgh123456
EMAIL=yourgmail@gmail.com
EMAIL_PASSWORD=your_app_password
MONGO_URI=mongodb://127.0.0.1:27017/smart_tourist
PORT=5000
ALERT_JOB_INTERVAL_MS=300000
ALERT_COOLDOWN_MS=300000
```

### Variable Notes

- `EMAIL` and `EMAIL_PASSWORD` are required for email alerts and forgot-password email delivery.
- `ALERT_JOB_INTERVAL_MS` controls how often the scheduled alert job runs.
- `ALERT_COOLDOWN_MS` controls how often the same tourist can be alerted again.

## Installation

### 1. Clone the repo

```bash
git clone <your-repository-url>
cd Smart_Tourist_Safety_System
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

## Running the Project

### Start backend

```bash
cd backend
npm run dev
```

Backend default URL:

```text
http://localhost:5000
```

### Start frontend

```bash
cd frontend
npm run dev
```

Frontend default URL:

```text
http://127.0.0.1:3000
```

## Default Admin

When the backend starts, it auto-creates a default admin if one does not already exist:

```text
Email: admin@gmail.com
Password: admin123
```

## Backend API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/:token`
- `POST /api/auth/logout`

### Tourists

- `POST /api/tourists`
- `GET /api/tourists`
- `GET /api/tourists/:id`
- `PUT /api/tourists/:id`
- `DELETE /api/tourists/:id`

### GPS and Mobile Location

- `POST /api/gps/update`
  - Generic location update endpoint

- `POST /api/gps/mobile-update`
  - Mobile-app-friendly endpoint
  - Accepts:

```json
{
  "touristId": "tourist_mongo_id",
  "latitude": 15.335,
  "longitude": 76.46,
  "accuracy": 8,
  "deviceTimestamp": "2026-07-17T10:00:00.000Z",
  "batteryLevel": 78,
  "heading": 142,
  "altitude": 512,
  "source": "android-app"
}
```

- `GET /api/gps/current/:touristId`
- `GET /api/gps/history/:touristId`
- `GET /api/gps/status/:touristId`
- `GET /api/gps/all-current`

The monitoring screen uses `GET /api/dashboard/tourists-live` to refresh current device positions. A location update records the source (for example, `android-app`) and the map displays only valid device-reported coordinates.

### Zones and Geofencing

- `POST /api/zones`
- `GET /api/zones`
- `GET /api/zones/:id`
- `PUT /api/zones/:id`
- `DELETE /api/zones/:id`
- `POST /api/zones/check`
- `POST /api/zones/recalculate-all`

### Dashboard

- `GET /api/dashboard/active-tourists`
- `GET /api/dashboard/outside-safe-zone`
- `GET /api/dashboard/risk-level`
- `GET /api/dashboard/tourists-live`
- `GET /api/dashboard/stats`

### Alerts

- `GET /api/alerts/capabilities`
- `POST /api/alerts/device/register`
- `POST /api/alerts/send`

#### Device registration payload

```json
{
  "touristId": "tourist_mongo_id",
  "deviceToken": "future-fcm-token",
  "devicePlatform": "android",
  "preferredAlertChannel": "both"
}
```

### Incidents

- `GET /api/incidents` — list incidents; supports optional `status`, `priority`, and `limit` query parameters
- `GET /api/incidents/summary` — active, critical, and resolved-today counts
- `POST /api/incidents` — create an incident
- `PATCH /api/incidents/:id` — update incident details or response status

#### Create incident payload

```json
{
  "tourist": "tourist_mongo_id",
  "type": "medical",
  "priority": "high",
  "title": "Assistance requested near east gate",
  "description": "Tourist reported dizziness and needs a medical check.",
  "locationLabel": "East Gate",
  "reportedBy": "Control room"
}
```

`tourist` is optional. If a linked tourist has a valid current GPS fix, that location is copied into the new incident as a snapshot. Creating or updating an incident does not change tourist records or location history.

#### Manual alert payload

```json
{
  "touristId": "tourist_mongo_id",
  "subject": "Emergency Alert",
  "message": "Please return to the protected boundary immediately.",
  "channels": ["email", "push"]
}
```

## Email Alerts

The project now supports:

- forgot-password email delivery
- manual alert sending through `/api/alerts/send`
- scheduled safety reminder emails for tourists who are:
  - outside the safe boundary
  - marked high risk

The scheduled alert job runs from backend startup and is controlled by:

- `ALERT_JOB_INTERVAL_MS`
- `ALERT_COOLDOWN_MS`

## Android Alert Status

The backend is ready for future Android alert integration, but push notification delivery is currently placeholder-only.

What is already present:

- tourist device token registration
- preferred alert channel storage
- alert dispatch API contract

What you still need later:

- Firebase Cloud Messaging integration
- Android app device token generation
- secure tourist/app authentication

## Monitoring Map Behavior

The monitoring map:

- focuses on a selected tourist region such as Hampi
- supports search against curated tourist-region presets
- draws protected area boundaries
- draws risk or restricted zones
- shows all tourists on the map
- shows only valid device-reported GPS positions
- labels each marker with its location source and last-seen time

## Current Data Models

### Tourist

Includes:

- profile and registration details
- current live location
- speed
- online/offline state
- zone status
- risk level
- alert metadata
- device token and platform metadata

### LocationHistory

Includes:

- tourist reference
- GeoJSON location
- speed
- accuracy
- source
- device timestamp
- battery/heading/altitude metadata
- zone status at point

### Zone

Includes:

- polygon boundary
- risk level
- zone type
- active state

### Incident

Includes:

- unique incident reference
- optional tourist reference and tourist-name snapshot
- type, priority, and response status
- description, landmark, and optional GeoJSON location snapshot
- reporter, assignee, resolution note, and resolution time

## Frontend Notes

Main frontend areas:

- `src/pages/Login.jsx`
- `src/pages/ForgotPassword.jsx`
- `src/pages/ResetPassword.jsx`
- `src/pages/AdminDashBoard.jsx`
- `src/layouts/Monitoring/MonitoringPage.jsx`
- `src/components/Monitoring/LiveMonitoringMap.jsx`
- `src/components/Tourists/TouristDashboard.jsx`

## Cleanup Completed

The repo cleanup in this pass removed:

- an unused duplicate backend tourist model under `backend/models/Gps/Tourist.js`
- unused empty frontend folders created during intermediate refactors
- an unused page import in `AdminDashBoard.jsx`

## Suggested Next Steps

1. Integrate Firebase Cloud Messaging for real Android push alerts.
2. Add admin UI to create/edit zone polygons directly from the map.
3. Add tourist mobile authentication before accepting device registration and live GPS updates.
4. Add real alert history and acknowledgment tracking.
5. Replace curated region search with dynamic geocoding if desired.

## License

This project is currently suitable for demo, academic, and prototype use. Before production use, add stronger authentication, auditing, secure secrets management, device auth, and deployment hardening.
