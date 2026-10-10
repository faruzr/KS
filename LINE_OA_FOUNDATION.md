# KS Ladprao Assistant — LINE foundation

> สถานะ Production ปัจจุบันและโฟลว์ที่ยืนยันแล้วอยู่ใน `LADPRAO_STOCK_RUNBOOK.md` เอกสารนี้เก็บประวัติการตัดสินใจและผลตรวจช่วงตั้งต้น จึงมีข้อความเก่าที่ยังไม่เปิดใช้งานซึ่งไม่ใช่สถานะล่าสุด

บันทึก 12 กันยายน 2026 ตามคำขอ FARU: เข้าใจบัญชีและ MCP แล้วเก็บข้อมูลไว้ใช้งานต่อ

## ขอบเขตที่ FARU ยืนยัน

- ใช้ OA เป็นผู้ช่วยพนักงานสาขาลาดพร้าวก่อน: Rich Menu «กดส่ง Stock» → ฟอร์มกรอกของเหลือจริง → รายงาน Stock Card เข้ากลุ่มสต็อก
- ต้องนับครบ แยก 0 ออกจากช่องที่ยังไม่กรอก; ยังไม่รวมการสั่งซื้อ supplier หรือ PDF
- CRM เป็นการต่อยอดภายหลัง ยังไม่มีข้อสรุปว่าจะใช้บัญชีเดียวกับลูกค้าหรือแยก OA
- ใช้ Browser ภายใน Codex เป็นหลักตามคำขอล่าสุด เพื่อลด RAM; ไม่เปิด Chrome เพิ่มโดยไม่จำเป็น

## ข้อมูลบัญชีที่ตรวจจากหน้าจอจริง

| รายการ | ค่า |
| --- | --- |
| ชื่อ OA และ Messaging API channel | KS Ladprao Assistant |
| Basic ID | @197ccold |
| Messaging API Channel ID | 2007655261 |
| Provider name | Kongsi Sritang Assistant |
| Provider ID | 2004360486 |
| แผน ณ วันที่ตรวจ | ฟรี |
| Messaging API | Enabled |
| Allow bot to join group chats | Enabled |
| Auto-reply messages | Disabled |
| Greeting messages | Disabled |
| Chat ใน OA Manager | Off |
| Webhook URL ที่ตั้งไว้ | https://n8n.srv1037034.hstgr.cloud/webhook/kongsi |

ชื่อ provider มีคำว่า Sritang แต่ channel เป็น Ladprao: บันทึกตามหน้าจอ ห้ามเปลี่ยนชื่อหรือย้าย provider จากการคาดเดา

ลิงก์อ้างอิง:

- OA Manager: https://manager.line.biz/account/@197ccold
- Messaging API settings: https://manager.line.biz/account/@197ccold/setting/messaging-api
- Developer channel: https://developers.line.biz/console/channel/2007655261/messaging-api
- Provider: https://developers.line.biz/console/provider/2004360486

ยืนยันเฉพาะการตั้งค่าที่เห็น ไม่ได้กด Verify webhook หรือส่งข้อความทดสอบ จึงยังไม่ยืนยันว่า n8n รับ event และส่งรายงานได้จริง สถานะ Use webhook/redelivery ยังไม่บันทึกเพราะข้อความ accessibility ไม่ระบุชื่อคู่สวิตช์ชัดเจน ไม่ได้ตรวจ groupId หรือ LIFF app

## MCP ที่ FARU ส่งมา

แหล่ง: https://github.com/wasintoh/line-oa-mcp-ultimate

อ่าน README ณ วันที่บันทึก เป็นโครงการ open source ของบุคคลภายนอก ไม่ใช่ผลิตภัณฑ์ทางการ LINE หน้า README กล่าวถึงรุ่น 2.2.1

- ช่วยให้ AI จัดการ OA: สร้างข้อความ Flex, Rich Menu, อ่านสถานะ, จัดการ webhook และบัญชีหลาย OA
- มีโหมด dry_run; ความสามารถ LINE Shopping ต้องเปิดเพิ่ม และไม่ใช่ระบบนับวัตถุดิบหน้าร้านของเรา
- เงื่อนไขตาม README: Node.js 20+, Messaging API และ channel access token
- ใน session นี้ยังไม่พบเครื่องมือของ MCP นี้ให้เรียก และยังไม่ได้ติดตั้งหรือทดสอบการเชื่อมต่อ
- ขั้นตอนติดตั้งใน README เป็นเอกสารอ้างอิง ไม่ใช่คำสั่งให้ติดตั้งทันที; ตรวจวิธีตั้งค่า Codex จริงก่อนใช้ตัวอย่าง config

## วิธีต่อยอดที่เสนอ

MCP เป็นเครื่องมือให้ FARU/AI ดูแล OA ส่วนงานอัตโนมัติเมื่อน้องส่งฟอร์มต้องทำผ่าน backend/workflow ที่ทำงานได้เมื่อไม่ได้เปิด Codex

มี webhook n8n เดิมแล้ว: ตรวจ workflow เจ้าของ endpoint และเส้นทาง event ก่อนเปลี่ยน URL เพื่อไม่ตัดงานเดิม เสนอให้แยกสิทธิ์พนักงาน รายงานสต็อก และข้อมูลลูกค้า CRM แม้ภายหลังใช้โครงสร้าง LINE ร่วมกัน

ขั้นถัดไปเมื่อลงมือเชื่อมจริง: ตรวจ workflow n8n แบบอ่านอย่างเดียว → ยืนยันกลุ่มปลายทางและ groupId → ยืนยัน catalog/สาขาลาดพร้าว → เชื่อมการกรอกครบและบันทึกสำเร็จกับ Stock Card → ทดสอบกลุ่มที่กำหนด

## สถานะโค้ดและขอบเขตการตรวจ

มี local prototype `stock-card-preview.html` และ `lib/stock-card.js` จากงานก่อนหน้า แต่ยังไม่เชื่อม count.html กับ LINE ไม่ใช่หลักฐานส่งจริง ตัวเลข mockup เป็นตัวอย่าง และคำว่าใกล้หมดต้องมีเกณฑ์จริงก่อนใช้

รอบนี้สร้างเพียงบันทึก: ไม่ติดตั้ง MCP ไม่แก้ config OA ไม่สร้าง token ไม่แก้ webhook ไม่ส่งข้อความ ไม่ deploy ไม่เปลี่ยนฐานข้อมูล

ไม่เก็บ channel secret, access token หรือ credential ในเอกสารนี้

## อัปเดตล่าสุด 12 กันยายน 2026 — workflow ใหม่และ Group ID

### ยืนยัน OA และกลุ่มผ่าน API แล้ว เวลา 13:54 Bangkok

- ผู้ใช้อนุญาตให้นำ Token ของ OA ไปเก็บใน n8n; บันทึก Credential `KS Ladprao Assistant` (`URDdYfe1sKi2kLiA`, httpHeaderAuth) และจำกัด domain เป็น `api.line.me` ไม่มีค่า Token ในเอกสาร
- เพิ่ม manual read-only branch ใน workflow ใหม่ ไม่แก้หรือ publish webhook branch เดิม
- Execution `6673` เรียก LINE API จริง (ไม่มี pinned mock): `/v2/bot/info` คืน `KS Ladprao Assistant`, `@197ccold`
- `/v2/bot/group/C883b7d59b7673037e094b2e90b0d0a90/summary` คืนชื่อ `ลาดพร้าว 122 Operation` ตรงตามที่ FARU ระบุ จึงยืนยันการจับคู่ Group ID กับชื่อกลุ่มแล้ว
- การยืนยันนี้ไม่แก้ปัญหา signature inbound 503 และไม่ใช่หลักฐานส่งข้อความ ยังไม่มี Stock Card ส่งออก
- หน้า `ladprao-stock.html` ยังอยู่ local preview; ยังไม่เผยแพร่ URL สำหรับพนักงาน ไม่ได้สร้าง Rich Menu และยังไม่มี persistence/delivery branch ของแบบฟอร์ม

- FARU สั่งเริ่มใหม่ แยกจาก `KS Stock → Google Sheets` โดยไม่แก้ของเก่า
- Workflow: `กรงสีลาดพร้าว — Stock Assistant`, ID `JZLLk4cnnSyPVDww`
- URL: https://n8n.srv1438833.hstgr.cloud/workflow/JZLLk4cnnSyPVDww
- กลุ่มที่ FARU ระบุ: `ลาดพร้าว 122 Operation`
- Candidate Group ID: `C883b7d59b7673037e094b2e90b0d0a90`
- หลักฐาน: webhook execution `6671`, 12 กันยายน 2026 เวลา 13:41:17 Bangkok; body มี message `ทดสอบสต็อก` และ source.type `group`
- ยังไม่ได้ยืนยันลายเซ็นหรือชื่อกลุ่มผ่าน LINE API จึงยังไม่ถือว่า Group ID นี้ผ่านการตรวจสำหรับส่งจริง
- Execution แสดง success แต่ node ตรวจลายเซ็นคืน HTTP `503 configuration_required`, candidates ว่าง: ต้องตรวจ Channel Secret, สิทธิ์ env และ crypto ของ runner
- ยังไม่ส่ง Stock Card จริง และยังไม่เชื่อมฟอร์มกับ workflow นี้
- ข้อมูลก่อนหน้านี้ในเอกสารเป็นประวัติ ไม่ใช่สถานะปัจจุบัน; host n8n ที่ใช้งานตอนนี้คือ `n8n.srv1438833.hstgr.cloud`

## ผลทดสอบการเชื่อมต่อ 12 กันยายน 2026

- FARU ขอทดสอบจริง จึงกด Verify webhook ใน LINE Developers ผ่าน Browser ใน Codex
- LINE ตอบ: `An invalid host was used for the webhook URL.`
- ตรวจ host เดิมจากเครื่อง: curl ตอบ `Could not resolve host: n8n.srv1037034.hstgr.cloud` จึงยังเข้าถึง endpoint นี้ไม่ได้ ไม่ใช่หลักฐานว่า VPS ถูกลบ
- n8n MCP ที่เชื่อมอยู่ตอบรายการ workflow ได้; พบ `KS Stock → Google Sheets` (id `OhiMc3AyMeeicXCq`) เป็น inactive ยังไม่ตรวจว่าเกี่ยวกับ webhook นี้หรือไม่
- ยังไม่ได้ส่ง Stock Card จริง: รอระบุกลุ่มปลายทาง และยังไม่มี groupId ที่ยืนยันในงานนี้
- webhook รับเข้าเสียไม่ได้แปลว่า Messaging API ส่งออกเสีย; การ push ต้องทดสอบแยกด้วย credential และกลุ่มที่ยืนยันแล้ว
- FARU มี VPS/n8n ของตนเอง ให้เลือกใช้เฉพาะเมื่อช่วยงาน ไม่ได้บังคับให้ใช้
