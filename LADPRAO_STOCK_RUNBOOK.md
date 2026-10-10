# Ladprao 122 Stock Assistant — Production Runbook

อัปเดตล่าสุด: 8 ตุลาคม 2026 เวลาไทย

> **8 ต.ค. 2026 — กู้ระบบ + เพิ่ม PDF (อ่านส่วนนี้ก่อน)**
> - เหตุ: 24 ก.ย. workflow `JZLLk4cnnSyPVDww` ถูกเขียนทับเป็น "ลาดพร้าว 122 — Expense Ledger Test" เส้นทางรับฟอร์มสต็อกหาย (webhook ตอบ 404) เวอร์ชันเก่าถูก n8n prune แล้ว
> - แก้: สร้าง workflow ใหม่ `ลาดพร้าว 122 — Stock Report (PDF)` ID `MRVobiy9MFj1eMbg` (path เดิม `ks-ladprao-stock-submit`, credential เดิมทั้งหมด) — **ห้ามแก้/ลบ workflow `JZLLk4cnnSyPVDww` ถือว่าเป็นงานรายจ่ายแยกแล้ว**
> - เพิ่ม: Code node สร้างใบสต็อก A4 (`lib/stock-pdf.js`) → Gotenberg (Chromium) แปลง PDF → Google Drive (`Google Drive account`) แชร์ "ใครมีลิงก์ดูได้" → ปุ่ม "เปิด PDF ใบสต็อก" ในการ์ด
> - ขั้น PDF ทั้งหมด `continueRegularOutput`: ถ้า Gotenberg/Drive พัง รายงานยังส่งเข้ากลุ่มได้ แค่ไม่มีปุ่ม PDF
> - โค้ด n8n สร้างจาก `lib/` ด้วย `node scripts/build-n8n-stock-code.mjs` แล้ววางลง node ชื่อเดียวกัน; output `catalogCheck` ของ node render ต้องตรงกับค่าที่สคริปต์พิมพ์ (ปัจจุบัน `2530077381`) ไม่งั้นแปลว่า catalog ใน n8n ไม่ตรงฟอร์ม
> - ทดสอบจริง 8 ต.ค. 14:35: ข้อความติดป้ายทดสอบเข้ากลุ่ม, LINE request ID `fb1ad8cd-b887-448f-95eb-f113bfe22ef0`; ชุดทดสอบ 27/27
> - Gotenberg: ติดตั้งแล้ว 8 ต.ค. 17:41 เป็น compose project `gotenberg` บน VPS (image `gotenberg/gotenberg:8` v8.37.0, `mem_limit: 1g`, network `root_default`, ไม่ publish port) — ทดสอบจาก n8n ได้ PDF ใน 0.9 วินาที ฝังฟอนต์ Sarabun ครบ
> - Drive: credential `Google Drive account 4` (บัญชี fufu.phakinn@gmail.com) → โฟลเดอร์ `KS stock` (ID `1go3Li55uYbgMFJcRBxM5kDjLJFVWl4Fi`) แชร์ไฟล์แบบ anyone-with-link reader
> - ทดสอบครบเส้นทาง 8 ต.ค. 17:53: PDF 2 หน้า 41 KB ลง `KS stock` + ปุ่มในการ์ด, LINE request ID `56bae276-7867-469d-a3ff-2af7ad784847`, ใช้เวลารวม 5.4 วินาที (ต่ำกว่า timeout Vercel 15 วิ); ลิงก์เปิดได้โดยไม่ล็อกอิน; publish active version `cc63774c-dad6-485d-b49f-e5788f447868`
> - **8 ต.ค. 18:10 เปลี่ยนจาก PDF เป็นรูป PNG (ตาม FARU: รูปอย่างเดียว ไม่ต้องกดดาวน์โหลด)**: workflow เปลี่ยนชื่อเป็น `ลาดพร้าว 122 — Stock Report (Image)`; Gotenberg `/forms/chromium/screenshot/html` (png, width 1080, skipNetworkIdleEvent=false รอฟอนต์) → อัปโหลด `.png` เข้า `KS stock` → แชร์ anyone-with-link → ส่ง LINE เป็น `image` message ต่อจากการ์ด ใช้ URL `https://lh3.googleusercontent.com/d/<fileId>=w1080` (preview `=w480`) ซึ่งตอบ PNG ตรงไม่ redirect; ข้อความรายละเอียดตัวหนังสือยังส่งตามเดิม; lib ใหม่ `lib/stock-sheet.js` + `withSheetImage()` ใน `lib/ladprao-delivery.js`; ทดสอบผ่าน LINE `/v2/bot/message/validate/push` (ไม่ส่งจริง) 200 OK, request ID `3f90a033-cb1b-4f1e-ac46-d49e40a968d7`; active version `b28476e2-dc8b-4d20-867f-0a6a0dee6cc9` ตรวจแล้วว่า URL เป็น `/v2/bot/message/push`
> - **8 ต.ค. 18:30 ส่งรูปอย่างเดียว (ตาม FARU: "ส่งแค่รูป อย่างอื่นไม่ต้อง")**: กลุ่มได้ image message 1 ข้อความเท่านั้น; ถ้าทำรูป/อัปโหลด/แชร์ไม่สำเร็จ จะส่งการ์ด + ข้อความตัวหนังสือแบบเดิมแทน (กันรายงานหาย); active version `06d2664c-27c5-423e-9991-989e3f9f2e28`; ส่งรูปทดสอบเข้ากลุ่มจริง 1 ครั้ง ไฟล์ `สต็อกลาดพร้าว122_2026-10-08_6b7c8d9e.png` — FARU ยืนยันว่ารูปขึ้นในกลุ่มแล้ว (8 ต.ค.)
> - **8 ต.ค. 18:50 รายการใหม่ตามใบกระดาษ + 3 แผ่น**: catalog ลาดพร้าวแยกเป็น `lib/ladprao-catalog.js` (89 รายการ หน่วยเดียว 7 หมวด ตามใบ "Stock List Lat Phrao122 2026" — หาดใหญ่ `lib/catalog.js` ไม่แตะ); เอาช่องหมายเหตุออกจากฟอร์ม (FARU: "ไม่ต้องมี"); รูปหน้าตาเหมือนใบกระดาษ 3 แผ่น (35/39/15) ส่งเป็น image 3 ข้อความ ถ้าแผ่นใดพลาด → ส่งการ์ด+ข้อความแทน; ยืด timeout Vercel→n8n 45 วิ, ฟอร์ม 60 วิ (ทั้งกระบวนการ ~19 วิ); Vercel deploy production `ks-ladprao-stock-b3wfmvdzw` (4 ไฟล์: ladprao-stock.html, api/ladprao-stock.js, lib/ladprao-report.js, lib/ladprao-catalog.js; ย้อนกลับได้ด้วย promote deployment เดิม `nt11p9s6p`); n8n active `eb0b9fa4-ec13-44f3-bcde-5a3db3ede47e` (ตรวจแล้วเป็น /push), catalogCheck `3280605895`; ส่งทดสอบจริง 3 แผ่น requestId `8d9e0f1a…`
> - **8 ต.ค. 19:35 หมายเหตุต่อรายการ (FARU เลือกแบบ A แสดงตลอด)**: ทุกรายการในฟอร์มมีช่อง "หมายเหตุ (ถ้ามี)" ไม่บังคับ ≤50 ตัวอักษร (เช่น "4 กระป๋อง" เมื่อมีหน่วยย่อย) · payload `items[].note` · รูปมีคอลัมน์ หมายเหตุ เหมือนใบกระดาษ · ข้อความสำรองแสดงเป็น "1 ลัง (4 กระป๋อง)" · Vercel `ks-ladprao-stock-gvzphx21j` · n8n active `32862b0d-d00e-47b5-9622-8e942b009c47` (ตรวจแล้ว /push) · ทดสอบ validate ไม่ส่ง ผ่าน, ทดสอบโค้ด 31/31; ยังไม่ได้ส่งรูปทดสอบเข้ากลุ่มรอบนี้
> - **8 ต.ค. 20:10 เอารหัสพนักงานออก (FARU เลือก "เอาออกเลย" หลังรับทราบความเสี่ยง)**: ฟอร์มเหลือแค่ชื่อผู้ตรวจ + จำนวน + หมายเหตุ · `api/ladprao-stock.js` ไม่ตรวจ `X-Stock-Staff-Key` แล้ว (env `KS_STOCK_STAFF_KEY` บน Vercel ไม่ได้ใช้แล้ว ลบได้) · ความเสี่ยงที่ยอมรับ: ใครมีลิงก์ฟอร์มก็ส่งรูปเข้ากลุ่ม/ลง Drive ได้ — ถ้าเจอสแปม ให้เปลี่ยนเป็นฝังรหัสในลิงก์ Rich Menu หรือ LIFF · n8n ยังตรวจ `X-KS-Stock-Secret` จาก Vercel เหมือนเดิม · Vercel `ks-ladprao-stock-or4ydw8mf`
> - ข้อควรระวัง: ถ้าทดสอบด้วย validate endpoint ต้องเปลี่ยนกลับเป็น `/push` ก่อน publish — validate ก็ตอบ `x-line-request-id` ทำให้ฟอร์มขึ้น "สำเร็จ" ทั้งที่ไม่มีข้อความเข้ากลุ่ม
> - ข้อควรระวัง: แก้ workflow ใน n8n UI แล้วช่อง fileId ของ `Share PDF by link` เคยถูกล้างเป็นค่าว่าง — ถ้าแก้ใน UI ให้เช็คว่ายังเป็น `{{ $json.id }}`

เอกสารนี้คือสถานะหลักของระบบส่งรายงานสต็อกสาขาลาดพร้าว 122 ใช้ไฟล์นี้ก่อน `LINE_OA_FOUNDATION.md`, `LADPRAO_FORM_HANDOFF.md` และ `N8N_LINE_CONNECTION_PLAN.md` ซึ่งมีประวัติและแผนเก่าปะปนอยู่

## 1. ผลลัพธ์ทางธุรกิจที่เปิดใช้งานแล้ว

พนักงานเปิด LINE OA `KS Ladprao Assistant` → กด Rich Menu `กรอกสต็อก` → กรอกจำนวนคงเหลือครบทุกช่องและหมายเหตุ → ยืนยัน → Vercel ตรวจรหัสพนักงานและข้อมูล → n8n สร้าง Stock Card พร้อมรายละเอียด → LINE Push ส่งเข้ากลุ่ม `ลาดพร้าว 122 Operation` → หน้าเว็บแสดงสำเร็จเฉพาะเมื่อ LINE ตอบรับคำขอแล้ว

ขอบเขตปัจจุบันมีเฉพาะ “รายงานสต็อกเข้ากลุ่ม LINE” ยังไม่มี Supabase, Google Sheets, ประวัติรายงานถาวร, งานสั่งซื้อ, CRM หรือ PDF

## 2. จุดเข้าใช้งานและรหัสระบบ

| ส่วน | ค่าปัจจุบัน |
| --- | --- |
| หน้า Production | https://ks-ladprao-stock.vercel.app/ladprao-stock.html |
| Vercel project | `ks-ladprao-stock` |
| Vercel project ID | `prj_G8836UHKtlARe7dz0wxDpgES4swK` |
| Deployment ที่มี secret หมุนใหม่ | `dpl_DfckCw7BCGQyMq4GaXnbNz5wiZ7E` |
| OA | `KS Ladprao Assistant` |
| Basic ID | `@197ccold` |
| Messaging API Channel ID | `2007655261` |
| OA Manager | https://manager.line.biz/account/@197ccold |
| LINE Developers | https://developers.line.biz/console/channel/2007655261/messaging-api |
| กลุ่มปลายทาง | `ลาดพร้าว 122 Operation` |
| Group ID ที่ตรวจชื่อผ่าน LINE API | `C883b7d59b7673037e094b2e90b0d0a90` |
| n8n workflow | `ลาดพร้าว 122 — Stock Report (PDF)` (ตั้งแต่ 8 ต.ค. 2026) |
| n8n workflow ID | `MRVobiy9MFj1eMbg` (ตัวเดิม `JZLLk4cnnSyPVDww` ถูกเขียนทับเป็นงานรายจ่ายแล้ว) |
| n8n URL | https://n8n.srv1438833.hstgr.cloud/workflow/MRVobiy9MFj1eMbg |
| PDF renderer | Gotenberg `http://gotenberg:3000` (container ภายใน network เดียวกับ n8n, ไม่เปิด port) |
| Form webhook | `POST /webhook/ks-ladprao-stock-submit` |
| Rich Menu draft/record ID | `20191371` |
| Rich Menu title | `ลาดพร้าว 122 — กรอกสต็อก` |
| Rich Menu status | `Ready`, default `Shown` |
| Rich Menu action | Link ไปหน้า Production ด้านบน |
| Rich Menu display period | 11 ก.ย. 2026 00:00 – 20 มี.ค. 2027 23:59 |

## 3. โฟลว์ Production

```text
LINE Rich Menu
  → GET /ladprao-stock.html (Vercel)
  → พนักงานกรอก 90 ช่อง + ชื่อ + shared staff key + หมายเหตุ
  → POST /api/ladprao-stock (same origin)
  → ตรวจ staff key แบบ timing-safe
  → ตรวจ branch, UUID requestId, วันเวลา, รายการ/หน่วย, จำนวน และความครบถ้วน
  → POST n8n /webhook/ks-ladprao-stock-submit
     Header: X-KS-Stock-Secret
     Header: Idempotency-Key = requestId
  → n8n Header Auth ตรวจ inbound secret
  → Validate and build stock report
  → LINE POST /v2/bot/message/push
     to = Group ID ที่ล็อกไว้ฝั่ง server
     X-Line-Retry-Key = requestId
  → Confirm LINE acceptance only
  → Return { requestId, delivery: "accepted", lineRequestId }
  → หน้าเว็บล็อกข้อมูลและแสดง “LINE รับรายงานนี้แล้ว”
```

หน้าเว็บไม่รับ Group ID จากผู้ใช้และไม่ถือข้อความ HTTP 200 ธรรมดาว่าสำเร็จ ต้องได้ `requestId` เดิม, `delivery: accepted` และ `lineRequestId` จาก LINE จึงแสดงสถานะสำเร็จ

## 4. โหนด n8n ที่ใช้งาน

### เส้นทางฟอร์ม Production

1. `Receive stock form — Ladprao` — Webhook POST, Header Auth, เปิดใช้งาน
2. `Validate and build stock report` — ตรวจ payload ซ้ำใน n8n, สร้าง Flex Message และข้อความรายละเอียด
3. `Send stock to verified LINE group` — ส่ง Push ด้วย OA credential และ `X-Line-Retry-Key`
4. `Confirm LINE acceptance only` — ยอมรับ HTTP 200 ที่มี `x-line-request-id`; กรณี retry 409 ต้องมี `x-line-accepted-request-id`
5. `Return form delivery status` — ตอบกลับ Vercel

### เส้นทางตรวจระบบ

- `Check LINE connection manually` → `Read Ladprao OA identity` → `Read operation group name` → `Validate stock message format — no send`
- ใช้ตรวจ OA, ชื่อกลุ่ม และ schema โดยไม่ส่งข้อความจริง

### เส้นทาง LINE event เดิม

- `LINE Webhook — Ladprao` → `Verify signature and identify test group` → `Respond to LINE`
- เส้นทางนี้แยกจากการส่งฟอร์ม และยังต้องตั้ง `KS_LADPRAO_LINE_CHANNEL_SECRET` ถ้าจะใช้รับ event จาก LINE เต็มรูปแบบ
- อาการ `503 configuration_required` ของเส้นทาง event ไม่ได้ขัดขวางฟอร์ม → n8n → LINE Push ที่เปิดใช้งานแล้ว

## 5. Credential และ Environment Variables

### n8n credentials

| ชื่อ | ID | ใช้ทำอะไร |
| --- | --- | --- |
| `KS Ladprao Assistant` | `URDdYfe1sKi2kLiA` | Bearer token สำหรับ `api.line.me`; จำกัด Allowed Domain เป็น `api.line.me` |
| `KS Ladprao Stock Form Inbound` | `RtRejwGSRdIE9K6s` | Header Auth ชื่อ `X-KS-Stock-Secret` สำหรับ Vercel → n8n |

### Vercel Production variables

- `KS_STOCK_N8N_URL`
- `KS_STOCK_N8N_SECRET`
- `KS_STOCK_STAFF_KEY`
- `KS_STOCK_READY=true`

ห้ามจดค่าของ token, inbound secret หรือ staff key ใน Git, Markdown, LINE หรือ memory ของ AI ให้เปลี่ยนผ่าน n8n Credentials/Vercel Environment Variables เท่านั้น หลังเปลี่ยน Vercel variable ต้อง deploy Production ใหม่

Shared staff key เป็นรหัสร่วม ไม่ใช่ตัวตนพนักงานรายบุคคล หากต้อง audit ว่าใครส่งจริง ให้ต่อ LINE Login/LIFF หรือระบบบัญชีพนักงานภายหลัง

## 6. Data contract

Request จาก browser ไป Vercel:

```json
{
  "requestId": "UUID v4",
  "branch": "ลาดพร้าว 122",
  "submittedBy": "ชื่อผู้ตรวจ",
  "note": "หมายเหตุ",
  "submittedAt": "ISO-8601 datetime",
  "items": [
    { "name": "ไข่มุกดำ", "unit": "ลัง", "qty_remaining": 2 },
    { "name": "ไข่มุกดำ", "unit": "ถุง", "qty_remaining": 5 }
  ]
}
```

กติกาหลัก:

- ต้องครบ 90 unit slots จาก 5 หมวด: กงสิ, ทั่วไป, ออนไลน์, PK BKK, พร้อมเพย์
- ช่องว่างไม่เท่ากับศูนย์; ของหมดต้องกรอก `0`
- รับเลขทศนิยมและศูนย์ แต่ไม่รับค่าติดลบ, Infinity, NaN, ชื่อ/หน่วยนอก catalog หรือรายการซ้ำ
- สินค้าที่มีหลายหน่วยอยู่แถวเดียวกัน เช่น ไข่มุกดำ `ลัง / ถุง`
- branch ถูกล็อกเป็น `ลาดพร้าว 122`
- ผู้ตรวจต้องไม่ว่างและยาวไม่เกิน 100 ตัวอักษร; หมายเหตุไม่เกิน 2,000 ตัวอักษร

## 7. รูปแบบข้อความในกลุ่ม

ข้อความ Push หนึ่งครั้งประกอบด้วย:

1. Flex Stock Card: สาขา, วันเวลาไทย, ผู้ตรวจ, ความครบถ้วน, จำนวนสินค้าที่หมด และฉบับรายงาน
2. ข้อความรายละเอียดทุกหมวด: ชื่อสินค้า + จำนวนคงเหลือทุกหน่วย
3. หมายเหตุท้ายรายงาน

ข้อความยาวถูกแบ่งเป็น chunk ไม่เกินขีดจำกัด LINE และรวมกับ Flex แล้วต้องไม่เกินจำนวนข้อความต่อ Push ที่กำหนดในโค้ด

## 8. การกันส่งซ้ำและสถานะไม่แน่นอน

- Browser สร้าง `requestId` เดียวและใช้ซ้ำระหว่าง retry ของรายงานเดียวกัน
- n8n ส่ง `X-Line-Retry-Key = requestId`
- LINE เก็บ retry key ชั่วคราว; client จึงไม่ retry หลัง 23 ชั่วโมง
- HTTP 409 จะถือว่าส่งแล้วเฉพาะเมื่อมี `x-line-accepted-request-id`
- Timeout หรือคำตอบที่ไม่มีหลักฐานจาก LINE ต้องคืน `delivery: unknown` และห้ามสร้างรายงานใหม่ทันที ให้ตรวจกลุ่มก่อน
- ปัจจุบันไม่มีฐานข้อมูลหรือ outbox จึงยังไม่มี recovery ข้ามการ reload หน้าเว็บแบบสมบูรณ์

## 9. ความปลอดภัยและการเก็บ execution

หลังทดสอบพบว่า n8n เก็บ request headers ไว้ใน execution data ซึ่งอาจทำให้ inbound secret ปรากฏในประวัติ จึงดำเนินการแล้ว:

- หมุน inbound secret ใหม่หลัง execution ทดสอบ
- อัปเดตทั้ง n8n credential และ Vercel Production variable
- deploy Production ใหม่
- ตั้ง workflow เป็น `saveDataSuccessExecution: none`, `saveDataErrorExecution: none`, `saveExecutionProgress: false`
- timezone เป็น `Asia/Bangkok`

ผลคือ execution ใหม่ยังมี metadata/status แต่ไม่ควรใช้ n8n execution body เป็นฐานข้อมูลสต็อก หากต้องเก็บประวัติ ให้เพิ่ม Google Sheets หรือฐานข้อมูลที่มีการกำหนด schema, สิทธิ์ และ idempotency โดยตั้งใจ

## 10. หลักฐานทดสอบจริง

วันที่ 12 กันยายน 2026 เวลา 14:31 ไทย:

- Execution: `6683`
- Mode: production webhook
- Status: success
- Runtime: 479 ms
- Request ID: `8b42f964-691f-4765-9ef3-15bd1e83c94a`
- LINE request ID: `b0660a90-99bf-4c93-ae80-737370ad0c4b`
- LINE HTTP status: 200
- ส่ง 2 messages: Flex Card + รายละเอียดเต็ม
- ข้อมูลตัวอย่างครบ 90/90 ช่อง
- ผู้ตรวจ: `Codex ทดสอบระบบ`
- หมายเหตุระบุชัดว่าเป็นข้อมูลทดสอบ ไม่ใช่สต็อกจริง
- Card สรุปของหมด 3 รายการตามนิยาม “ทุกหน่วยของสินค้านั้นเป็น 0”
- หน้าเว็บเปลี่ยนเป็น `LINE รับรายงานนี้แล้ว`
- ชุดทดสอบโค้ดผ่าน 25/25 ด้วย `node --test tests/*.test.mjs`

ข้อจำกัดของหลักฐาน: LINE ตอบรับ Push และ n8n จบสำเร็จ ไม่ใช่หลักฐานว่าสมาชิกทุกคนเปิดอ่านแล้ว

## 11. ไฟล์สำคัญ

- `ladprao-stock.html` — ฟอร์มมือถือ, หมวด, validation ฝั่ง browser และสถานะส่ง
- `api/ladprao-stock.js` — Vercel server bridge, staff auth, server validation และ n8n call
- `lib/catalog.js` — catalog ต้นทางที่นำมาใช้
- `lib/ladprao-report.js` — 90 slots, validation และ receipt validation
- `lib/ladprao-delivery.js` — สร้าง payload LINE, Flex + รายละเอียดและ retry classification
- `lib/stock-card.js` — Flex Stock Card
- `tests/ladprao-report.test.mjs`, `tests/ladprao-delivery.test.mjs`, `tests/lib.test.mjs` — automated tests
- `richmenu-ladprao-stock-1200x405.png` — Rich Menu image

การ deploy ที่ปลอดภัยต้องส่งเฉพาะไฟล์เว็บ/API ที่จำเป็น ห้าม deploy Markdown หรือเอกสารภายในไปยัง public root การตรวจครั้งล่าสุดยืนยันหน้าเว็บตอบ 200 และไฟล์ `LINE_OA_FOUNDATION.md` ตอบ 404

## 12. วิธีตรวจสุขภาพโดยไม่ส่งข้อความ

1. เปิดหน้า Production และตรวจข้อความว่าปลายทางคือ `ลาดพร้าว 122 Operation`
2. POST โดยไม่มี/รหัสพนักงานผิด ต้องได้ 401
3. ใช้ manual n8n branch ตรวจ `/v2/bot/info`, group summary และ validation endpoint
4. รัน `node --test tests/*.test.mjs`
5. อย่าทดสอบปุ่ม Submit ด้วยข้อมูลครบถ้าไม่ต้องการให้มีข้อความจริงในกลุ่ม

## 13. วิธีใช้แพตเทิร์นนี้กับสาขาหรืองานอื่น

แยกค่าที่ต้องเปลี่ยนต่อ deployment:

- OA/channel/credential ของธุรกิจนั้น
- verified Group ID และชื่อกลุ่ม
- branch name และ catalog
- Vercel project/domain
- n8n workflow/form webhook/inbound credential
- Rich Menu record, action URL และช่วงแสดงผล
- staff authentication และนโยบายเก็บข้อมูล

ห้าม copy token, secret, Group ID หรือ catalog ไปงานใหม่โดยไม่ตรวจ LINE API และ Product Truth ของสาขานั้นก่อน ให้ทดสอบตามลำดับ: schema validation แบบไม่ส่ง → OA identity → group summary → validation endpoint → test message ที่ติดป้ายชัด → ผู้ใช้ยืนยันในกลุ่ม

## 14. งานต่อยอดที่แนะนำ

1. Google Sheets history: เก็บ requestId, เวลา, ผู้ตรวจ, 90 quantities, note, delivery status และ LINE request ID พร้อม unique requestId
2. Individual identity: ใช้ LIFF/LINE Login หรือบัญชีพนักงานแทน shared key
3. Outbox/recovery: บันทึกรายงานก่อน Push เพื่อแก้ timeout/reload และรองรับ retry ที่ตรวจสอบได้
4. Catalog governance: แยก catalog ลาดพร้าวจาก catalog หาดใหญ่เมื่อรายการจริงได้รับการยืนยัน
5. Rate limiting/monitoring: จำกัดคำขอผิดซ้ำและแจ้งเตือนเมื่อ workflow ล้มเหลว โดยต้องเลือกระบบแจ้งเตือนก่อนเปิด
6. เปลี่ยน Rich Menu ก่อนหมดช่วงแสดง 20 มีนาคม 2027

