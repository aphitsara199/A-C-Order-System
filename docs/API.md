# API Routes

Base URL สำหรับพัฒนา: `http://localhost:3000/api`

| Method | Route | หน้าที่ |
|---|---|---|
| GET | `/health` | ตรวจสอบ API |
| POST | `/auth/register` | สมัครลูกค้า |
| POST | `/auth/login` | เข้าสู่ระบบ |
| POST | `/auth/reset-password` | รีเซ็ตรหัสผ่านด้วยเบอร์โทร |
| GET/POST | `/customers` | อ่าน/เพิ่มลูกค้า |
| GET/PUT | `/customers/:id` | อ่าน/แก้ไขลูกค้า |
| GET | `/products` | รายการสินค้า หน่วย และราคา |
| GET/POST | `/orders` | อ่าน/สร้างใบสั่งซื้อ |
| GET/PUT/DELETE | `/orders/:id` | รายละเอียด แก้ไข หรือยกเลิกใบสั่งซื้อ |
| GET/POST | `/quotations` | อ่าน/สร้างใบเสนอราคา |
| GET/PUT | `/quotations/:id` | อ่าน/แก้ไขใบเสนอราคา |

ไฟล์ `api/server.mjs` ตอนนี้เป็น Development Server และตอบเฉพาะ `/api/health` ส่วนเส้นอื่นตอบ `501` เพื่อป้องกันการเข้าใจผิดว่าเป็น Backend ที่ปลอดภัยแล้ว ก่อนใช้งานจริงต้องเพิ่มฐานข้อมูล การเข้ารหัสรหัสผ่าน การยืนยันตัวตน และสิทธิ์ฝ่ายขาย
