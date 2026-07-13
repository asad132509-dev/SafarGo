# SafarGo - Architecture Documentation

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Client Layer (Presentation)                 │
├──────────────────────┬──────────────────────┬──────────────────┤
│  Passenger App       │   Driver App         │   Admin Panel     │
│  (Flutter - iOS)     │   (Flutter - iOS)    │   (Flutter Web)   │
│  (Flutter - Android) │   (Flutter - Android)│                   │
└──────────────────────┴──────────────────────┴──────────────────┘
           ▼                    ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              API Gateway (HTTPS/TLS 1.3)                        │
│  - Request Validation                                           │
│  - Rate Limiting                                                │
│  - JWT Authentication                                           │
│  - CORS Configuration                                           │
└─────────────────────────────────────────────────────────────────┘
           ▼
┌─────────────────────────────────────────────────────────────────┐
│               Application Layer (NestJS)                        │
├──────────────────────────────────────────────────────────────────┤
│  ┌─────────────┬─────────────┬─────────────┬──────────────────┐ │
│  │  Auth       │  Users      │  Rides      │  Payments        │ │
│  │  Module     │  Module     │  Module     │  Module          │ │
│  ├─────────────┼─────────────┼─────────────┼──────────────────┤ │
│  │  Drivers    │  Passengers │  Maps       │  Notifications   │ │
│  │  Module     │  Module     │  Module     │  Module          │ │
│  ├─────────────┼─────────────┼─────────────┼──────────────────┤ │
│  │  Reviews    │  Analytics  │  Admin      │  AI/ML           │ │
│  │  Module     │  Module     │  Module     │  Services        │ │
│  └─────────────┴─────────────┴─────────────┴──────────────────┘ │
│                                                                   │
│  Middleware Layer:                                               │
│  - Authentication Guards                                         │
│  - Authorization Filters                                         │
│  - Request Logging                                               │
│  - Error Handling                                                │
│  - Exception Filters                                             │
└──────────────────────────────────────────────────────────────────┘
           ▼
┌─────────────────────────────────────────────────────────────────┐
│            Real-time Communication Layer                        │
├──────────────────────────────────────────────────────────────────┤
│  - WebSocket Server (Socket.IO)                                 │
│  - Real-time GPS Tracking                                       │
│  - Live Notifications                                           │
│  - Chat System                                                  │
└──────────────────────────────────────────────────────────────────┘
           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Data Access Layer (TypeORM)                        │
├──────────────────────────────────────────────────────────────────┤
│  - Entity Management                                            │
│  - Query Building                                               │
│  - Transaction Handling                                         │
│  - Data Validation                                              │
└──────────────────────────────────────────────────────────────────┘
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Data Layer                                     │
├──────────────────┬──────────────────┬──────────────────────────┤
│  PostgreSQL      │  Redis Cache     │  External Services       │
│  (Primary DB)    │  (Session Store) │  - Google Maps API       │
│  - Users         │  (Real-time Data)│  - Yandex Maps API       │
│  - Drivers       │  - Active Users  │  - SMS Gateway           │
│  - Passengers    │  - Session Data  │  - Payment Gateways      │
│  - Rides         │  - Live Tracking │  - Cloud Storage         │
│  - Payments      │  - Notifications │  - Firebase              │
│  - Reviews       │                  │                          │
└──────────────────┴──────────────────┴──────────────────────────┘
```

## 📊 Component Architecture

### 1. **Authentication & Authorization**

```
Client → JWT Token → Validation → Decode → Authorize → Route Handler
          ▼
   Refresh Token (Redis)
   Device Binding
   Biometric Auth
```

**Features:**
- JWT with RS256 signing
- Refresh token rotation
- Device fingerprinting
- Biometric authentication
- OTP verification
- Session management

### 2. **Real-time GPS Tracking**

```
Driver GPS Coordinate
    ▼
WebSocket Connection
    ▼
Redis PubSub
    ▼
Passenger Live Map Update
```

**Components:**
- Socket.IO for WebSocket
- Redis pub/sub for message broadcasting
- GPS data compression
- Geospatial queries

### 3. **Driver Matching Algorithm**

```
Passenger Request
    ▼
Find Available Drivers (Location-based)
    ▼
Score Drivers:
  - Distance (40%)
  - Rating (30%)
  - Cancellation Rate (15%)
  - Response Time (15%)
    ▼
Select Top Driver & Send Request
```

### 4. **Payment Processing**

```
User Initiates Payment
    ▼
Create Payment Record
    ▼
Integrate with Payment Gateway
    ▼
Verify Payment
    ▼
Update Ride Status
    ▼
Generate Receipt
```

**Supported Gateways:**
- Click
- Payme
- Uzcard
- Humo
- Uzum Bank
- Visa/MasterCard

### 5. **AI/ML Services**

```
Image Upload
    ▼
AI Verification Service
    ├── Fake Image Detection
    ├── Document Verification
    ├── Face Recognition
    └── Liveness Detection
    ▼
Fraud Score Calculation
```

## 🔐 Security Architecture

### Data Encryption

```
Sensitive Data (Passwords, Phone, etc.)
    ▼
AES-256-GCM Encryption
    ▼
Stored in Database
    ▼
Decrypted Only When Needed
```

### API Security

```
Request
    ▼
HTTPS/TLS 1.3 Tunnel
    ▼
API Gateway Rate Limit Check
    ▼
JWT Validation
    ▼
Authorization Middleware
    ▼
Business Logic
```

### Database Security

```
- Connection Pooling with SSL
- Row-Level Security
- Prepared Statements (SQL Injection Prevention)
- Encrypted Backups
- Point-in-time Recovery
```

## 🗄️ Database Design

### Entity Relationships

```
Users (1) ──→ (M) Drivers
     |
     ├──→ (M) Passengers
     └──→ (M) Reviews

Drivers (1) ──→ (1) Vehicles
       |
       └──→ (M) Rides

Passengers (1) ──→ (M) Rides

Rides (1) ──→ (1) Payments
    |
    └──→ (M) Reviews

Payments (M) ──→ (1) PaymentMethod
```

### Indexing Strategy

```sql
-- Performance Critical Indexes
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_drivers_user_id ON drivers(user_id);
CREATE INDEX idx_rides_passenger_id ON rides(passenger_id);
CREATE INDEX idx_rides_driver_id ON rides(driver_id);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_payments_ride_id ON payments(ride_id);
CREATE INDEX idx_reviews_ride_id ON reviews(ride_id);

-- Geospatial Indexes
CREATE INDEX idx_drivers_location ON drivers USING GIST(current_location);
CREATE INDEX idx_rides_pickup ON rides USING GIST(pickup_location);
CREATE INDEX idx_rides_dropoff ON rides USING GIST(dropoff_location);
```

## 🚀 Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────┐
│       Load Balancer (Nginx)             │
│  - SSL/TLS Termination                  │
│  - Request Distribution                 │
│  - Rate Limiting                        │
└──────────────────┬──────────────────────┘
        ▼
┌─────────────────────────────────────────┐
│  Kubernetes Cluster                     │
├─────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ Pod 1   │  │ Pod 2   │  │ Pod 3   │ │
│  │ Backend │  │ Backend │  │ Backend │ │
│  └─────────┘  └─────────┘  └─────────┘ │
│       ▼              ▼           ▼       │
│  ┌─────────────────────────────────┐   │
│  │   Service (Internal LB)         │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
        ▼              ▼
   ┌─────────┐   ┌──────────┐
   │PostgreSQL   │Redis Cluster│
   │ (Master/   │ (Cache)    │
   │ Replicas)  │            │
   └─────────┘   └──────────┘
```

## 📈 Scalability

### Horizontal Scaling
- Containerized NestJS application
- Kubernetes for orchestration
- Stateless API servers
- Shared session store (Redis)

### Vertical Scaling
- Database indexing optimization
- Connection pooling
- Caching strategy
- Query optimization

### Caching Strategy

```
Cache Hierarchy:
1. Application Level (In-Memory)
2. Redis Cache
3. CDN (Static Assets)
4. Database
```

## 🧪 Testing Architecture

```
Unit Tests (Jest)
    ▼
Integration Tests (Jest + Supertest)
    ▼
E2E Tests (Cypress/Playwright)
    ▼
Performance Tests (k6)
    ▼
Security Tests (OWASP ZAP)
```

## 📊 Monitoring & Logging

### Logs Aggregation
```
Application Logs → Winston/Bunyan → ELK Stack (Elasticsearch, Logstash, Kibana)
```

### Metrics Collection
```
Application Metrics → Prometheus → Grafana Dashboards
```

### Alerting
```
Metrics → Alertmanager → Slack/Email Notifications
```

## 🔄 CI/CD Pipeline

```
Git Push
    ▼
GitHub Actions Trigger
    ▼
Code Quality Check (ESLint, Prettier)
    ▼
Unit Tests
    ▼
Integration Tests
    ▼
Security Scan (SonarQube)
    ▼
Build Docker Image
    ▼
Push to Registry
    ▼
Deploy to Staging
    ▼
E2E Tests
    ▼
Deploy to Production
```

## 📱 Mobile App Architecture

### State Management (Provider)

```
Providers
├── AuthProvider
├── UserProvider
├── RideProvider
├── MapProvider
├── PaymentProvider
└── NotificationProvider
```

### Navigation Structure

```
App
├── AuthStack
│   ├── SplashScreen
│   ├── LoginScreen
│   ├── SignUpScreen
│   └── OTPVerificationScreen
└── MainStack (Authenticated Users)
    ├── HomeStack
    │   ├── HomeScreen
    │   ├── RideDetailsScreen
    │   └── DriverProfileScreen
    ├── MapStack
    │   ├── MapScreen
    │   └── LocationPickerScreen
    ├── ProfileStack
    │   ├── ProfileScreen
    │   ├── EditProfileScreen
    │   ├── PaymentMethodsScreen
    │   └── SettingsScreen
    └── HistoryStack
        ├── RideHistoryScreen
        └── ReviewScreen
```

---

**Last Updated:** 2024
**Version:** 1.0.0
