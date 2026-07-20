# Legacy System Audit — KS Stock (2026-07-15)

## Supabase project `tpeipvacrtdligxhfomd`

- **เคย pause → FARU กด restore กลับมาแล้ว 2026-07-15** (ไม่ได้ถูกลบ)
  - ตอน pause: DNS ถูกถอด (NXDOMAIN ทุก resolver) → ดูเหมือนถูกลบ แต่ไม่ใช่
  - หลัง restore: resolve ได้ (Cloudflare 172.64.149.246), REST ตอบ 401/ok, functions ตอบ 200
- **Edge Functions เดิมยังทำงาน:**
  - `stock-count` (GET) → 200, คืน `{"status":"ok","branch":"หาดใหญ่","suggestions":[]}` — suggestions ว่าง (ไม่มีข้อมูลนับล่าสุด/โมเดลเก่าไม่มีข้อมูลพอ)
  - `submit-stock` — ยังไม่ทดสอบ (ไม่อยากเขียนข้อมูลขยะ)
- **ตาราง:** `inventory_items`, `branches`, `stock_submissions` ยังอยู่ แต่ **RLS บล็อก anon อ่าน** (`permission denied`) — introspect ผ่าน REST ไม่ได้ ต้อง `supabase login` + link หรือให้ FARU รัน SQL ใน dashboard
  - หมายเหตุ: `inventory_items` schema ต่างจากที่เดา — ไม่มีคอลัมน์ `unit` (PostgREST error 42703)

## ผลต่อแผน v2

- **ข่าวดี:** ไม่ต้องสร้าง project ใหม่ ใช้ตัวเดิมที่ restore แล้วต่อได้เลย
- **แผนเดิมยังใช้ได้:** สร้างตาราง `weekly_history` ใหม่ + import ประวัติจาก Excel (ตาม Task 2, 4) — ไม่ต้องพึ่งตาราง/ข้อมูลเก่า (suggestions ว่าง = ข้อมูลเก่าไม่มีประโยชน์กับสูตรอยู่แล้ว ประวัติจริงมาจาก Excel)
- **บล็อกถัดไป:** ต้อง `supabase login` เพื่อ link + deploy functions ใหม่ + introspect schema จริง

## รายการสินค้า (catalog)

- แหล่งจริง = `check.html` (const CATALOG) — 5 แท็บ, กงสิ 14 + ทั่วไป ~48 + ออนไลน์ 7 + PK BKK 3 + พร้อมเพย์ 3 — clone มาครบแล้ว ใช้ทำ Task 3
