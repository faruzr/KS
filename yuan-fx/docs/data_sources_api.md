# 🔌 แหล่งข้อมูลราคา & ข่าว + API — สำหรับติดตาม/พยากรณ์ CNY→THB

> _ปรับปรุง มิ.ย. 2026 — ลิมิต free tier เปลี่ยนได้ ควรเช็คหน้า docs ล่าสุดก่อนสมัคร_

---

## 1. ราคาคู่เงิน (CNYTHB / USDCNH / USDTHB)

### 🟢 TradingView (ใช้กับ Pine Script ของเรา — ฟรีพอใช้งาน)
| สัญลักษณ์ | ใช้ทำอะไร |
|---|---|
| `FX_IDC:CNYTHB` | เรทบาท/หยวน — ตัวหลักของ indicator |
| `OANDA:USDCNH` หรือ `FX_IDC:USDCNH` | หยวน offshore (ตัวขับเคลื่อนเบื้องหลัง) |
| `FX_IDC:USDTHB` หรือ `FX:USDTHB` | แยกว่าขยับเพราะ "บาท" |
- ฟรี: ดูกราฟ + เขียน Pine + ตั้ง alert ได้ (จำกัดจำนวน indicator/alert ในแพลนฟรี)
- เสียเงิน: ข้อมูล intraday เรียลไทม์/หลาย alert ต้องอัปเกรด

### 🟢 API ดึงเรทอัตโนมัติ (ฟรี/มี free tier)
| บริการ | CNY/THB | Free tier | Auth | หมายเหตุ |
|---|---|---|---|---|
| **exchangerate.host** | ✅ ทั้งคู่ | ฟรี (มีคีย์) | API key | ง่ายสุด มี historical |
| **Frankfurter (ECB)** | ⚠️ CNY ได้, THB ได้ | ฟรี ไม่ต้องคีย์ | ไม่ต้อง | อิงเรท ECB รายวัน (ไม่เรียลไทม์, ไม่มี CNH) |
| **open.er-api.com / ExchangeRate-API** | ✅ | ฟรี 1.5k/เดือน | optional | |
| **Twelve Data** | ✅ (forex) | 800 req/วัน | API key | มี intraday, websocket |
| **Alpha Vantage** | ✅ FX + News | 25 req/วัน (ฟรี) | API key | มี **News & Sentiment** ด้วย |
| **Polygon.io** | ✅ forex | จำกัด/เดือน | API key | ระดับมือโปร |
| **Wise API** | ✅ | ต้องสมัคร business | OAuth | เรทใกล้ mid-market จริง |

### 🏛️ แหล่งทางการ
- **ธนาคารแห่งประเทศไทย (BOT)** — เรทอ้างอิงรายวัน + **API portal** (`apiportal.bot.or.th`) มี FX rate API (ต้องสมัคร)
- **PBOC / CFETS** — central parity fixing รายวัน (เรทอ้างอิงทางการของจีน)

---

## 2. เรทกสิกร (KBank) — ตัวที่คุณจ่ายจริง
- **หน้า FX ทางการ**: `kasikornbank.com` → Rates → Foreign Exchange → ดูแถว **CNY** ช่อง **Selling (TT)** = เรทที่คุณต้องจ่ายเมื่อโอนเงินไปจีน
- ⚠️ KBank **ไม่มี public API สำหรับรายย่อย** — วิธีดึงอัตโนมัติคือ scrape หน้าเว็บ (HTML table) วันละครั้ง
- **K GLOBAL TRADE / KBank Biz**: ลูกค้าธุรกิจที่โอนก้อนใหญ่ ขอ **เรตพิเศษ (preferential rate)** ได้ — คุยกับ RM
- **เทียบทางเลือก**: Super Rich, บริการโอนเงิน (Wise/DeeMoney) อาจได้ spread ดีกว่าแบงก์สำหรับบางก้อน
- 👉 ใน Pine Script เราใส่ช่อง "KBank TT Sell" ให้กรอกเอง เพื่อเห็น **spread เทียบ mid-market** ทุกวัน

---

## 3. News API (ถ้าจะต่อยอดเลเยอร์ข่าว/sentiment)
| บริการ | ครอบคลุมจีน/หยวน | Free tier | หมายเหตุ |
|---|---|---|---|
| **NewsAPI.org** | ✅ | ฟรี (dev, ไม่ใช่ commercial) | ค้นคีย์เวิร์ด "yuan/PBOC/China tariff" |
| **GDELT** | ✅✅ ทั่วโลก | ฟรีจริง | ข่าว+โทนความรู้สึก ระดับ global ดีมากสำหรับ sentiment |
| **Marketaux** | ✅ การเงิน | ฟรีจำกัด | tag เป็นรายสินทรัพย์ |
| **Finnhub** | ✅ | ฟรีจำกัด | มี news + economic calendar |
| **Alpha Vantage News & Sentiment** | ✅ | 25/วัน | ให้คะแนน sentiment มาเลย |
| **Google News RSS** | ✅ | ฟรี | `news.google.com/rss/search?q=...` ง่ายสุดสำหรับ prototype |

> สำหรับ **NotebookLM**: ดูชุดลิงก์ที่คัดมาให้ใน `notebooklm_sources.md`

---

## 4. คำแนะนำเชิงปฏิบัติ (Stack ที่แนะนำสำหรับคุณ)
1. **ดู/ตั้งเตือน**: TradingView (ฟรี) + Pine Script ของเรา บน `FX_IDC:CNYTHB` รายวัน
2. **เทียบเรทจ่ายจริง**: เปิดหน้า FX กสิกรทุกเช้า กรอกเลข TT Sell ลง indicator
3. **(ออปชัน) เก็บข้อมูลเอง**: cron ดึง exchangerate.host (CNYTHB, USDCNH, USDTHB) วันละครั้งลง Google Sheet/CSV
4. **(ออปชัน) ข่าว**: GDELT หรือ Google News RSS ดึงพาดหัว "PBOC / yuan / China tariff" มาช่วยเตือนเหตุการณ์ใหญ่
5. **การโอนจริง**: ก้อนใหญ่คุย RM ขอเรตพิเศษ / เทียบ Wise ก่อนกดโอน

> หมายเหตุ: คนไทยทั่วไป **แลก/โอนผ่านแบงก์ (เช่นกสิกร)** ไม่ได้เทรด CNH ผ่านโบรกเกอร์ —
> TradingView ใช้เพื่อ "ดูจังหวะ" เท่านั้น การจ่ายจริงทำที่แบงก์
