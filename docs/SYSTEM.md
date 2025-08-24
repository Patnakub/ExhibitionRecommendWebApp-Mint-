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