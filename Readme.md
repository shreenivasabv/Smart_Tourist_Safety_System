# Smart Tourist Safety System

Smart Tourist Safety System is a web-based safety management platform for tourist monitoring, incident response, and emergency coordination. The current implementation is now framed as a single-area pilot deployment with an admin dashboard, tourist registration flow, and a backend API that records user data with a blockchain-style hash for tamper-evident tracking.

## Overview

The system is designed to help tourism departments and emergency teams:

- Monitor tourist safety activity
- Register tourists with identity and emergency contact details
- Maintain one protected tourism area as a pilot deployment
- Review alerts and incidents
- Coordinate with police and hospital services
- Track safety-related analytics and reports

## Current Implementation Status

### Implemented

- Responsive admin dashboard UI built with React and Vite
- Sidebar-based navigation for dashboard, tourists, monitoring, incidents, police, hospitals, analytics, reports, and settings
- Tourist registration form
- Area-focused registration fields for future geo-fencing and mobile onboarding
- Backend API for storing registration records
- Blockchain-style hashing using SHA-256 for each registration record
- Basic API response structure for successful registration and inspection

### Not Implemented Yet

The following features are planned but are not fully implemented in the current version:

- Real blockchain network integration
- Persistent database storage (MongoDB is planned, but current records are stored in memory)
- Authentication and role-based login for admin/police/hospital users
- Real-time mobile GPS tracking
- AI-based risk prediction and anomaly detection
- Geo-fencing engine integration
- Push notifications and SMS alerts
- Full police/hospital dashboards and workflow management

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- React Icons
- Axios

### Backend

- Node.js
- Express.js
- CORS
- Helmet
- Morgan
- Express Rate Limit

## Project Structure

```text
frontend/         # React admin dashboard and UI
backend/          # Express REST API
  routes/          # API route handlers
  config/          # Backend configuration
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd Smart_Tourist_Safety_System
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

```bash
cd ../backend
npm install
```

### 4. Run the frontend

```bash
cd ../frontend
npm run dev
```

The frontend will start on a local Vite port such as http://127.0.0.1:3000 or the next available port.

### 5. Run the backend

```bash
cd ../backend
npm run dev
```

The backend runs on http://localhost:5000 by default.

## API Endpoints

### User Registration

- POST /api/users/register
  - Registers a tourist with name, email, phone, emergency details, pilot-area information, and future tracking consent metadata
  - Returns a registration record along with a blockchain-style hash

- GET /api/users/registrations
  - Returns the list of registered users

## Data Handling Note

The current blockchain implementation is a lightweight, hash-based record model. It is not yet connected to a real distributed ledger or blockchain network. It is intended as a prototype for tamper-evident identity storage and can be upgraded later to a real blockchain solution.

## Roadmap

Planned improvements include:

1. Replace in-memory storage with MongoDB persistence
2. Add user authentication and authorization
3. Integrate real blockchain storage or smart contract-based logging
4. Add live monitoring and alert workflows
5. Implement AI-based risk scoring and geo-fencing
6. Connect the UI to full backend APIs for dashboards and reports

## License

This project is currently for academic/demo purposes and may be extended for production use with additional security, compliance, and deployment work.
