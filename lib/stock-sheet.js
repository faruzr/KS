import { REPORT_SLOTS } from './ladprao-report.js';
import { formatBangkokDate } from './stock-card.js';

const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Stock sheets laid out like the paper "ตารางเช็คสต็อครายการวัตถุดิบ สาขา ลาดพร้าว" (one HTML per sheet in
// LADPRAO_SHEETS). Gotenberg screenshots each one to a 1080px-wide PNG that is sent to LINE as an image.
// Input is the output of validateReport() plus submittedAt.
export function buildStockSheetsHtml(report, submittedAt) {
  const sheetCount = Math.max(...REPORT_SLOTS.map(s => s.sheet)) + 1;
  const date = esc(formatBangkokDate(submittedAt));
  return Array.from({ length: sheetCount }, (_, sheet) => {
    let rows = '', section;
    report.items.forEach((item, index) => {
      const slot = REPORT_SLOTS[index];
      if (slot.sheet !== sheet) return;
      if (slot.category !== section) {
        section = slot.category;
        rows += `<tr class="head"><th>${esc(section)}</th><th>หน่วย</th><th>คงเหลือ</th><th>หมายเหตุ</th></tr>`;
      }
      const out = item.qty_remaining === 0;
      rows += `<tr${out ? ' class="out"' : ''}><td>${esc(slot.label)}</td><td class="c">${esc(item.unit)}</td><td class="c qty">${item.qty_remaining}${out ? ' <span class="tag">หมด</span>' : ''}</td><td class="note">${esc(item.note || '')}</td></tr>`;
    });
    return `<!doctype html><html lang="th"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=block" rel="stylesheet">
<style>
*{box-sizing:border-box}
html,body{background:#fff}
body{font-family:'Sarabun','Noto Sans Thai','Loma',sans-serif;font-size:26px;color:#111;margin:0;padding:28px;width:1080px}
table{width:100%;border-collapse:collapse}
td,th{border:2px solid #333;padding:4px 10px;line-height:1.3}
th{font-weight:700;text-align:center}
.title td{font-size:34px;font-weight:700;text-align:center;padding:10px}
.round td{font-weight:700}
.round span{float:right;font-weight:400}
tr.head th{background:#f3f4f6}
th:nth-child(2),td:nth-child(2){width:120px}
th:nth-child(3),td:nth-child(3){width:150px}
th:nth-child(4),td:nth-child(4){width:230px}
.note{font-size:22px}
.c{text-align:center}
.qty{font-weight:700}
tr.out td{color:#DC2626;background:#FEF2F2}
.tag{font-size:19px;border:1.5px solid #DC2626;border-radius:5px;padding:0 5px;vertical-align:middle}
</style></head><body><table>
<tr class="title"><td colspan="4">ตารางเช็คสต็อครายการวัตถุดิบ สาขา ลาดพร้าว</td></tr>
<tr class="round"><td colspan="4">รอบวันที่ ${date} · ผู้ตรวจ ${esc(report.submittedBy)}<span>แผ่น ${sheet + 1}/${sheetCount}</span></td></tr>
${rows}
</table></body></html>`;
  });
}
