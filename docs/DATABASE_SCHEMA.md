# SafarGo - Database Schema Documentation

## 🗄️ Complete Database Schema

### 1. Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  profile_image_url TEXT,
  role ENUM('PASSENGER', 'DRIVER', 'ADMIN') NOT NULL DEFAULT 'PASSENGER',
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  otp_code VARCHAR(6),
  otp_expires_at TIMESTAMP,
  device_id VARCHAR(255),
  device_name VARCHAR(255),
  device_os VARCHAR(50),
  device_os_version VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  CONSTRAINT valid_phone CHECK (phone_number ~ '^\+?[0-9]{10,15}$')
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### 2. Drivers Table

```sql
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  passport_number VARCHAR(20) UNIQUE NOT NULL,
  passport_issue_date DATE,
  passport_expiry_date DATE,
  passport_image_url TEXT NOT NULL,
  passport_image_sha256 VARCHAR(64),
  selfie_url TEXT NOT NULL,
  selfie_image_sha256 VARCHAR(64),
  license_number VARCHAR(20) UNIQUE NOT NULL,
  license_issue_date DATE,
  license_expiry_date DATE,
  license_image_url TEXT NOT NULL,
  license_image_sha256 VARCHAR(64),
  tech_passport_number VARCHAR(50),
  tech_passport_image_url TEXT,
  tech_passport_expires_at DATE,
  vehicle_id UUID REFERENCES vehicles(id),
  verification_status ENUM('PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW') DEFAULT 'PENDING',
  rejection_reason TEXT,
  is_active BOOLEAN DEFAULT false,
  is_online BOOLEAN DEFAULT false,
  current_location POINT,
  location_updated_at TIMESTAMP,
  total_rides INT DEFAULT 0,
  total_completed INT DEFAULT 0,
  total_cancelled INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_ratings INT DEFAULT 0,
  cancellation_rate DECIMAL(5,2) DEFAULT 0.0,
  response_time_seconds INT DEFAULT 0,
  years_of_experience INT,
  bank_account_number VARCHAR(50),
  bank_name VARCHAR(100),
  account_holder_name VARCHAR(255),
  is_preferred BOOLEAN DEFAULT false,
  document_verified_at TIMESTAMP,
  verified_by_admin_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_drivers_user_id ON drivers(user_id);
CREATE INDEX idx_drivers_verification_status ON drivers(verification_status);
CREATE INDEX idx_drivers_is_online ON drivers(is_online);
CREATE INDEX idx_drivers_rating ON drivers(rating DESC);
CREATE INDEX idx_drivers_location ON drivers USING GIST(current_location);
CREATE INDEX idx_drivers_vehicle_id ON drivers(vehicle_id);
```

### 3. Vehicles Table

```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  brand VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INT NOT NULL,
  color VARCHAR(30),
  license_plate VARCHAR(20) UNIQUE NOT NULL,
  vin VARCHAR(50) UNIQUE NOT NULL,
  vehicle_type ENUM('SEDAN', 'SUV', 'HATCHBACK', 'VAN') DEFAULT 'SEDAN',
  capacity INT DEFAULT 4,
  vehicle_image_url TEXT,
  vehicle_image_sha256 VARCHAR(64),
  interior_image_url TEXT,
  interior_image_sha256 VARCHAR(64),
  front_image_url TEXT,
  front_image_sha256 VARCHAR(64),
  back_image_url TEXT,
  back_image_sha256 VARCHAR(64),
  is_verified BOOLEAN DEFAULT false,
  insurance_number VARCHAR(50),
  insurance_expiry_date DATE,
  insurance_document_url TEXT,
  inspection_date DATE,
  inspection_expiry_date DATE,
  mileage INT DEFAULT 0,
  registration_number VARCHAR(50),
  registration_document_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_vehicles_driver_id ON vehicles(driver_id);
CREATE INDEX idx_vehicles_license_plate ON vehicles(license_plate);
CREATE INDEX idx_vehicles_is_verified ON vehicles(is_verified);
```

### 4. Rides Table

```sql
CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passenger_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES drivers(id),
  pickup_location POINT NOT NULL,
  dropoff_location POINT NOT NULL,
  pickup_address VARCHAR(500) NOT NULL,
  dropoff_address VARCHAR(500) NOT NULL,
  pickup_coordinates JSONB,
  dropoff_coordinates JSONB,
  status ENUM('REQUESTED', 'ACCEPTED', 'DRIVER_ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'REQUESTED',
  ride_type ENUM('ECONOMY', 'COMFORT', 'PREMIUM') DEFAULT 'ECONOMY',
  distance_km DECIMAL(10,2),
  estimated_fare DECIMAL(10,2),
  actual_fare DECIMAL(10,2),
  discount_amount DECIMAL(10,2) DEFAULT 0,
  tip_amount DECIMAL(10,2) DEFAULT 0,
  total_fare DECIMAL(10,2),
  payment_method ENUM('CASH', 'CARD', 'WALLET', 'UZCARD', 'HUMO', 'CLICK', 'PAYME') NOT NULL,
  payment_status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
  promo_code_id UUID REFERENCES promo_codes(id),
  requested_at TIMESTAMP,
  accepted_at TIMESTAMP,
  arrived_at TIMESTAMP,
  pickup_time TIMESTAMP,
  dropoff_time TIMESTAMP,
  estimated_duration_minutes INT,
  actual_duration_minutes INT,
  cancellation_reason TEXT,
  cancelled_by ENUM('PASSENGER', 'DRIVER', 'SYSTEM'),
  cancelled_at TIMESTAMP,
  notes TEXT,
  is_shared BOOLEAN DEFAULT false,
  shared_with_passenger_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_rides_passenger_id ON rides(passenger_id);
CREATE INDEX idx_rides_driver_id ON rides(driver_id);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_payment_status ON rides(payment_status);
CREATE INDEX idx_rides_created_at ON rides(created_at DESC);
CREATE INDEX idx_rides_pickup ON rides USING GIST(pickup_location);
CREATE INDEX idx_rides_dropoff ON rides USING GIST(dropoff_location);
```

### 5. Reviews Table

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL UNIQUE REFERENCES rides(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  comment_hash VARCHAR(64),
  is_toxic BOOLEAN DEFAULT false,
  toxicity_score DECIMAL(3,2),
  comment_flagged BOOLEAN DEFAULT false,
  comment_flag_reason TEXT,
  is_safe BOOLEAN,
  is_clean BOOLEAN,
  is_professional BOOLEAN,
  would_ride_again BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_ride_id ON reviews(ride_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_is_toxic ON reviews(is_toxic);
```

### 6. Payments Table

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'UZS',
  payment_method ENUM('UZCARD', 'HUMO', 'CLICK', 'PAYME', 'UZUM', 'VISA', 'MASTERCARD', 'CASH') NOT NULL,
  payment_gateway VARCHAR(50),
  transaction_id VARCHAR(255) UNIQUE,
  merchant_transaction_id VARCHAR(255),
  status ENUM('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED') DEFAULT 'PENDING',
  error_code VARCHAR(50),
  error_message TEXT,
  receipt_url TEXT,
  receipt_number VARCHAR(50),
  commission_amount DECIMAL(10,2),
  platform_fee DECIMAL(10,2),
  net_amount DECIMAL(10,2),
  refund_id VARCHAR(255),
  refund_amount DECIMAL(10,2),
  refund_reason TEXT,
  refund_at TIMESTAMP,
  payment_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_payments_ride_id ON payments(ride_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
```

### 7. Promo Codes Table

```sql
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type ENUM('PERCENTAGE', 'FIXED_AMOUNT') NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  max_discount_amount DECIMAL(10,2),
  min_ride_amount DECIMAL(10,2),
  usage_limit INT,
  used_count INT DEFAULT 0,
  per_user_limit INT DEFAULT 1,
  valid_from TIMESTAMP NOT NULL,
  valid_until TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true,
  applicable_user_type ENUM('NEW', 'EXISTING', 'ALL') DEFAULT 'ALL',
  applicable_ride_type ENUM('ECONOMY', 'COMFORT', 'PREMIUM', 'ALL') DEFAULT 'ALL',
  created_by_admin_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_is_active ON promo_codes(is_active);
CREATE INDEX idx_promo_codes_valid_from ON promo_codes(valid_from);
```

### 8. Saved Locations Table

```sql
CREATE TABLE saved_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location_type ENUM('HOME', 'WORK', 'FAVORITE', 'OTHER') NOT NULL,
  address VARCHAR(500) NOT NULL,
  coordinates POINT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  label VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_saved_locations_user_id ON saved_locations(user_id);
CREATE INDEX idx_saved_locations_coordinates ON saved_locations USING GIST(coordinates);
```

### 9. Notifications Table

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type ENUM('RIDE_REQUEST', 'RIDE_ACCEPTED', 'RIDE_COMPLETED', 'PAYMENT_CONFIRMATION', 'REVIEW_REQUEST', 'MESSAGE', 'PROMO', 'SYSTEM') NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

### 10. Admin Audit Logs Table

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  status VARCHAR(50),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
```

### 11. Complaints Table

```sql
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID REFERENCES rides(id),
  complainant_id UUID NOT NULL REFERENCES users(id),
  defendant_id UUID NOT NULL REFERENCES users(id),
  complaint_type ENUM('BEHAVIOR', 'SAFETY', 'CLEANLINESS', 'ROUTE', 'PAYMENT', 'OTHER') NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
  status ENUM('OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED', 'REJECTED') DEFAULT 'OPEN',
  resolution TEXT,
  compensation_offered DECIMAL(10,2),
  assigned_to_admin_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_complaints_complainant_id ON complaints(complainant_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_severity ON complaints(severity);
```

### 12. Referrals Table

```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id),
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  referred_user_id UUID REFERENCES users(id),
  referral_type ENUM('PASSENGER', 'DRIVER') NOT NULL,
  reward_amount DECIMAL(10,2),
  reward_type ENUM('CASHBACK', 'CREDIT', 'DISCOUNT') DEFAULT 'CREDIT',
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referral_code ON referrals(referral_code);
CREATE INDEX idx_referrals_is_completed ON referrals(is_completed);
```

## 📊 ER Diagram

```
┌─────────────────────┐
│      Users          │
├─────────────────────┤
│ id (PK)             │
│ phone_number        │
│ email               │
│ password_hash       │
│ full_name           │
│ role                │
│ is_verified         │
│ created_at          │
└─────────────────────┘
         │
    ┌────┴────┬────────────┐
    ▼         ▼            ▼
┌───────┐ ┌────────┐  ┌───────────┐
│Drivers│ │Reviews │  │Complaints │
├───────┤ ├────────┤  ├───────────┤
│ user_id───reviewer_id complainant_id
│ passport  ride_id    ride_id
│ license   rating     complaint_type
│ vehicle_id           status
│ rating               │
└───┬───┘ └────────┘  └───────────┘
    │       │
    │       └────────┐
    │                │
    ▼                ▼
┌──────────┐    ┌─────────┐
│ Vehicles │    │ Rides   │
├──────────┤    ├─────────┤
│ driver_id───passenger_id
│ brand      driver_id
│ model      pickup_location
│ year       dropoff_location
│ plates     status
│ vin        payment_method
└──────────┘    └──┬──────┘
                   │
            ┌──────┴───────┐
            ▼              ▼
        ┌─────────┐   ┌──────────┐
        │Payments │   │SavedLocs │
        ├─────────┤   ├──────────┤
        │ ride_id │   │ user_id  │
        │ user_id │   │ address  │
        │ amount  │   │location_ │
        │ status  │   │ type     │
        └─────────┘   └──────────┘
```

---

**Last Updated:** 2024
**Version:** 1.0.0
