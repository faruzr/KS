# 📚 ชุดซอร์สสำหรับ NotebookLM — เงินหยวน (CNY/CNH)

> **วิธีใช้:** เปิด [NotebookLM](https://notebooklm.google.com) → New Notebook → **Add source → Website/URL** →
> วางลิงก์ทีละอัน (หรือ copy หลายอันทีเดียว) → แล้วถาม NotebookLM ด้วย prompt ท้ายไฟล์นี้
>
> _v1 — คัดจากแหล่งหลักที่เข้าถึงได้ทั่วไป (ทีมวิจัยกำลังเสริม URL เฉพาะเจาะจงเพิ่ม)_

---

## 🏛️ A. แหล่งทางการ / ธนาคารกลาง (น่าเชื่อถือสูงสุด)
- https://www.pbc.gov.cn/en/ — People's Bank of China (PBOC) ภาษาอังกฤษ (นโยบาย/fixing)
- https://www.chinamoney.com.cn/english/ — CFETS (ระบบซื้อขายเงินตราจีน, central parity)
- https://www.bot.or.th/en/statistics/exchange-rate.html — เรทอ้างอิงรายวัน ธปท. (BOT)
- https://www.imf.org/en/Countries/CHN — IMF China (Article IV รายงานเศรษฐกิจจีน)
- https://www.bis.org/statistics/eer.htm — BIS effective exchange rate (หยวน real/nominal)
- https://www.federalreserve.gov/releases/h10/ — Fed H.10 ค่าเงินดอลลาร์/หยวน

## 📰 B. ข่าว/บทวิเคราะห์เหตุการณ์ใหญ่
- https://www.reuters.com/markets/currencies/ — Reuters Currencies (ข่าวหยวนเรียลไทม์)
- https://www.reuters.com/markets/asia/ — Reuters Asia markets
- https://en.wikipedia.org/wiki/2015_Chinese_stock_market_turbulence — เหตุการณ์ 8.11/2015
- https://en.wikipedia.org/wiki/China%E2%80%93United_States_trade_war — สงครามการค้า (ไทม์ไลน์ภาษี)
- https://en.wikipedia.org/wiki/Renminbi — ภาพรวมหยวน CNY/CNH กลไก fixing

## 📈 C. ข้อมูลราคา/กราฟ (ใส่เป็น reference)
- https://th.investing.com/currencies/cny-thb — CNY/THB กราฟ + ข่าว
- https://th.tradingview.com/symbols/CNYTHB/ — CNYTHB ชาร์ตและไอเดีย
- https://wise.com/us/currency-converter/cny-to-thb-rate/history — ประวัติ CNY→THB
- https://www.kasikornbank.com/th/rate/Pages/Foreign-Exchange.aspx — เรท FX กสิกร (CNY TT)

## 🎓 D. งานวิจัย/วิชาการ
- https://www.imf.org/en/Publications/WP — IMF Working Papers (ค้น "renminbi"/"RMB exchange rate")
- https://www.bis.org/publ/work.htm — BIS Working Papers (ค้น "CNH"/"offshore renminbi")
- https://www.nber.org/papers?q=renminbi — NBER papers เกี่ยวกับหยวน
- https://papers.ssrn.com/sol3/results.cfm — SSRN (ค้น "RMB forecasting"/"CNH CNY spread")
- Meese & Rogoff (1983) "Empirical exchange rate models of the seventies" — รากฐาน random-walk

---

## 🤖 Prompt แนะนำใช้ใน NotebookLM (ก็อปไปถามได้เลย)
1. _"สรุปเหตุการณ์สำคัญที่ทำให้เงินหยวน (CNY/CNH) อ่อนหรือแข็งผิดปกติ ในช่วง 10 ปีที่ผ่านมา เรียงตามวันที่ พร้อมระบุขนาดการเคลื่อนไหว"_
2. _"ปัจจัยอะไรบ้างที่ส่งผลต่อค่าเงินหยวนมากที่สุด เรียงลำดับความสำคัญ พร้อมอ้างอิงแหล่งข้อมูล"_
3. _"PBOC ใช้กลไก central parity fixing อย่างไร และ 'countercyclical factor' คืออะไร"_
4. _"ส่วนต่างระหว่าง CNH (offshore) กับ CNY (onshore) บอกอะไรเกี่ยวกับแรงกดดันค่าเงิน"_
5. _"สำหรับผู้นำเข้าที่จ่ายเป็นหยวนเป็นประจำ ควรใช้กลยุทธ์จับจังหวะแลกเงินแบบไหนตามงานวิจัย"_
6. _"ช่วงเวลาใดของวัน/ปี ที่หยวนผันผวนมากที่สุด และเพราะอะไร"_

---

## 📝 หมายเหตุการใช้งาน
- NotebookLM อ่านได้ทั้งลิงก์เว็บ, PDF, Google Docs, YouTube (ใส่ลิงก์วิดีโอวิเคราะห์ได้)
- ถ้าเจอ paper เป็น PDF → ดาวน์โหลดแล้วอัปโหลดไฟล์เข้า NotebookLM โดยตรงจะอ่านได้ครบกว่า
- จับคู่กับรายงาน `research_report_th.md` ของเรา (อัปโหลดเข้าไปด้วยเป็น source ได้)
