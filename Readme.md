                       ┌───────────────────────────┐
                       │      Tourist Mobile App   │
                       │                           │
                       │ Registration             │
                       │ Login                    │
                       │ GPS                      │
                       │ SOS                      │
                       │ Alerts                   │
                       └──────────────┬────────────┘
                                      │
                                      ▼
                     ┌────────────────────────────────┐
                     │        Backend (Node.js)       │
                     │                                │
                     │ Authentication                 │
                     │ REST APIs                      │
                     │ Role Management                │
                     │ Notification Service           │
                     └──────────────┬─────────────────┘
                                    │
             ┌──────────────────────┼──────────────────────────┐
             ▼                      ▼                          ▼
      AI Prediction          Geo-Fencing Engine         Blockchain
    (Python Flask/FastAPI)        Service               Digital ID
             │                      │                          │
             ▼                      ▼                          ▼
 Isolation Forest           Safe / Unsafe Zone         Identity Hash
 XGBoost                    Route Analysis             Incident Logs
             │                      │                          │
             └──────────────┬───────┴──────────────┬──────────┘
                            ▼
                     MongoDB Database
                            │
        ┌───────────────────┼───────────────────────┐
        ▼                   ▼                       ▼
 Police Dashboard   Hospital Dashboard     Admin Dashboard
        │                   │                       │
        └───────────────Emergency Alerts────────────┘