// รายการเช็คสต็อก สาขาลาดพร้าว 122 — ตามใบ "Stock List Lat Phrao122 2026" ที่ FARU ส่งมา 8 ต.ค. 2026
// แยกจาก catalog.js (หาดใหญ่) · 1 แผ่น = 1 รูปที่ส่งเข้ากลุ่ม LINE · [ชื่อ, หน่วย]
const LADPRAO_SHEETS = [
  [
    { section:'วัตถุดิบกงสี', items:[
      ['ไข่มุกดำ','ลัง'],
      ['ใบชาแดง','ถุง'],
      ['ใบชาเขียว','ถุง'],
      ['ใบมะลิ','ถุง'],
      ['ใบชาไทย','ถุง'],
      ['ผงโอเลี้ยง','ถุง'],
      ['ผงครีมชีส','ถุง'],
      ['ซอสบราวน์ชูการ์','แกลลอน'],
      ['ไซรัปแดงโบราณ','แกลลอน'],
      ['ฝาซีลแก้ว','ม้วน'],
      ['แก้ว','ลัง'],
      ['หลอดเล็ก','แพ็ค'],
      ['หลอดไข่มุก','แพ็ค'],
      ['ไซรัปมะปี๊ด','ขวด'],
      ['มะนาวแบบน้ำ 1 กก.','ถุง'],
      ['ถุงใส่ชาแบบขุ่น ขนาด 16*26','แพ็ค'],
    ]},
    { section:'วัตถุดิบทั่วไป', items:[
      ['ไซรัปลองบีช กลิ่น คาราเมล','ขวด'],
      ['ไซรัปลองบีช กลิ่น โยเกิร์ต','ขวด'],
      ['ไซรัปลองบีช กลิ่น พีช','ขวด'],
      ['ไซรัปลองบีช กลิ่น มิ้นท์','ขวด'],
      ['ไซรัปติ่งฟง กลิ่น บลูฮาวาย','ขวด'],
      ['ไซรัปติ่งฟง กลิ่น บลูเบอร์รี่','ขวด'],
      ['ไซรัปติ่งฟง กลิ่น สตอเบอร์รี่','ขวด'],
      ['ไซรัปติ่งฟง กลิ่น แอปเปิ้ล','ขวด'],
      ['ไซรัปติ่งฟง กลิ่น ลิ้นจี่','ขวด'],
      ['ไซรัปติ่งฟง กลิ่น เสาวรส','ขวด'],
      ['น้ำผลไม้เข้มข้น ซันควิก รสผลไม้รวม','ขวด'],
      ['น้ำผลไม้เข้มข้น ซันควิก รสส้มชนิดเข้มข้น','ขวด'],
      ['เฮลส์บลูบอยแดง','ขวด'],
      ['ผงโกโก้ ทิวลิป สีเข้ม','ถุง'],
      ['ผงไมโล','ถุง'],
      ['ผงโอวัลติน สูตร 3','ถุง'],
      ['ผงเนสกาแฟเรดคัพแบบถุง','ถุง'],
      ['น้ำผึ้งแท้','ขวด'],
      ['เจลลี่ฟรุตสลัด กลิ่น ผลไม้รวม','ถุง'],
    ]},
  ],
  [
    { section:'วัตถุดิบทั่วไป', items:[
      ['นมจืด เมจิ แกนลอน 2 ลิตร','แกลลอน'],
      ['นมข้นจืด คาเนชั่น เอ็กส์ตร้า 385 กรัม','ถาด'],
      ['นมข้นหวาน คาเนชั่น 388 กรัม','ถาด'],
      ['น้ำตาลมิตรผล กลิ่น คาราเมล','แพ็ค'],
      ['น้ำเชื่อมมิตรผล ถุงสีม่วง','ลัง'],
      ['ผงครีมเทียม ดรีมมี่ ถุงสีฟ้า','ลัง'],
      ['เนื้อมะม่วงหั่นเต๋าแช่แข็ง','ถุง'],
      ['เนื้อส้มแช่แข็ง','ถุง'],
      ['เนื้อพีช แช่แข็ง','ถุง'],
      ['เนื้อมิกซ์เบอร์รี่ แช่แข็ง','ถุง'],
      ['ถุงใส่แก้วน้ำ 1 ช่อง','แพ็ค'],
      ['ถุงหิ้วชนิด ใส เหนียวขนาด 6*14','แพ็ค'],
      ['ถุงหิ้วชนิด ใส เหนียวขนาด 8*16','แพ็ค'],
      ['ถ้วยใส่ท็อปปิ้ง ขนาด 2 ออนซ์','แพ็ค'],
      ['ถุงซิปล็อคขนาด 15*21','แพ็ค'],
      ['ถุงซิปล็อคขนาด 20*28','แพ็ค'],
      ['ยางวงเส้นใหญ่','แพ็ค'],
      ['ถุงขยะแบบหนา ขนาด 30*40 Hero','แพ็ค'],
      ['กระดาษทิสชู่เอนกประสงค์ (6 ม้วน)','แพ็ค'],
      ['น้ำยาล้างจาน','ถุง'],
      ['น้ำยาถูพื้น','ถุง'],
      ['ฝาโดม ขนาดปาก 95 รูใหญ่','แถว'],
      ['โอวัลติน เฟลค (ท๊อปปิ้ง)','ถุง'],
      ['น้ำยาทำความสะอาดเคาน์เตอร์เอนกประสงค์','ขวด'],
      ['ไซรัปติ่งฟง มะม่วง','ขวด'],
      ['ไซรัปติ่งฟง สับปะรด','ขวด'],
      ['สับปะรดกระป๋อง McGarratt','แพ็ค'],
      ['ลำไยกระป๋อง ตรา Savepak','แพ็ค'],
      ['เอโร่ถ้วยน้ำจิ้ม+ฝา 3 ออนซ์*50','แพ็ค'],
      ['ปีโป้ รสผลไม้รวม','แพ็ค'],
      ['ขนมปังฟาร์มเฮ้าส์ 1 ปอนด์','ถุง'],
      ['เนยสดชนิดเค็ม อลาวรี่ 227 กรัม','ก้อน'],
      ['ปูอัดแบบแท่ง','แพ็ค'],
      ['ไข่กุ้ง','กระปุก'],
      ['มายองเนส คิวพี','ขวด'],
      ['มายองเนสซอสพริก คิวพี','ขวด'],
      ['มัสตาร์ท','ขวด'],
      ['แฮมไก่','แพ็ค'],
      ['ชีสแผ่นสไลด์ ขนาด 84แผ่น','แพ็ค'],
    ]},
  ],
  [
    { section:'สั่งออนไลน์', items:[
      ['ผงเผือก อี้เหวิน','ถุง'],
      ['บ๊วยดอง กระปุกใหญ่','กระปุก'],
      ['เนื้อมะปี๊ด','กิโลกรัม'],
      ['บุกป๊อปรสลิ้นจี่ ยี่ห้อเทนจู','กระปุก'],
      ['บุกป๊อปรสสตอเบอรี่ ยี่ห้อเทนจู','กระปุก'],
      ['บุกป๊อปรสยูสุ ยี่ห้อเทนจู','กระปุก'],
      ['วุ้นมะพร้าวเม็ดเล็ก ยี่ห้อ ทีอีเอ','ถุง'],
      ['ผงพุดดิ้งไข่ ยี่ห้อ POSSMEI','ถุง'],
    ]},
    { section:'PK พาณิชย์ BKK', items:[
      ['บุกติ่งฟง รสน้ำตาล','ลัง'],
      ['บุกติ่งฟง รสน้ำผึ้ง','ลัง'],
      ['บุกติ่งฟง รสบราวน์ชูการ์','ลัง'],
    ]},
    { section:'Soda Supplier', items:[
      ['โซดาร็อคเมาเท้น','ถาด'],
    ]},
    { section:'Asia Paper Roll', items:[
      ['กระดาษปริ้นความร้อน ขนาด 80*80 มม.','แพ็ค'],
    ]},
    { section:'Supplier', items:[
      ['สังขยาไข่','กระปุก'],
      ['สังขยาไข่ใบเตย','กระปุก'],
    ]},
  ],
];

// ของเสียง่าย: ถ้ายังมีของเหลือ (> 0) ต้องกรอก EXP (วันหมดอายุที่ใกล้สุด) · รายการอื่นกรอก EXP ได้แต่ไม่บังคับ
// ร่างโดย Claude 10 ต.ค. 2026 จากชื่อสินค้า — รอ FARU/หน้าร้านยืนยัน
const EXP_REQUIRED = new Set([
  'นมจืด เมจิ แกนลอน 2 ลิตร',
  'เนื้อมะม่วงหั่นเต๋าแช่แข็ง', 'เนื้อส้มแช่แข็ง', 'เนื้อพีช แช่แข็ง', 'เนื้อมิกซ์เบอร์รี่ แช่แข็ง',
  'มะนาวแบบน้ำ 1 กก.',
  'ขนมปังฟาร์มเฮ้าส์ 1 ปอนด์', 'เนยสดชนิดเค็ม อลาวรี่ 227 กรัม', 'ปูอัดแบบแท่ง', 'ไข่กุ้ง',
  'มายองเนส คิวพี', 'มายองเนสซอสพริก คิวพี', 'แฮมไก่', 'ชีสแผ่นสไลด์ ขนาด 84แผ่น',
  'สังขยาไข่', 'สังขยาไข่ใบเตย',
]);

// ใกล้หมดอายุ = EXP ภายในกี่วันนับจากวันส่งรายงาน (นับสต็อกสัปดาห์ละครั้ง → 7 วัน, FARU เลือก 10 ต.ค. 2026)
const EXP_WARN_DAYS = 7;


const REPORT_BRANCH = 'ลาดพร้าว 122';
const REPORT_SLOTS = LADPRAO_SHEETS.flatMap((sheet, sheetIndex) => sheet.flatMap(group =>
  group.items.map(([name, unit]) => ({ name, label: name, unit, category: group.section, sheet: sheetIndex, expRequired: EXP_REQUIRED.has(name) }))));

function validateReport(input) {
  if (!input || input.branch !== REPORT_BRANCH) throw new Error('สาขาไม่ถูกต้อง');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.requestId || '')) throw new Error('รหัสรายงานไม่ถูกต้อง');
  if (typeof input.submittedBy !== 'string' || !input.submittedBy.trim() || input.submittedBy.length > 100) throw new Error('กรุณาระบุชื่อผู้ตรวจ ไม่เกิน 100 ตัวอักษร');
  if (typeof input.note !== 'string' || input.note.length > 2000) throw new Error('หมายเหตุต้องไม่เกิน 2,000 ตัวอักษร');
  if (!Array.isArray(input.items) || input.items.length !== REPORT_SLOTS.length) throw new Error('กรุณากรอกสต็อกให้ครบทุกช่อง ของหมดให้ใส่ 0');
  const mapped = new Map();
  for (const item of input.items) {
    if (!item || typeof item.name !== 'string' || typeof item.unit !== 'string') throw new Error('รายการไม่ถูกต้อง');
    const key = JSON.stringify([item.name, item.unit]);
    if (mapped.has(key)) throw new Error('รายการซ้ำ');
    if (typeof item.qty_remaining !== 'number' || !Number.isFinite(item.qty_remaining) || item.qty_remaining < 0) throw new Error('จำนวนต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป');
    if (item.note !== undefined && (typeof item.note !== 'string' || item.note.length > 50)) throw new Error('หมายเหตุต่อรายการต้องไม่เกิน 50 ตัวอักษร');
    if (item.exp !== undefined && item.exp !== '' && !isIsoDate(item.exp)) throw new Error('วันหมดอายุ (EXP) ไม่ถูกต้อง');
    mapped.set(key, { qty: item.qty_remaining, note: (item.note ?? '').trim(), exp: item.exp || '' });
  }
  const items = REPORT_SLOTS.map(slot => {
    const key = JSON.stringify([slot.name, slot.unit]);
    if (!mapped.has(key)) throw new Error('รายการสินค้าไม่ตรงกับแบบฟอร์ม');
    const { qty, note, exp } = mapped.get(key);
    if (slot.expRequired && qty > 0 && !exp) throw new Error(`กรุณาใส่วันหมดอายุ (EXP) ของ ${slot.name}`);
    return { name: slot.name, unit: slot.unit, qty_remaining: qty, note, exp };
  });
  return { requestId: input.requestId, branch: REPORT_BRANCH, submittedBy: input.submittedBy.trim(), note: input.note.trim(), items };
}

// YYYY-MM-DD ที่เป็นวันจริง (กัน 2026-02-30) ปี 2020–2099 กันพิมพ์ปี พ.ศ.
function isIsoDate(value) {
  if (typeof value !== 'string' || !/^20[2-9]\d-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

function reportReceipt(body, requestId) {
  if (body?.requestId !== requestId || body?.delivery !== 'accepted' || typeof body.lineRequestId !== 'string' || !body.lineRequestId) throw new Error('ยังยืนยันว่า LINE รับรายงานไม่ได้');
  return { requestId, delivery: 'accepted', lineRequestId: body.lineRequestId };
}

const GREEN = '#137C4B';
const GREEN_LIGHT = '#EAF7F0';
const TEXT = '#1F2937';
const MUTED = '#6B7280';
const RED = '#DC2626';

function text(value, { size = 'sm', weight = 'regular', color = TEXT, flex = 0 } = {}) {
  return { type: 'text', text: String(value), size, weight, color, flex, wrap: true };
}

function metricRow(label, value, color = TEXT) {
  return {
    type: 'box',
    layout: 'horizontal',
    spacing: 'md',
    contents: [
      text(label, { color: MUTED, flex: 1 }),
      text(value, { weight: 'bold', color, flex: 0 }),
    ],
  };
}

function formatBangkokDate(input) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) throw new Error('submittedAt must be a valid date');

  return new Intl.DateTimeFormat('th-TH', {
    timeZone: 'Asia/Bangkok',
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function buildStockFlexMessage({
  branch,
  submittedAt,
  submittedBy,
  countedSlots,
  expectedSlots,
  outOfStockCount,
  version = 1,
}) {
  if (!String(branch ?? '').trim()) throw new Error('branch is required');
  if (!String(submittedBy ?? '').trim()) throw new Error('submittedBy is required');

  for (const [name, value] of Object.entries({ countedSlots, expectedSlots, outOfStockCount, version })) {
    if (!Number.isInteger(value) || value < 0) throw new Error(`${name} must be a non-negative integer`);
  }
  if (expectedSlots === 0) throw new Error('expectedSlots must be greater than zero');
  if (countedSlots > expectedSlots) throw new Error('countedSlots cannot exceed expectedSlots');
  if (outOfStockCount > countedSlots) throw new Error('outOfStockCount cannot exceed countedSlots');

  const complete = countedSlots === expectedSlots;
  const submittedLabel = formatBangkokDate(submittedAt);

  return {
    type: 'flex',
    altText: `รายงานสต็อก สาขา${branch} — ${countedSlots}/${expectedSlots} ช่อง`,
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: GREEN,
        paddingAll: '20px',
        spacing: 'sm',
        contents: [
          text('รายงานสต็อกประจำสัปดาห์', { size: 'xl', weight: 'bold', color: '#FFFFFF' }),
          text(`สาขา${branch}`, { size: 'md', color: '#D1FAE5' }),
          text(submittedLabel, { size: 'xs', color: '#D1FAE5' }),
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '20px',
        spacing: 'lg',
        contents: [
          metricRow('ผู้ตรวจ', submittedBy),
          { type: 'separator', color: '#E5E7EB' },
          metricRow('ความครบถ้วน', `${countedSlots} / ${expectedSlots} ช่อง`, complete ? GREEN : '#D97706'),
          metricRow('ของหมด', `${outOfStockCount} รายการ`, outOfStockCount > 0 ? RED : GREEN),
          metricRow('ฉบับรายงาน', `ฉบับที่ ${version}`),
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: GREEN_LIGHT,
        paddingAll: '14px',
        contents: [
          text(complete ? '✓ ส่งรายงานสต็อกครบแล้ว' : '⚠ รายงานยังไม่ครบ', {
            weight: 'bold',
            color: complete ? GREEN : '#D97706',
          }),
        ],
      },
    },
  };
}


const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// EXP แบบที่หน้าร้านใช้: 14/10/69 (วัน/เดือน/ปี พ.ศ. 2 หลัก)
function formatExp(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${String(Number(y) + 543).slice(-2)}`;
}

// จำนวนวันจากวันส่งรายงาน (เวลาไทย) ถึง EXP · ติดลบ = หมดอายุแล้ว
function daysToExp(iso, submittedAt) {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date(submittedAt));
  return Math.round((Date.parse(iso + 'T00:00:00Z') - Date.parse(today + 'T00:00:00Z')) / 86400000);
}

// Stock sheets laid out like the paper "ตารางเช็คสต็อครายการวัตถุดิบ สาขา ลาดพร้าว" (one HTML per sheet in
// LADPRAO_SHEETS). Gotenberg screenshots each one to a 1080px-wide PNG that is sent to LINE as an image.
// Input is the output of validateReport() plus submittedAt.
function buildStockSheetsHtml(report, submittedAt) {
  const sheetCount = Math.max(...REPORT_SLOTS.map(s => s.sheet)) + 1;
  const date = esc(formatBangkokDate(submittedAt));
  return Array.from({ length: sheetCount }, (_, sheet) => {
    let rows = '', section;
    report.items.forEach((item, index) => {
      const slot = REPORT_SLOTS[index];
      if (slot.sheet !== sheet) return;
      if (slot.category !== section) {
        section = slot.category;
        rows += `<tr class="head"><th>${esc(section)}</th><th>หน่วย</th><th>คงเหลือ</th><th>EXP</th><th>หมายเหตุ</th></tr>`;
      }
      const out = item.qty_remaining === 0;
      const days = item.exp ? daysToExp(item.exp, submittedAt) : null;
      const exp = item.exp ? `<td class="c exp${days <= EXP_WARN_DAYS ? ' soon' : ''}">${formatExp(item.exp)}${days < 0 ? ' <span class="tag">เลยวัน</span>' : ''}</td>` : '<td class="c exp"></td>';
      rows += `<tr${out ? ' class="out"' : ''}><td>${esc(slot.label)}</td><td class="c">${esc(item.unit)}</td><td class="c qty">${item.qty_remaining}${out ? ' <span class="tag">หมด</span>' : ''}</td>${exp}<td class="note">${esc(item.note || '')}</td></tr>`;
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
th:nth-child(2),td:nth-child(2){width:110px}
th:nth-child(3),td:nth-child(3){width:140px}
th:nth-child(4),td:nth-child(4){width:150px}
th:nth-child(5),td:nth-child(5){width:200px}
.exp{font-size:23px}
td.soon{color:#DC2626;background:#FEF2F2;font-weight:700}
.note{font-size:22px}
.c{text-align:center}
.qty{font-weight:700}
tr.out td{color:#DC2626;background:#FEF2F2}
.tag{font-size:19px;border:1.5px solid #DC2626;border-radius:5px;padding:0 5px;vertical-align:middle}
</style></head><body><table>
<tr class="title"><td colspan="5">ตารางเช็คสต็อครายการวัตถุดิบ สาขา ลาดพร้าว</td></tr>
<tr class="round"><td colspan="5">รอบวันที่ ${date} · ผู้ตรวจ ${esc(report.submittedBy)}<span>แผ่น ${sheet + 1}/${sheetCount}</span></td></tr>
${rows}
</table></body></html>`;
  });
}


const SHEET_COUNT = Math.max(...REPORT_SLOTS.map(s => s.sheet)) + 1;

function buildLadpraoDelivery(input, imageFileIds) {
  const report = validateReport(input);
  const submittedAt = input.submittedAt;
  if (typeof submittedAt !== 'string' || !Number.isFinite(Date.parse(submittedAt))) throw new Error('วันที่รายงานไม่ถูกต้อง');
  const zeroProducts = new Set(report.items.map(i => i.name));
  for (const item of report.items) if (item.qty_remaining > 0) zeroProducts.delete(item.name);
  const card = buildStockFlexMessage({ branch: report.branch, submittedBy: report.submittedBy, submittedAt,
    countedSlots: report.items.length, expectedSlots: REPORT_SLOTS.length, outOfStockCount: zeroProducts.size });
  card.contents.footer.contents[0].text = 'รายละเอียดสต็อกและหมายเหตุอยู่ในข้อความถัดไป';
  const lines = [`สต็อกคงเหลือ · ${report.branch}`, `ผู้ตรวจ: ${report.submittedBy}`, `รหัสรายงาน: ${report.requestId}`];
  let lastCategory;
  const products = new Map();
  report.items.forEach((item, index) => {
    if (!products.has(item.name)) products.set(item.name, {category:REPORT_SLOTS[index].category, units:[]});
    products.get(item.name).units.push(`${item.qty_remaining} ${item.unit}${item.exp ? ` EXP ${formatExp(item.exp)}` : ''}${item.note ? ` (${item.note})` : ''}`);
  });
  for (const [name, product] of products) {
    if (product.category !== lastCategory) { lines.push(`\n[${product.category}]`); lastCategory = product.category; }
    lines.push(`${name}: ${product.units.join(' / ')}`);
  }
  lines.push('\nหมายเหตุ:', report.note || 'ไม่มี');
  const chunks = []; let chunk = '';
  for (const line of lines) {
    if (chunk.length + line.length + 1 > 4500) { chunks.push(chunk); chunk = ''; }
    chunk += (chunk ? '\n' : '') + line;
  }
  if (chunk) chunks.push(chunk);
  if (chunks.length > 4) throw new Error('รายงานยาวเกินขนาดที่ส่งได้');
  return { requestId:report.requestId, to:'C883b7d59b7673037e094b2e90b0d0a90', messages:withSheetImages([card,...chunks.map(text=>({type:'text',text}))], imageFileIds) };
}

// Group gets the sheet images only (one per sheet, in order). Unless every sheet rendered/uploaded, the card + text are
// sent instead so the report is never lost or half-shown. Drive files shared "anyone with link" are served as direct PNGs
// by lh3 (no redirect), as LINE requires.
function withSheetImages(messages, imageFileIds) {
  if (!Array.isArray(imageFileIds) || imageFileIds.length !== SHEET_COUNT || SHEET_COUNT > 5
    || !imageFileIds.every(id => typeof id === 'string' && /^[A-Za-z0-9_-]{10,200}$/.test(id))) return messages;
  return imageFileIds.map(id => ({ type:'image', originalContentUrl:`https://lh3.googleusercontent.com/d/${id}=w1080`, previewImageUrl:`https://lh3.googleusercontent.com/d/${id}=w480` }));
}

function classifyLineResponse(response, requestId) {
  const headers = response.headers || {};
  const lineRequestId = response.statusCode === 200 ? headers['x-line-request-id'] : response.statusCode === 409 ? headers['x-line-accepted-request-id'] : null;
  if (typeof lineRequestId === 'string' && lineRequestId) return {statusCode:200,requestId,delivery:'accepted',lineRequestId};
  return {statusCode:502,requestId,delivery:'unknown',message:'ยังยืนยันว่า LINE รับรายงานไม่ได้ กรุณาตรวจกลุ่มก่อนลองใหม่'};
}

function catalogHash(value) { let h = 5381; for (let i = 0; i < value.length; i++) h = (Math.imul(h, 33) ^ value.charCodeAt(i)) >>> 0; return h; }

const body = $input.first().json.body ?? {};
const delivery = buildLadpraoDelivery(body);
const report = validateReport(body);
const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date(body.submittedAt));
const catalogCheck = catalogHash(JSON.stringify(REPORT_SLOTS));
return buildStockSheetsHtml(report, body.submittedAt).map((html, i) => ({
  json: { requestId: report.requestId, sheet: i + 1, fileName: `สต็อกลาดพร้าว122_${day}_${report.requestId.slice(0, 8)}_แผ่น${i + 1}.png`, catalogCheck, delivery },
  binary: { data: { data: Buffer.from(html, 'utf8').toString('base64'), mimeType: 'text/html', fileName: 'index.html' } },
}));