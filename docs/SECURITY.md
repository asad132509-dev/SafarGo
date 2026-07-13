# SafarGo - Security Architecture Documentation

## 🔐 Security Layers

### 1. Network Security

#### HTTPS/TLS 1.3
```
- All API communications encrypted with TLS 1.3
- Certificate pinning on mobile apps
- HSTS (HTTP Strict-Transport-Security) enabled
- Perfect forward secrecy enabled
```

#### API Gateway Security
```
- WAF (Web Application Firewall) rules
- DDoS protection (rate limiting)
- Request validation
- CORS policy enforcement
- Request timeout (30 seconds)
```

### 2. Authentication Security

#### JWT Token Strategy
```
Access Token (15 minutes):
  - Short expiration time
  - Contains user ID and role
  - Signed with RS256 algorithm
  - Revocable via blacklist

Refresh Token (30 days):
  - Stored securely in HTTP-only cookie
  - Database-backed for rotation
  - Device fingerprinting
  - One-time use after refresh

Token Storage (Mobile):
  - Encrypted Shared Preferences (Android)
  - Keychain (iOS)
  - Never stored in plain text
```

#### OTP Verification
```
Flow:
1. User requests OTP
2. Generate 6-digit OTP
3. Encrypt OTP in Redis (5-minute expiry)
4. Send via SMS gateway
5. User enters OTP
6. Verify against Redis
7. Mark user as verified
8. Invalidate OTP

Security Measures:
- Rate limit: 3 attempts per minute
- Lock after 5 failed attempts
- SMS delivery verification
- Brute force protection
```

#### Biometric Authentication
```
Supported Methods:
- Face ID (iOS)
- Touch ID (iOS)
- Fingerprint (Android)
- Face Recognition (Android)

Implementation:
1. Biometric data stored locally
2. Never transmitted to server
3. Device-level security
4. Fallback to password
5. Re-authentication for sensitive operations
```

### 3. Data Encryption

#### At Rest (AES-256-GCM)

```typescript
// Encryption example
import crypto from 'crypto';

class EncryptionService {
  private readonly key: Buffer;
  private readonly algorithm = 'aes-256-gcm';

  encrypt(plaintext: string): EncryptedData {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      iv: iv.toString('hex'),
      encryptedData: encrypted,
      authTag: authTag.toString('hex')
    };
  }

  decrypt(encryptedData: EncryptedData): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(encryptedData.iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

// Sensitive fields to encrypt:
- Phone numbers
- Passport numbers
- License numbers
- Bank account numbers
- Payment card details
- Personal identification numbers
```

#### In Transit
```
- All API calls over HTTPS/TLS 1.3
- End-to-end encryption for sensitive data
- Message authentication codes (HMAC)
```

### 4. Database Security

#### Connection Security
```
- SSL/TLS connection to PostgreSQL
- Connection pooling (pg-pool)
- Maximum pool size: 20 connections
- Connection timeout: 30 seconds
- Idle timeout: 30 seconds
```

#### Query Security
```
- Prepared statements (prevent SQL injection)
- Parameterized queries
- ORM (TypeORM) for query building
- Query timeout: 30 seconds
```

#### Access Control
```sql
-- Row-level security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_isolation ON users
  USING (id = current_user_id());

CREATE POLICY driver_self_access ON drivers
  USING (user_id = current_user_id());

CREATE POLICY admin_full_access ON users
  USING (current_user_role() = 'ADMIN');
```

#### Data Backup & Recovery
```
- Daily automated backups
- Point-in-time recovery (7 days)
- Encrypted backup storage
- Regular backup restoration tests
- Disaster recovery plan
```

### 5. API Security

#### Input Validation
```typescript
// Example: Request validation
import { IsEmail, IsPhoneNumber, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsPhoneNumber('UZ')
  phoneNumber: string;

  @MinLength(8)
  password: string;

  @IsEmail()
  email: string;
}

// Custom validation pipes
export class PhoneNumberPipe implements PipeTransform {
  transform(value: any) {
    const cleaned = value.replace(/\D/g, '');
    if (!this.isValidUzbekPhone(cleaned)) {
      throw new BadRequestException('Invalid phone number');
    }
    return cleaned;
  }

  private isValidUzbekPhone(phone: string): boolean {
    return /^(998|8)([0-9]{9})$/.test(phone);
  }
}
```

#### Rate Limiting
```typescript
// Global rate limiter
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts',
});
```

#### CORS Configuration
```typescript
import cors from 'cors';

const corsOptions: cors.CorsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600,
};

app.use(cors(corsOptions));
```

#### CSRF Protection
```typescript
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });

@UseGuards(csrfProtection)
@Post('/api/rides')
creatRide(@Body() createRideDto: CreateRideDto) {
  // Protected route
}
```

### 6. Mobile App Security

#### Jailbreak/Root Detection
```dart
// Flutter implementation
import 'package:fido2/fido2.dart';

class SecurityService {
  Future<bool> checkDeviceIntegrity() async {
    // Check for jailbreak (iOS)
    final jailbroken = await _checkJailbreak();
    
    // Check for root (Android)
    final rooted = await _checkRoot();
    
    if (jailbroken || rooted) {
      // Block app or show warning
      throw SecurityException('Device is compromised');
    }
    
    return true;
  }

  Future<bool> _checkJailbreak() async {
    // Implementation for iOS jailbreak detection
  }

  Future<bool> _checkRoot() async {
    // Implementation for Android root detection
  }
}
```

#### Certificate Pinning
```dart
// Flutter implementation
HttpClient httpClient = HttpClient();
httpClient.badCertificateCallback = (X509Certificate cert, String host, int port) {
  // Pin certificate
  final String certFingerprint = _getCertFingerprint(cert);
  return certFingerprint == _expectedFingerprint;
};
```

#### Secure Storage
```dart
// Flutter implementation
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  final _storage = FlutterSecureStorage();

  Future<void> saveToken(String token) async {
    await _storage.write(
      key: 'auth_token',
      value: token,
      aOptions: _getAndroidOptions(),
      iOptions: _getIOSOptions(),
    );
  }

  AndroidOptions _getAndroidOptions() => AndroidOptions(
    encryptedSharedPreferences: true,
  );

  IOSOptions _getIOSOptions() => IOSOptions(
    accessibility: KeychainAccessibility.first_available_when_unlocked,
  );
}
```

### 7. Image Verification

#### AI-Powered Verification
```
Flow:
1. User uploads image (passport, license, vehicle)
2. Image format validation (JPG, PNG)
3. File size check (< 5MB)
4. Compression (reduce to <1MB)
5. Upload to AI service
6. Document type detection
7. Quality assessment
8. Authenticity check
9. OCR data extraction
10. Freshness verification (not downloaded)
11. Liveness detection (for selfies)
12. Face matching (driver with vehicle owner)
13. Duplicate detection
14. Result storage
```

#### Fake Image Detection
```python
# Python AI Service
import tensorflow as tf
import numpy as np

class FakeImageDetector:
    def __init__(self):
        self.model = tf.keras.models.load_model('fake_detection_model.h5')
    
    def detect_fake(self, image_path: str) -> dict:
        # Preprocess image
        img = tf.keras.preprocessing.image.load_img(image_path, target_size=(256, 256))
        img_array = tf.keras.preprocessing.image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0
        
        # Predict
        prediction = self.model.predict(img_array)[0][0]
        
        return {
            'is_fake': prediction > 0.5,
            'confidence': float(prediction),
            'real_probability': 1 - prediction
        }
```

### 8. Fraud Detection

#### Anomaly Detection
```
Monitored Metrics:
- Unusual location jumps
- Multiple rides in short time
- Failed payment attempts
- Unusual ride patterns
- Geographic impossibilities
- Velocity checks (traveling too fast)
- Multiple account creation from same device
- Multiple login attempts from different locations
```

#### Machine Learning Model
```python
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

class FraudDetectionService:
    def __init__(self):
        self.model = IsolationForest(contamination=0.1)
        self.scaler = StandardScaler()
    
    def detect_fraud(self, ride_features: np.ndarray) -> bool:
        # Scale features
        scaled_features = self.scaler.transform([ride_features])
        
        # Predict
        prediction = self.model.predict(scaled_features)
        
        # -1 indicates anomaly (fraud)
        return prediction[0] == -1
```

### 9. Admin Controls

#### Audit Logging
```typescript
// Audit log decorator
export function AuditLog(action: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      
      await this.auditLogService.log({
        adminId: this.request.user.id,
        action,
        entityType: target.name,
        entityId: args[0]?.id,
        oldValues: args[0],
        newValues: result,
        ipAddress: this.request.ip,
        userAgent: this.request.headers['user-agent'],
        status: 'SUCCESS',
      });
      
      return result;
    };

    return descriptor;
  };
}
```

#### Permission-Based Access
```typescript
// Role-based access control
export enum UserRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  DRIVER = 'DRIVER',
  PASSENGER = 'PASSENGER',
}

export const Permissions = {
  [UserRole.ADMIN]: ['*'], // All permissions
  [UserRole.MODERATOR]: [
    'verify_drivers',
    'resolve_complaints',
    'manage_promo_codes',
  ],
  [UserRole.DRIVER]: [
    'view_own_profile',
    'accept_rides',
    'view_earnings',
  ],
  [UserRole.PASSENGER]: [
    'view_own_profile',
    'request_rides',
    'make_payments',
  ],
};

@UseGuards(AuthGuard)
@CheckPermission('verify_drivers')
@Post('/admin/verify-driver')
verifyDriver(@Body() verifyDto: VerifyDriverDto) {
  // Only users with verify_drivers permission can access
}
```

### 10. Compliance

#### Data Protection
- GDPR compliance (if operating in EU)
- Data deletion on request
- Privacy policy transparency
- Terms of service agreement
- Consent management

#### Regulations
- Transport regulation compliance
- Payment PCI-DSS compliance
- Accessibility WCAG 2.1 AA compliance

---

**Last Updated:** 2024
**Version:** 1.0.0
