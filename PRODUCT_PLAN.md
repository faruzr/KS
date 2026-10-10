# KS Stock Product Plan

อัปเดต: 10 สิงหาคม 2026  
สถานะ: Planned — ยังไม่เริ่ม implementation  
เจ้าของการตัดสินใจธุรกิจ: FARU  
เป้าหมาย: ของไม่ขาด โดยลดเงินจม ของเกิน และของเสียให้น้อยที่สุด

เอกสารนี้เป็นแผนหลักฉบับปัจจุบัน และแทนส่วนแผนงานใน `audit/FARU_TODO.md` ซึ่งมีสถานะเก่าบางรายการ แต่ยังไม่ลบเอกสารเดิมเพราะใช้เป็นประวัติได้

## Product outcome

KS Stock ต้องช่วยให้เจ้าของตอบได้ทุกสัปดาห์ว่า:

1. วันนี้มีของจริงเท่าไร และข้อมูลครบ/สดแค่ไหน
2. ควรสั่งอะไร จำนวนเท่าไร เพราะอะไร
3. คำสั่งนี้ใช้เงินเท่าไร และจะมีของพอใช้กี่สัปดาห์
4. ของใดกำลังเข้า ส่งไม่ครบ เสี่ยงขาด เสี่ยงเกิน หรือเสี่ยงหมดอายุ
5. ใครเป็นคนนับ อนุมัติ ส่งคำสั่ง และรับของ

## Product principles

- ใช้ข้อมูลจริงชุดเดียวสำหรับการนับ การอนุมัติ การสั่ง การรับของ และ Admin
- ห้ามแนะนำยอดสั่งเมื่อข้อมูลไม่ครบ เก่า หรือ master data ไม่พร้อม
- เจ้าของยังเป็นผู้อนุมัติทุกคำสั่ง จนกว่าความแม่นยำจะพิสูจน์ได้
- แยกสถานะ `แนะนำ`, `อนุมัติ`, `ส่งให้ supplier`, `supplier ยืนยัน` และ `รับจริง`
- ไม่รวมจำนวนต่างหน่วยเป็น KPI เดียว เช่น ลัง + ถุง + แกลลอน
- สูตรต้องอธิบายได้ และต้องแสดงผลต่อเงินจมกับจำนวนสัปดาห์ที่ของพอใช้

## NOW — P0: Reliability and single source of truth

เป้าหมาย: ทำให้ระบบเชื่อถือได้ก่อนใช้ยอดแนะนำกับเงินจริง

### P0.1 ฟื้นระบบและกำหนดทางเข้าหลัก

- ตรวจสถานะ Supabase project, DNS, deployed functions และ environment ปัจจุบัน
- เลือก production URL หลักเพียงหนึ่งแห่ง และบันทึกไว้ในเอกสารระบบ
- ใช้ flow หลัก: `พนักงานนับ → เจ้าของตรวจ/อนุมัติ → ส่งคำสั่ง → รับของ`
- เปลี่ยน `/`, `index.html` และ `check.html` ให้ redirect หรือ read-only หลัง flow ใหม่ผ่าน release gate
- เพิ่มสถานะ loading, no history, stale, offline และ error ให้ต่างกันชัดเจน

Acceptance criteria:

- ลิงก์หลักพาพนักงานและเจ้าของไปหน้าที่ถูกต้องโดยไม่ต้องจำชื่อไฟล์
- หน้า public เรียก backend สำเร็จ และมี retry/ข้อความไทยเมื่อ backend ล้มเหลว
- ไม่มีข้อมูลใหม่เขียนเข้าระบบ legacy หลัง cutover

### P0.2 ทำฐานข้อมูลให้สร้างซ้ำและตรวจสอบได้

- ทำ migrations ให้ครบสำหรับ schema, views, grants, RLS และ dependencies ที่ระบบใช้
- แก้ contract ระหว่าง `weekly_history` และ `submit-count` รวมถึงคอลัมน์ `note`
- เพิ่ม schema contract tests และ local database reset test
- กำหนด import staging และห้าม import ทับข้อมูลปฏิบัติการโดยตรง

Acceptance criteria:

- สร้างฐานจากศูนย์ด้วย migrations ได้โดยไม่มี manual schema patch
- DB/API tests จับคอลัมน์ขาด หน่วยผิด และ permission ผิดก่อน deploy
- ไม่มี import ใดแก้ staff count หรือ order ที่เกิดหลัง cutover

### P0.3 สร้าง Count Session ที่ครบและปลอดภัย

- สร้างรอบนับที่มี expected, counted, missing, started_at, submitted_at และผู้ส่ง
- ใช้เวลาสัปดาห์จาก server ไม่เชื่อวันที่จาก client
- ตรวจชื่อสินค้า หน่วย ช่วงจำนวน และสถานะ active จาก master
- ใช้ staff authentication หรือ device credential; ไม่ให้ public anon request เขียนผ่าน service role โดยตรง
- เพิ่ม autosave, restore draft, search และ progress รวมทั้งระบบ

Acceptance criteria:

- สถานะ “นับครบแล้ว” เกิดเมื่อครบทุก active SKU-unit เท่านั้น
- การนับไม่ครบต้องถูก block หรือมี manager override พร้อมเหตุผล
- Reload/เน็ตหลุดไม่ทำให้ข้อมูลที่กรอกไว้หาย
- Backend reject ชื่อ หน่วย วันที่ หรือจำนวนที่ไม่ถูกต้อง

### P0.4 ทำ Master Data ให้ตรงกัน 100%

- ตัดสินใจสถานะ `ถุงซิปล็อค 20×28` และ `ถุงมือไซส์ M`
- แก้ unit typo ในประวัติและ importer
- กำหนด base unit และ conversion สำหรับสินค้าหลายหน่วย
- ตรวจ catalog, inventory master และ historical SKU-unit ก่อนนำเข้า

Acceptance criteria:

- Active inventory = catalog 100%
- Historical exact match ของ `SKU + unit` = 100% หรือถูกแยกเป็นรายการที่ owner ยืนยันว่าเลิกใช้
- ทุกสินค้าหลายหน่วยมี conversion เช่น 1 ลัง = กี่ถุง

### P0.5 รวม Order และ Admin เข้ากับข้อมูลชุดเดียว

- สร้าง order record และ order lines แยกจาก weekly count
- รองรับ Draft → Approved → Sent → Supplier confirmed → Partially received → Received/Cancelled
- เพิ่ม idempotency key เพื่อป้องกันสั่งซ้ำจากการ retry
- ปรับ Admin ให้เห็น count completeness, pending approval, stale data และ order status จากระบบใหม่
- ห้ามรวมจำนวนสินค้าคนละหน่วยเป็นยอดรวมเดียว

Acceptance criteria:

- Admin เห็นการนับและคำสั่งล่าสุดจาก flow ใหม่ทันที
- การกดซ้ำหรือ retry ไม่สร้าง order ซ้ำ
- การคัดลอกข้อความ LINE ไม่ถูกนับว่า supplier ได้รับหรือส่งของแล้ว
- ยอดใช้คำนวณจากของที่รับจริงและ adjustment ไม่ใช่ยอดที่ตั้งใจสั่ง

### P0 release gate

ก่อนเปิดใช้เงินจริง ต้องผ่านทุกข้อ:

- ทดสอบครบหนึ่งรอบ: นับครบ → owner อนุมัติ → ส่ง → รับบางส่วน/ครบ → รอบถัดไปคำนวณถูก
- ทดสอบ stale, incomplete, offline, retry, duplicate และ permission failure
- มี reconciliation ระหว่างยอดก่อนนับ ของรับเข้า ของเสีย และยอดหลังนับ
- Production health check ผ่านบนลิงก์ที่พนักงานใช้จริง
- FARU ตรวจตัวเลขตัวอย่างอย่างน้อย 5 SKU รวมสินค้าหลายหน่วย

## NEXT — P1: Cost-aware procurement

เป้าหมาย: เปลี่ยนจากเครื่องคำนวณจำนวนเป็นระบบคุมเงินจม

### P1.1 Procurement master

เพิ่มข้อมูลต่อ SKU:

- supplier และช่องทางสั่ง
- ราคาซื้อล่าสุด ประวัติราคา และวันที่มีผล
- หน่วยนับ หน่วยสั่ง pack size และ MOQ
- lead time, วันตัดรอบ และรอบส่งของ
- target cover, safety stock, ความสำคัญ และอายุสินค้า

### P1.2 สูตรแนะนำสั่งแบบอธิบายได้

สูตรตั้งต้น:

`ความต้องการช่วงรอของ + safety stock - ของเหลือ - ของกำลังเข้า`

จากนั้นปัดตาม pack/MOQ และจำกัดด้วย max cover, อายุสินค้า และงบซื้อ

กติกา:

- ไม่ใช้ peak หนึ่งสัปดาห์เป็นฐานถาวร
- ต้องมี minimum sample และ anomaly review
- ข้อมูล stale หรือ sample ไม่พอให้ขึ้น “แนะนำไม่ได้”
- การ override เกินเกณฑ์ต้องเลือกเหตุผล

### P1.3 Owner cockpit

แสดงเฉพาะข้อมูลที่ใช้ตัดสินใจ:

- มูลค่าสต็อกและมูลค่าของเกิน
- เงินที่ต้องใช้สั่งรอบนี้
- days/weeks of cover ก่อนและหลังสั่ง
- ของเสี่ยงขาด ของค้างส่ง และของเสี่ยงหมดอายุ
- suggested vs approved พร้อมเหตุผล override
- supplier on-time และ fill rate

P1 acceptance criteria:

- ทุกคำแนะนำแสดงที่มา ราคา และ coverage หลังสั่ง
- เตือนหรือ block เมื่อเกิน max cover, MOQ rule, อายุสินค้า หรืองบที่กำหนด
- เจ้าของเห็นเงินจมและของเสี่ยงขาดจากหน้าเดียว

## LATER — P2: Demand intelligence and optimization

- เชื่อม FoodStory sales กับ recipe/BOM เพื่อเทียบ theoretical usage กับ actual usage
- เก็บ waste, expiry, stock adjustment และ variance reason
- Forecast ตาม trend, วันหยุด, โปรโมชัน และฤดูกาล
- Supplier scorecard และ price variance
- Lot/expiry และ FEFO สำหรับของสดหรือแช่แข็ง
- Cycle count สำหรับสินค้ามูลค่าสูงหรือ variance สูง
- หลายสาขาและการโอนของระหว่างสาขา
- ส่ง PO อัตโนมัติภายหลัง โดยยังมี owner approval จนผ่าน accuracy gate

## Success metrics

North Star:

- สัดส่วนมูลค่าสต็อกที่อยู่ในช่วง target cover

Supporting metrics:

- Excess stock value
- Stockout SKU-days
- Waste/expiry value
- Inventory turns และ days of cover
- Count completion ก่อน cutoff
- Recommendation bias เทียบกับ usage จริง
- Suggested-to-approved variance พร้อมเหตุผล
- PO receipt reconciliation rate
- Supplier on-time และ fill rate

เก็บ baseline อย่างน้อย 4 สัปดาห์ก่อนตั้งเป้าลดเป็นเปอร์เซ็นต์ เพื่อไม่สร้าง KPI จากการเดา

## Decisions and inputs required from FARU

รายการเหล่านี้ไม่ขวางการเริ่ม P0.1–P0.3 แต่ต้องได้คำตอบก่อนจบ P0/P1:

1. `ถุงซิปล็อค 20×28` และ `ถุงมือไซส์ M` ยังใช้งานหรือไม่
2. Conversion ของสินค้าหลายหน่วยทั้งหมด
3. รายชื่อ supplier, ราคาซื้อล่าสุด, MOQ และ lead time
4. วิธี login พนักงานที่เหมาะกับหน้างาน โดยแนะนำบัญชีรายคนหรือ device link มากกว่า PIN กลาง
5. งบสั่งต่อรอบและ target cover ของสินค้าสำคัญ/ของสด

## Explicit non-goals for the first release

- ไม่ส่งคำสั่งถึง supplier อัตโนมัติ
- ไม่ใช้ AI/ML forecast ก่อน count, order และ receipt เชื่อถือได้
- ไม่ทำ multi-branch ก่อนสาขาหาดใหญ่ผ่าน release gate
- ไม่รวมการ redesign ทุกหน้าที่ไม่เกี่ยวกับ flow หลัก
- ไม่ deploy, push หรือรัน production migration โดยไม่มี approval แยกจาก FARU

## Execution order

1. P0.1 Canonical flow and live recovery
2. P0.2 Schema baseline and tests
3. P0.3 Complete and authenticated count sessions
4. P0.4 Master data and unit normalization
5. P0.5 Order lifecycle and unified Admin
6. P0 release gate
7. P1 Procurement master and cost-aware recommendation
8. P1 Owner cockpit
9. P2 Demand intelligence after baseline is stable
