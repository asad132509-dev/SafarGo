# SafarGo - Premium Taxi Super App

🚕 O'zbekiston uchun zamonaviy, xavfsiz va tez ishlaydigan Taxi Super App

## 📋 Loyiha Haqida

SafarGo - Yandex Go va Uklon darajasidagi professional taxi ilovasi. Foydalanuvchilar, haydovchilar va admin uchun to'liq yechimni taqdim etadi.

## 🎯 Platformalar

- ✅ Android (Flutter)
- ✅ iOS (Flutter)
- ✅ Admin Panel (Web)
- ✅ Driver App (Flutter)
- ✅ Passenger App (Flutter)

## 🛠️ Texnologiyalar

### Frontend
- **Flutter** - Cross-platform mobile development
- **Provider** - State management
- **Firebase** - Real-time database & notifications
- **Google Maps / Yandex Maps** - GPS tracking

### Backend
- **NestJS** - Node.js framework
- **PostgreSQL** - Primary database
- **Redis** - Caching & real-time data
- **WebSocket** - Real-time communication
- **JWT** - Authentication
- **AWS/Firebase** - Cloud services

### Security
- **AES-256** Encryption
- **HTTPS/TLS** - Secure communication
- **OTP** SMS verification
- **Biometric** Authentication (Face ID, Fingerprint)
- **Device Binding** - Anti-fraud measures
- **JWT** - Token-based authentication

## 📁 Folder Structure

```
SafarGo/
├── docs/                          # Documentation
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_DOCUMENTATION.md
│   ├── SECURITY.md
│   └── DEPLOYMENT.md
│
├── backend/                       # NestJS Backend
│   ├── src/
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── filters/
│   │   │   └── middleware/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── drivers/
│   │   │   ├── passengers/
│   │   │   ├── rides/
│   │   │   ├── payments/
│   │   │   ├── reviews/
│   │   │   ├── notifications/
│   │   │   ├── admin/
│   │   │   ├── maps/
│   │   │   └── analytics/
│   │   ├── database/
│   │   │   ├── entities/
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   ├── config/
│   │   ├── utils/
│   │   └── main.ts
│   ├── test/
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── flutter_passenger/             # Passenger App
│   ├── lib/
│   │   ├── config/
│   │   │   ├── app_config.dart
│   │   │   ├── routes.dart
│   │   │   └── theme.dart
│   │   ├── core/
│   │   │   ├── constants/
│   │   │   ├── errors/
│   │   │   ├── network/
│   │   │   ├── services/
│   │   │   ├── utils/
│   │   │   └── widgets/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── home/
│   │   │   ├── ride/
│   │   │   ├── maps/
│   │   │   ├── payments/
│   │   │   ├── profile/
│   │   │   ├── history/
│   │   │   ├── reviews/
│   │   │   └── support/
│   │   ├── providers/
│   │   ├── main.dart
│   │   └── app.dart
│   ├── pubspec.yaml
│   ├── analysis_options.yaml
│   └── README.md
│
├── flutter_driver/                # Driver App
│   ├── lib/
│   │   ├── config/
│   │   ├── core/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── onboarding/
│   │   │   ├── verification/
│   │   │   ├── home/
│   │   │   ├── rides/
│   │   │   ├── maps/
│   │   │   ├── earnings/
│   │   │   ├── profile/
│   │   │   ├── ratings/
│   │   │   └── support/
│   │   ├── providers/
│   │   ├── main.dart
│   │   └── app.dart
│   ├── pubspec.yaml
│   ├── analysis_options.yaml
│   └── README.md
│
├── flutter_admin/                 # Admin Web Panel
│   ├── lib/
│   │   ├── config/
│   │   ├── core/
│   │   ├── features/
│   │   │   ├── dashboard/
│   │   │   ├── users/
│   │   │   ├── drivers/
│   │   │   ├── payments/
│   │   │   ├── rides/
│   │   │   ├── analytics/
│   │   │   ├── verification/
│   │   │   ├── complaints/
│   │   │   └── settings/
│   │   ├── providers/
│   │   ├── main.dart
│   │   └── app.dart
│   ├── pubspec.yaml
│   ├── analysis_options.yaml
│   └── README.md
│
├── infra/                         # Infrastructure & DevOps
│   ├── docker/
│   │   ├── Dockerfile.backend
│   │   ├── Dockerfile.postgres
│   │   └── Dockerfile.redis
│   ├── kubernetes/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── configmap.yaml
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── nginx/
│       └── nginx.conf
│
├── scripts/                       # Automation Scripts
│   ├── setup.sh
│   ├── deploy.sh
│   ├── migrate.sh
│   └── test.sh
│
├── .github/
│   ├── workflows/
│   │   ├── ci-backend.yml
│   │   ├── ci-flutter.yml
│   │   └── cd-deploy.yml
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  profile_image_url TEXT,
  role ENUM('PASSENGER', 'DRIVER', 'ADMIN'),
  is_verified BOOLEAN DEFAULT false,
  otp_code VARCHAR(6),
  otp_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
```

### Drivers Table
```sql
CREATE TABLE drivers (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  passport_number VARCHAR(20) UNIQUE,
  passport_image_url TEXT,
  selfie_url TEXT,
  license_number VARCHAR(20) UNIQUE,
  license_image_url TEXT,
  license_expires_at TIMESTAMP,
  vehicle_id UUID,
  verification_status ENUM('PENDING', 'APPROVED', 'REJECTED'),
  is_active BOOLEAN DEFAULT false,
  total_rides INT DEFAULT 0,
  total_cancelled INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 5.0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Vehicles Table
```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY,
  driver_id UUID REFERENCES drivers(id),
  brand VARCHAR(50),
  model VARCHAR(50),
  year INT,
  color VARCHAR(30),
  license_plate VARCHAR(20) UNIQUE,
  vin VARCHAR(50) UNIQUE,
  vehicle_image_url TEXT,
  interior_image_url TEXT,
  front_image_url TEXT,
  back_image_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Rides Table
```sql
CREATE TABLE rides (
  id UUID PRIMARY KEY,
  passenger_id UUID REFERENCES users(id),
  driver_id UUID REFERENCES drivers(id),
  pickup_location POINT,
  dropoff_location POINT,
  pickup_address VARCHAR(255),
  dropoff_address VARCHAR(255),
  status ENUM('REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
  distance_km DECIMAL(10,2),
  estimated_fare DECIMAL(10,2),
  actual_fare DECIMAL(10,2),
  payment_method ENUM('CASH', 'CARD', 'WALLET'),
  payment_status ENUM('PENDING', 'COMPLETED', 'FAILED'),
  pickup_time TIMESTAMP,
  dropoff_time TIMESTAMP,
  duration_minutes INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  ride_id UUID REFERENCES rides(id),
  reviewer_id UUID REFERENCES users(id),
  reviewee_id UUID REFERENCES users(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_safe BOOLEAN,
  is_clean BOOLEAN,
  is_professional BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  ride_id UUID REFERENCES rides(id),
  user_id UUID REFERENCES users(id),
  amount DECIMAL(10,2),
  currency VARCHAR(3),
  payment_method ENUM('UZCARD', 'HUMO', 'CLICK', 'PAYME', 'UZUM', 'VISA', 'MASTERCARD'),
  transaction_id VARCHAR(255) UNIQUE,
  status ENUM('PENDING', 'SUCCESS', 'FAILED'),
  receipt_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Security Features

✅ AES-256 Encryption for sensitive data
✅ JWT Token Authentication with Refresh Tokens
✅ OTP SMS Verification
✅ Biometric Authentication (Face ID, Fingerprint)
✅ Device Binding & Jailbreak Detection
✅ SQL Injection Protection
✅ XSS Protection
✅ CSRF Protection
✅ Rate Limiting
✅ DDoS Protection
✅ HTTPS/TLS Encryption
✅ Admin Audit Logs

## 🤖 AI Features

✅ AI Driver Matching Algorithm
✅ AI Image Verification (Fake Detection)
✅ AI Fraud Detection System
✅ AI Spam Detection
✅ AI Toxic Comment Filter
✅ AI Fake GPS Detection
✅ AI Fake Account Detection
✅ AI Safety Monitoring

## 💳 Payment Methods

- Uzcard
- Humo
- Click
- Payme
- Uzum Bank
- Visa
- MasterCard
- Cash

## 📱 Features

### Passenger
- OTP Registration & Login
- Real-time GPS Map
- Auto Driver Matching
- Ride Booking
- Ride Cancellation
- Driver Live Location
- ETA Calculation
- Fare Estimation
- Promo Codes
- Cashback & Referral
- Saved Addresses
- Ride History
- Reviews & Ratings
- Emergency SOS
- Lost Items

### Driver
- Document Verification
- AI Image Verification
- Real-time Ride Requests
- Accept/Reject Rides
- GPS Navigation
- Earnings Dashboard
- Ride History
- Reviews & Ratings
- Schedule Rides
- Document Renewal
- Support System

### Admin
- User Management
- Driver Verification
- Payment Monitoring
- Ride Analytics
- Revenue Dashboard
- Complaint Center
- Promo Code Management
- Live Monitoring
- Audit Logs

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/asad132509-dev/SafarGo.git
cd SafarGo

# Backend Setup
cd backend
npm install
cp .env.example .env
npm run migration
npm run start

# Flutter Passenger App
cd ../flutter_passenger
flutter pub get
flutter run

# Flutter Driver App
cd ../flutter_driver
flutter pub get
flutter run

# Flutter Admin Panel
cd ../flutter_admin
flutter pub get
flutter run -d chrome
```

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Security](docs/SECURITY.md)
- [Deployment](docs/DEPLOYMENT.md)

## 👨‍💻 Development Team

- Senior Software Architect
- Senior Flutter Developer
- Senior Backend Developer (Node.js/NestJS)
- Senior UI/UX Designer
- Senior Cybersecurity Engineer
- DevOps Engineer

## 📄 License

MIT License - See LICENSE file for details

## 📞 Contact

For questions and support, please open an issue or contact us.

---

**SafarGo** - O'zbekiston uchun premium taxi xizmeti 🚕
