# API Documentation

## 🔧 การใช้งาน API

### 🔐 Authentication APIs (`/auth`)

#### สมัครสมาชิก
```bash
POST /auth/register
Content-Type: application/json
Body: {
  "username": "john_doe",
  "password": "password123", 
  "email": "john@example.com",
  "gender": "male",
  "birthdate": "1990-01-01",
  "interests": ["ศิลปะ", "ประวัติศาสตร์"]
}
```

#### เข้าสู่ระบบ
```bash
POST /auth/login  
Content-Type: application/json
Body: {
  "username": "john_doe",
  "password": "password123"
}
Response: {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "username": "john_doe", "role": "user" }
}
```

#### ตรวจสอบ Session
```bash
GET /auth/session
Headers: { "Authorization": "Bearer <token>" }
```

#### เปลี่ยนรหัสผ่าน
```bash
POST /auth/change-password
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "currentPassword": "oldpass123",
  "newPassword": "newpass456"
}
```

#### รีเซ็ตรหัสผ่าน
```bash
# ขอ PIN รีเซ็ต
POST /auth/request-reset
Body: { "email": "john@example.com" }

# ยืนยัน PIN และตั้งรหัสใหม่
POST /auth/confirm-reset
Body: {
  "email": "john@example.com",
  "pin": "123456",
  "newPassword": "newpass789"
}
```

#### จัดการอีเมล
```bash
# ยืนยันอีเมล
GET /auth/verify-email?token=<verification_token>

# ส่งอีเมลยืนยันใหม่
POST /auth/resend-verification
Body: { "email": "john@example.com" }

# ตรวจสอบข้อมูลซ้ำ
POST /auth/check-duplicate
Body: { "field": "username", "value": "john_doe" }
# หรือ { "field": "email", "value": "john@example.com" }
```

#### ข้อมูลผู้ใช้
```bash
GET /auth/me
Headers: { "Authorization": "Bearer <token>" }
```

---

### 🎨 Exhibition APIs (`/exhibitions`)

#### ดูนิทรรศการทั้งหมด
```bash
GET /exhibitions
Query Parameters:
  ?skip=0&limit=10&category=ศิลปะ&status=ongoing
```

#### ค้นหานิทรรศการ  
```bash
GET /exhibitions/search?q=<keyword>
Example: GET /exhibitions/search?q=ศิลปะร่วมสมัย
```

#### ดูรายละเอียดนิทรรศการ
```bash
GET /exhibitions/:id
Example: GET /exhibitions/507f1f77bcf86cd799439011
```

#### นิทรรศการตามสถานะ
```bash
# กำลังจัดแสดง
GET /exhibitions/ongoing

# กำลังจะจัด  
GET /exhibitions/upcoming
```

#### ข้อมูลการเดินทาง
```bash
# ป้ายรถเมล์ใกล้เคียง (จากฐานข้อมูล)
GET /exhibitions/:id/nearby-bus

# ป้ายรถเมล์ใกล้เคียง (จาก Google)  
GET /exhibitions/:id/google-bus-stops
```

---

### ❤️ Favorites APIs (`/favorites`)

#### เพิ่ม/ลบรายการโปรด
```bash
# เพิ่มรายการโปรด
POST /favorites
Headers: { "Authorization": "Bearer <token>" }
Body: { "exhibition_id": "507f1f77bcf86cd799439011" }

# ลบรายการโปรด
DELETE /favorites/:exhibition_id
Headers: { "Authorization": "Bearer <token>" }
```

#### ดูรายการโปรด
```bash
GET /favorites
Headers: { "Authorization": "Bearer <token>" }
Response: [
  {
    "_id": "...",
    "exhibition_id": {
      "title": "นิทรรศการศิลปะ",
      "location": "หอศิลป์",
      "start_date": "2025-01-01"
    },
    "created_at": "2025-01-15T10:00:00Z"
  }
]
```

#### ตรวจสอบสถานะโปรด
```bash
GET /favorites/check/:exhibition_id
Headers: { "Authorization": "Bearer <token>" }
Response: { "favorited": true }
```

---

### ⭐ Review APIs (`/reviews`)

#### เขียนรีวิว
```bash
POST /reviews
Headers: { "Authorization": "Bearer <token>" }
Content-Type: multipart/form-data
Body: FormData {
  exhibition_id: "507f1f77bcf86cd799439011",
  rating: 5,
  review: "นิทรรศการดีมาก แนะนำเลย!",
  image: <file> (optional)
}
```

#### ดูรีวิวของนิทรรศการ
```bash  
GET /reviews/:exhibitionId
Response: [
  {
    "_id": "...",
    "rating": 5,
    "review": "นิทรรศการดีมาก",
    "image_url": "/uploads/reviews/123.jpg",
    "user_id": { "username": "john_doe" },
    "createdAt": "2025-01-15T10:00:00Z"
  }
]
```

#### จัดการรีวิวของตนเอง
```bash
# ดูรีวิวทั้งหมดของตนเอง
GET /reviews/me/all  
Headers: { "Authorization": "Bearer <token>" }

# แก้ไขรีวิว
PUT /reviews/:reviewId
Headers: { "Authorization": "Bearer <token>" }
Content-Type: multipart/form-data

# ดูรีวิวเฉพาะ ID
GET /reviews/id/:reviewId
```

---

### 🤖 Recommendation APIs (`/recommendations`)

```bash
GET /recommendations/:userId
Headers: { "Authorization": "Bearer <token>" }
Response: [
  {
    "event_id": "507f1f77bcf86cd799439011", 
    "score": 0.95,
    "exhibition_details": {
      "title": "นิทรรศการแนะนำ",
      "location": "หอศิลป์",
      "categories": ["ศิลปะ"]
    }
  }
]
```

---

### 🚌 Route/Transportation APIs (`/bus-routes`)

#### แนะนำเส้นทาง
```bash
GET /bus-routes/suggest-route
Query Parameters:
  ?userLat=13.7563&userLng=100.5018&destLat=13.7467&destLng=100.5342

POST /bus-routes/suggest-route-from-stops
Body: {
  "userLat": 13.7563,
  "userLng": 100.5018, 
  "destLat": 13.7467,
  "destLng": 100.5342
}
```

#### ดูป้ายรถเมล์ทั้งหมด
```bash
GET /bus-routes/all-stops
Response: [
  {
    "stop_id": "BTS_S1",
    "stop_name": "สยาม",
    "latitude": 13.7456,
    "longitude": 100.5344,
    "routes": [...]
  }
]
```

---

### 💡 Suggestion APIs (`/suggestions`)

#### เสนอแนะนิทรรศการ
```bash
POST /suggestions
Headers: { "Authorization": "Bearer <token>" }
Content-Type: multipart/form-data
Body: FormData {
  title: "นิทรรศการใหม่",
  location: "พิพิธภัณฑ์แห่งใหม่",
  start_date: "2025-03-01",
  end_date: "2025-03-31",
  description: "รายละเอียดนิทรรศการ",
  categories: ["ศิลปะ", "ประวัติศาสตร์"],
  ticket: "ฟรี",
  image: <file>
}
```

---

### 🏷️ Category APIs (`/categories`)

```bash
GET /categories
Response: [
  { "_id": "...", "name": "ศิลปะ" },
  { "_id": "...", "name": "ประวัติศาสตร์" },
  { "_id": "...", "name": "วิทยาศาสตร์" }
]
```

---

### 👨‍💼 Admin APIs (`/admin`) 
*ต้อง login เป็น admin เท่านั้น*

#### จัดการข้อเสนอแนะ
```bash
# ดูข้อเสนอแนะที่รอพิจารณา
GET /admin/suggestions/pending
Headers: { "Authorization": "Bearer <admin_token>" }

# อนุมัติข้อเสนอแนะ  
PUT /admin/suggestions/:id/approve
Headers: { "Authorization": "Bearer <admin_token>" }

# ลบข้อเสนอแนะ
DELETE /admin/suggestions/:id
Headers: { "Authorization": "Bearer <admin_token>" }

# แก้ไขหมวดหมู่ของข้อเสนอแนะ
PUT /admin/suggestions/:id/category
Headers: { "Authorization": "Bearer <admin_token>" }
Body: { "categories": ["ศิลปะ", "ประวัติศาสตร์"] }
```

#### จัดการนิทรรศการ
```bash
# ดูนิทรรศการที่ยังไม่ได้จำแนกหมวดหมู่
GET /admin/exhibitions/others
Headers: { "Authorization": "Bearer <admin_token>" }

# แก้ไขหมวดหมู่นิทรรศการ
PUT /admin/exhibitions/:id/category  
Headers: { "Authorization": "Bearer <admin_token>" }
Body: { "categories": ["ศิลปะ"] }

# ยืนยันหมวดหมู่ "อื่นๆ"
PUT /admin/exhibitions/:id/confirm-others
Headers: { "Authorization": "Bearer <admin_token>" }
```

---

### 📄 Static File APIs

#### หน้าเว็บ
```bash
GET /                    # -> login.html
GET /home.html           # หน้าหลัก
GET /register.html       # สมัครสมาชิก  
GET /search.html         # ค้นหา
GET /exhibition.html     # รายละเอียดนิทรรศการ
GET /account.html        # จัดการบัญชี
GET /admin.html          # แผงควบคุมแอดมิน
GET /verify_success.html # ยืนยันอีเมลสำเร็จ
```

#### ไฟล์ที่อัปโหลด
```bash
GET /uploads/reviews/:filename    # รูปภาพรีวิว
GET /uploads/suggestions/:filename # รูปภาพข้อเสนอแนะ
```

---

## 🔒 Authentication Headers

สำหรับ API ที่ต้องการ authentication ให้ส่ง header:
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📋 HTTP Status Codes

- `200` - สำเร็จ
- `201` - สร้างข้อมูลสำเร็จ  
- `400` - ข้อมูลไม่ถูกต้อง
- `401` - ไม่ได้รับอนุญาต (ไม่มี token หรือ token หมดอายุ)
- `403` - ไม่มีสิทธิ์เข้าถึง (ไม่ใช่ admin)
- `404` - ไม่พบข้อมูล
- `500` - ข้อผิดพลาดเซิร์ฟเวอร์

## 📝 ตัวอย่างการใช้งาน

```javascript
// Login และเก็บ token
const loginResponse = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'john_doe', password: 'password123' })
});
const { token } = await loginResponse.json();

// ใช้ token เรียก API อื่น
const favorites = await fetch('/favorites', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 🚦 Rate Limiting

- **General APIs**: 100 requests/minute per IP
- **Auth APIs**: 10 requests/minute per IP
- **File Upload**: 5 uploads/minute per user
- **Admin APIs**: 200 requests/minute per admin

## 🔧 Error Handling

### Standard Error Response:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "validation details"
  }
}
```

### Common Error Codes:
- `INVALID_TOKEN` - JWT token ไม่ถูกต้องหรือหมดอายุ
- `VALIDATION_ERROR` - ข้อมูลไม่ผ่านการตรวจสอบ
- `DUPLICATE_ENTRY` - ข้อมูลซ้ำ (username, email)
- `RESOURCE_NOT_FOUND` - ไม่พบข้อมูลที่ขอ
- `INSUFFICIENT_PERMISSIONS` - ไม่มีสิทธิ์เข้าถึง

---

[← กลับไป README หลัก](../README.md) | [ดู Database Schema →](DATABASE.md)