# A AND C Order System

โปรเจกต์ที่จัดโครงสร้างใหม่สำหรับเปิดและพัฒนาด้วย VS Code โดยไฟล์ต้นฉบับเดิมไม่ได้ถูกลบ

## เริ่มใช้งาน

1. เปิดโฟลเดอร์ `A-C-Order-System` ใน VS Code
2. เปิด Terminal แล้วรัน `npm run check`
3. รัน `npm run dev`
4. เปิด `http://localhost:3000`

## โครงสร้าง

- `pages/` หน้า HTML ของลูกค้า ฝ่ายขาย Dashboard และใบเสนอราคา
- `css/` CSS แยกตามชื่อหน้า
- `js/` JavaScript แยกตามชื่อหน้า
- `js/services/` ค่าเส้น API และตัวเรียก API
- `assets/images/` โลโก้และรูปภาพ
- `assets/data/` ฐานข้อมูลสินค้าเดิม
- `api/` Development Server และตำแหน่งสำหรับพัฒนา Backend
- `docs/API.md` รายการ API ทั้งระบบ
- `tests/` ตรวจ syntax และลิงก์ไฟล์ภายในโปรเจกต์

## สถานะการเก็บข้อมูล

ฟังก์ชันเดิมยังใช้ `localStorage` เพื่อรักษาการทำงานเดิมไว้ ส่วน `js/services/api-config.js` และ `api-client.js` เตรียมเส้นสำหรับย้ายไป Backend ในขั้นต่อไป การใช้งานหลายเครื่องจำเป็นต้องสร้างฐานข้อมูลและเปลี่ยนคำสั่ง `localStorage` เป็น API
