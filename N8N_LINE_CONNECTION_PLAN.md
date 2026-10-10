# เชื่อม KS Ladprao Assistant ผ่าน n8n

> แผนนี้ดำเนินการแล้ว สถานะ Production, workflow nodes, credentials metadata และหลักฐานทดสอบจริงอยู่ใน `LADPRAO_STOCK_RUNBOOK.md`

วันที่ 12 กันยายน 2026 — FARU เลือกใช้ n8n MCP เพื่อเชื่อม webhook และทดสอบ Stock Card

## ผลตรวจ

- n8n MCP เชื่อมได้และค้น workflows/credential metadata ได้
- ไม่พบ credential จากการค้น KS, กง, kong; ค้น LINE พบ TW Line และ Line oa car เท่านั้น จึงยังไม่มี credential ที่ยืนยันว่าเป็น channel 2007655261
- พบ workflow KS Stock → Google Sheets (OhiMc3AyMeeicXCq) ปิดอยู่ แต่ get_workflow_details ถูกปฏิเสธเพราะยังไม่เปิด MCP access ห้ามสรุปเนื้อหาหรือเปิดใช้งานโดยเดา
- LINE MCP Ultimate ยังไม่มี callable tool ใน session นี้ ไม่จำเป็นต้องติดตั้งเพื่อใช้ n8n ส่ง Messaging API
- node n8n-nodes-base.line ใช้ lineNotifyOAuth2Api และมีคำเตือนยุติ LINE Notify จึงไม่เลือกใช้
- webhook เดิม n8n.srv1037034.hstgr.cloud/webhook/kongsi resolve host ไม่ได้ในผลทดสอบก่อนหน้า ต้องใช้ Production URL ที่ n8n instance ปัจจุบันให้จริง

## Flow ที่จะสร้าง

LINE POST → Webhook (raw body) → ตรวจ HMAC-SHA256 กับ x-line-signature → parse event → เก็บเฉพาะ groupId/eventId/เวลาของคำสั่งลงทะเบียน → ตอบ HTTP 200

คำขอ signature ผิดตอบ 401/403; คำขอ Verify ของ LINE ที่มี events ว่างและ signature ถูกต้องตอบ 200 โดยไม่ส่งข้อความ

เมื่อ FARU พิมพ์คำทดสอบในกลุ่มลาดพร้าว 122 Operation: ตรวจ group summary ด้วย Messaging API ว่าชื่อตรง แล้วส่ง Stock Card ที่ระบุข้อมูลทดสอบ 1 ครั้ง ใช้ eventId กันส่งซ้ำ ไม่ตอบทุกข้อความในกลุ่ม

## ข้อมูลที่ต้องผูกก่อนเปิดจริง

1. Channel secret ของ KS Ladprao Assistant สำหรับตรวจ signature: เก็บใน secret store/environment ของ n8n ที่ runtime เข้าถึงได้ ไม่ฝังใน workflow JSON หรือ execution output
2. Channel access token ของบัญชีเดียวกัน: n8n HTTP Header Auth credential ชื่อ KS Ladprao Assistant; header Authorization ค่า Bearer ตามด้วย token เก็บใน Credentials
3. Production URL จาก Webhook node บน n8n ปัจจุบันหลัง publish; ไม่เดาชื่อ host หรือใช้ URL เก่าที่เสีย
4. ตรวจ bot info ให้ได้ Basic ID @197ccold ก่อนส่งใด ๆ

## เกณฑ์จบการทดสอบ

- LINE Verify ขึ้น Success
- invalid signature ถูกปฏิเสธ
- รับ event จากกลุ่มที่ FARU ระบุและตรวจชื่อกลุ่มได้
- ส่งการ์ดข้อมูลทดสอบได้และ FARU เห็นในกลุ่ม
- ไม่บันทึก mock stock ลงฐานจริงและไม่ส่งซ้ำเมื่อ event redeliver

สถานะ: ตรวจวิธีและข้อจำกัดแล้ว ยังไม่ได้สร้าง/publish workflow หรือเปลี่ยน webhook เพราะยังไม่มี credential ของ KS ที่ยืนยันและกลไกเก็บ channel secret พร้อมใช้

## แหล่งอ้างอิง

- https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/
- https://developers.line.biz/en/docs/messaging-api/verify-webhook-signature/
- https://raw.githubusercontent.com/n8n-io/n8n/master/packages/nodes-base/nodes/Line/Line.node.ts
