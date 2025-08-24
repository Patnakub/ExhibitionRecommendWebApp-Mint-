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
docker run -d --name elasticsearch-thai -p 9200:9200 -e "discovery.type=single-node" -e "ES_JAVA_OPTS=-Xms1g -Xmx1g" -e "xpack.security.enabled=false" -e "xpack.security.http.ssl.enabled=false" -e "xpack.security.transport.ssl.enabled=false" elasticsearch-thai

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

---

## 📚 เอกสารเพิ่มเติม

### 📦 System Management
รายละเอียดการจัดการระบบ การตรวจสอบสถานะระบบ และความปลอดภัย  
👉 **[ดู System Documentation](docs/SYSTEM.md)**

### 📊 Database Schema
รายละเอียดโครงสร้างฐานข้อมูล MongoDB ทั้ง 9 Collections และ Relationships  
👉 **[ดู Database Documentation](docs/DATABASE.md)**

### 🔧 API Reference  
คู่มือการใช้งาน REST APIs ทั้ง 9 กลุ่มหลัก พร้อมตัวอย่างและ Response  
👉 **[ดู API Documentation](docs/API.md)**

### Configuration Files
- `.env.example`: ตัวอย่างการตั้งค่า environment variables
- `elasticsearch-thai/Dockerfile`: การตั้งค่า Elasticsearch พร้อม Thai support
- `models/`: Database schemas และ relationships

---