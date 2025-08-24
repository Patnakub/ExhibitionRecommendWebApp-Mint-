# Database Schema Documentation

## 📊 โครงสร้างฐานข้อมูล

ระบบใช้ MongoDB โดยไม่มี migration scripts แต่ Mongoose จะสร้างโครงสร้างอัตโนมัติตาม Schema

### Collections หลัก:

#### 1. **users** - ข้อมูลผู้ใช้
```javascript
{
  username: String (unique, 4-20 ตัวอักษร)
  password: String (เข้ารหัสด้วย bcrypt)
  email: String (unique, รูปแบบอีเมล)
  gender: String ('male'|'female'|'other')
  birthdate: Date
  interests: [String] (1-3 ความสนใจ)
  role: String ('user'|'admin')
  isEmailVerified: Boolean
  created_at: Date (default: now)
  updated_at: Date (default: now)
  resetPin: String (optional)
  resetPinExpire: Date (optional)
  verifyToken: String (optional)
  verifyTokenExpire: Date (optional)
}
```

#### 2. **exhibitions** - ข้อมูลนิทรรศการ
```javascript
{
  title: String
  description: String  
  location: String
  start_date: String
  end_date: String
  start_date_obj: Date (มี index)
  end_date_obj: Date (มี index)
  categories: [String]
  event_slot_time: String
  ticket: String
  ticket_price: Mixed (default: null)
  url: String
  cover_picture: String
  image: String
  latitude: Number
  longitude: Number
  category_verified: Boolean (default: false)
}
```

#### 3. **reviews** - รีวิวและคะแนน
```javascript
{
  user_id: ObjectId (ref: User)
  exhibition_id: ObjectId (ref: Exhibition)
  rating: Number (1-5)
  review: String
  image_url: String
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

#### 4. **favorites** - รายการโปรด
```javascript
{
  user_id: ObjectId (ref: User)
  exhibition_id: ObjectId (ref: Exhibition)
  created_at: Date
}
// Unique index: user_id + exhibition_id
```

#### 5. **recommendations** - คำแนะนำสำหรับผู้ใช้
```javascript
{
  user_id: String (มี index)
  recommendations: [{
    event_id: String
    score: Number
  }]
  updated_at: Date
}
```

#### 6. **suggestions** - ข้อเสนอแนะนิทรรศการ
```javascript
{
  title: String (required)
  location: String (required)
  start_date: String (required)
  end_date: String
  event_slot_time: String
  categories: [String] (default: [])
  description: String (required)
  ticket: String (default: "ไม่ระบุ")
  ticket_price: [Number] (default: [])
  image_url: String (required)
  status: String (default: "pending", enum: 'pending'|'approved'|'rejected')
  timestamp: Date (default: now)
  reliability_score: Number (default: 1)
  latitude: Number (default: null)
  longitude: Number (default: null)
  created_at: Date (default: now)
}
```

#### 7. **categories** - หมวดหมู่นิทรรศการ
```javascript
{
  name: String (required)
}
```

#### 8. **bus** (collection name: 'bus') - ป้ายรถเมล์ BTS/MRT
```javascript
{
  stop_id: String
  stop_name: String
  latitude: Number
  longitude: Number
  routes: [
    {
      route_id: String
      short_name: String
      long_name: String
    }
  ]
  min_price: Number
  max_price: Number
}
```

#### 9. **notificationlogs** - บันทึกการแจ้งเตือน
```javascript
{
  user_id: ObjectId (ref: 'User', required)
  exhibition_id: ObjectId (ref: 'Exhibition', required)
  sent_at: Date (default: now)
}
// Unique index: user_id + exhibition_id (ป้องกันการส่งซ้ำ)
```

## 🔗 Relationships

### User Relations:
- `users` → `favorites` (1:many)
- `users` → `reviews` (1:many)
- `users` → `recommendations` (1:1)
- `users` → `notificationlogs` (1:many)

### Exhibition Relations:
- `exhibitions` → `favorites` (1:many)
- `exhibitions` → `reviews` (1:many)
- `exhibitions` → `notificationlogs` (1:many)

### Category Relations:
- `categories` → `exhibitions.categories` (many:many)
- `categories` → `suggestions.categories` (many:many)

## 📋 Indexes

### Performance Indexes:
```javascript
// Users
{ username: 1 }  // unique
{ email: 1 }     // unique

// Exhibitions
{ start_date_obj: 1 }
{ end_date_obj: 1 }
{ categories: 1 }

// Favorites
{ user_id: 1, exhibition_id: 1 }  // unique compound

// Reviews
{ exhibition_id: 1 }
{ user_id: 1 }

// Recommendations
{ user_id: 1 }  // unique

// NotificationLogs
{ user_id: 1, exhibition_id: 1 }  // unique compound
```

## 🛡️ Data Validation

### User Validation:
- Username: 4-20 characters, alphanumeric + underscore
- Email: Valid email format
- Password: Minimum 4 characters (hashed with bcrypt)
- Interests: 1-3 items maximum
- Birthdate: Must be in the past

### Exhibition Validation:
- Dates: start_date_obj < end_date_obj
- Coordinates: Valid latitude/longitude ranges
- Categories: Must exist in categories collection

### Review Validation:
- Rating: 1-5 numeric range
- One review per user per exhibition
- Cannot review upcoming exhibitions

---

[← กลับไป README หลัก](../README.md) | [ดู API Documentation →](API.md)