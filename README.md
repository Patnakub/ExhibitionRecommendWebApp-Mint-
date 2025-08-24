# Exhibition Recommendation Web Application

ระบบแนะนำนิทรรศการที่ใช้ Machine Learning และ Elasticsearch สำหรับให้คำแนะนำที่ตรงใจผู้ใช้ พร้อมระบบรีวิว, รายการโปรด, และการจัดการผู้ดูแลระบบ

## 🚀 คุณสมบัติหลัก

- **ระบบแนะนำอัจฉริยะ**: ใช้ Machine Learning ประมวลผลความชอบของผู้ใช้
- **ค้นหาข้อมูลขั้นสูง**: Elasticsearch พร้อมรองรับภาษาไทย  
- **ระบบสมาชิก**: สมัครสมาชิก, เข้าสู่ระบบ, จัดการโปรไฟล์
- **รายการโปรด**: บันทึกนิทรรศการที่สนใจ
- **ระบบรีวิว**: ให้คะแนนและความเห็นพร้อมอัปโหลดรูปภาพ
- **ผู้ดูแลระบบ**: จัดการนิทรรศการและผู้ใช้
- **แนะนำเส้นทาง**: เชื่อมต่อข้อมูล BTS/MRT และ Google Maps
- **แจ้งเตือนอัตโนมัติ**: แจ้งเตือนนิทรรศการที่จะสิ้นสุด

## 🛠️ เทคโนโลยีที่ใช้

### Frontend  
- **Next.js 15.x** (React Framework)
- **React 19.x** + **TypeScript**
- **Tailwind CSS 4.x** สำหรับ Styling
- **Material-UI (MUI)** Components
- **Framer Motion** สำหรับ Animations
- **Axios** สำหรับ API Calls
- **Splide.js** สำหรับ Image Sliders
- **Styled Components** สำหรับ Dynamic Styling

### Backend
- **Node.js** + **Express.js 5.x**
- **MongoDB** + **Mongoose**
- **Elasticsearch 8.x** พร้อม Thai Analyzer
- **JWT Authentication**
- **Google Maps API** สำหรับ Geolocation
- **Machine Learning** (Python)
- **Docker** สำหรับ Elasticsearch

## 📋 ข้อกำหนดระบบ

- **Node.js** v16 หรือสูงกว่า
- **MongoDB** v4.4 หรือสูงกว่า
- **Docker** สำหรับ Elasticsearch
- **Python** v3.8+ สำหรับ ML components
- **Google Maps API Key** (สำหรับ Geolocation)

## 🚀 การติดตั้งระบบ Frontend

### 1. เตรียมการเบื้องต้น

```bash
# Clone repository (ถ้ายังไม่ได้ clone)
git clone <repository-url>
cd ExhibitionRecommendWebApp-Mint-

# เข้าไปใน frontend directory
cd frontend
```

### 2. ติดตั้ง Dependencies

```bash
# ติดตั้ง Node.js packages
npm install

# หรือใช้ yarn
yarn install
```

### 3. ตั้งค่า Environment Variables

```bash
# คัดลอกไฟล์ตัวอย่าง
cp .env.example .env.local

# แก้ไขค่าต่าง ๆ ให้เหมาะสม
nano .env.local
# หรือใช้ text editor อื่น ๆ
```

แก้ไขไฟล์ `.env.local`:

```env
# API Backend URL
NEXT_PUBLIC_API_BASE=http://localhost:5000

# Google Maps API Key (สำหรับแสดงแผนที่และเส้นทาง)
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_maps_api_key_here
```

### 4. เริ่มต้นระบบ Development

```bash
# เริ่ม development server
npm run dev

# หรือใช้ Turbopack (faster)
npm run dev --turbopack
```

เว็บไซต์จะทำงานที่ `http://localhost:3000`

## 🚀 การติดตั้งระบบ Backend

### 1. เตรียมการเบื้องต้น

```bash
# Clone repository (ถ้ายังไม่ได้ clone)
git clone <repository-url>
cd ExhibitionRecommendWebApp-Mint-

# เข้าไปใน backend directory
cd backend
```

### 2. ติดตั้ง Dependencies

```bash
# ติดตั้ง Node.js packages
npm install

# เตรียม Python environment สำหรับ ML
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux  
source venv/bin/activate

# ติดตั้ง Python packages
pip install numpy pandas scikit-learn
```

### 3. ตั้งค่า Environment Variables

```bash
# คัดลอกไฟล์ตัวอย่าง
cp .env.example .env

# แก้ไขค่าต่าง ๆ ให้เหมาะสม
nano .env
# หรือใช้ text editor อื่น ๆ
```

แก้ไขไฟล์ `.env`:

```env
# Server Configuration
PORT=5000
BASE_URL=http://localhost:5000
CLIENT_BASE_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/exhibition_db
MONGO_DB_NAME=exhibition_db

# JWT Secret Key (เปลี่ยนเป็นค่าที่ซับซ้อนใน production)
JWT_SECRET=your_super_secret_jwt_key_here

# Elasticsearch Configuration
ELASTIC_NODE=http://127.0.0.1:9200
ELASTICSEARCH_URL=http://localhost:9200

# Email Configuration (สำหรับแจ้งเตือน)
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here

# Google Maps API (สำหรับ Geolocation และ Route Planning)
GOOGLE_API_KEY=your_google_maps_api_key_here

# Optional: Skip Elasticsearch sync during development
# SKIP_ELASTIC_SYNC=true
```

### 4. เริ่มต้น MongoDB

```bash
# เริ่มต้น MongoDB service
# Windows (ถ้าติดตั้งเป็น service)
net start MongoDB

# macOS (ถ้าติดตั้งผ่าน Homebrew)
brew services start mongodb-community

# หรือเรียกใช้โดยตรง
mongod
```

### 5. เริ่มต้น Elasticsearch ด้วย Docker

```bash
# เข้าไปใน elasticsearch-thai directory
cd elasticsearch-thai

# Build Docker image พร้อม Thai analyzer
docker build -t elasticsearch-thai .

# เรียกใช้ Elasticsearch container
docker run -d \
  --name elasticsearch-thai \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
  elasticsearch-thai

# ตรวจสอบว่า Elasticsearch ทำงาน
curl http://localhost:9200
```

### 6. การขอ Google Maps API Key

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้าง Project ใหม่หรือเลือก Project ที่มี
3. เปิดใช้งาน APIs:
   - **Geocoding API**
   - **Places API** 
   - **Directions API**
4. สร้าง API Key ใน Credentials
5. เพิ่ม API Key ลงในไฟล์ `.env`

### 7. เริ่มต้นระบบ

```bash
# กลับไปที่ backend directory
cd ../

# เริ่มต้นเซิร์ฟเวอร์
node server.js
```

เซิร์ฟเวอร์จะทำงานที่ `http://localhost:5000`

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
  latitude: Number
  longitude: Number
  ticket_price: Mixed
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

### 🔒 Authentication Headers

สำหรับ API ที่ต้องการ authentication ให้ส่ง header:
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ⚙️ การจัดการระบบ

### Automated Tasks (Cron Jobs)
```bash
# สร้างคำแนะนำใหม่
node cron/recommend_cron.js

# แจ้งเตือนนิทรรศการที่จะสิ้นสุด
node cron/notifyEndingExhibitions.js

# เรียกใช้ batch scripts (Windows)
run_notify_task.bat
```

### การรีสตาร์ทเซิร์ฟเวอร์
```bash
# Windows
restart_server.bat

# Manual restart
npm start
# หรือ
node server.js
```

### การตรวจสอบสถานะระบบ
```bash
# ตรวจสอบ MongoDB
mongo
> show dbs
> use exhibition_db
> show collections

# ตรวจสอบ Elasticsearch
curl http://localhost:9200/_cluster/health

# ตรวจสอบ Google Maps API
curl "https://maps.googleapis.com/maps/api/geocode/json?address=Bangkok&key=YOUR_API_KEY"
```

## 🔐 ความปลอดภัย

### Security Features
- **JWT Authentication**: ป้องกันการเข้าถึงโดยไม่ได้รับอนุญาต
- **Password Hashing**: bcrypt สำหรับเข้ารหัสรหัสผ่าน
- **Input Validation**: ตรวจสอบข้อมูลนำเข้าทุกจุด
- **CORS Configuration**: จำกัดการเข้าถึงจาก domain อื่น
- **API Key Protection**: Google API Key ถูกเก็บใน environment variables

## 📚 เอกสารเพิ่มเติม

### API Reference
ดูเอกสาร API เพิ่มเติมใน source code ของแต่ละ controller:
- `controllers/auth.controller.js`: Authentication APIs
- `controllers/exhibition.controller.js`: Exhibition APIs  
- `controllers/recommendation.controller.js`: Recommendation APIs
- `controllers/route.controller.js`: Geolocation & Route APIs

### Configuration Files
- `.env.example`: ตัวอย่างการตั้งค่า environment variables
- `elasticsearch-thai/Dockerfile`: การตั้งค่า Elasticsearch พร้อม Thai support
- `models/`: Database schemas และ relationships

---