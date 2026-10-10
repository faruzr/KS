import { test } from 'node:test';
import assert from 'node:assert';
import { CATALOG, BRANCH } from '../lib/catalog.js';
import { buildLineMessages } from '../lib/line-message.js';
import { buildStockFlexMessage, formatBangkokDate } from '../lib/stock-card.js';

test('catalog 5 แท็บ', () => assert.deepStrictEqual(CATALOG.map(t=>t.tab), ['กงสิ','ทั่วไป','ออนไลน์','PK BKK','พร้อมเพย์']));
test('กงสิ 14 รายการ', () => assert.strictEqual(CATALOG[0].groups.flatMap(g=>g.items).length, 14));
test('ทุก item มีหน่วย', () => { for (const t of CATALOG) for (const g of t.groups) for (const it of g.items) assert.ok((it.units&&it.units.length)||it.unit, it.name); });
test('ไม่มีชื่อซ้ำ', () => { const n=CATALOG.flatMap(t=>t.groups.flatMap(g=>g.items.map(i=>i.name))); assert.strictEqual(new Set(n).size, n.length); });
test('branch หาดใหญ่', () => assert.strictEqual(BRANCH, 'หาดใหญ่'));

const orders=[{tab:'กงสิ',name:'ไข่มุกดำ',unit:'ลัง',qty:3},{tab:'กงสิ',name:'ใบชาแดง',unit:'ถุง',qty:10},{tab:'ทั่วไป',name:'ผงไมโล',unit:'ถุง',qty:0},{tab:'ออนไลน์',name:'ผงเผือก อี้เหวิน',unit:'ถุง',qty:2}];
test('LINE: ข้าม qty0 + แท็บว่าง', () => assert.deepStrictEqual(buildLineMessages(orders,'19 ก.ค. 69').map(m=>m.tab), ['กงสิ','ออนไลน์']));
test('LINE: รูปแบบครบ', () => { const m=buildLineMessages(orders,'19 ก.ค. 69')[0].text; assert.match(m,/สั่งของกงสิ/); assert.match(m,/1\. ไข่มุกดำ — 3 ลัง/); assert.match(m,/รวม 2 รายการ/); });
test('LINE: ทศนิยม', () => assert.match(buildLineMessages([{tab:'กงสิ',name:'ไข่มุกดำ',unit:'ลัง',qty:2.5}],'x')[0].text, /2\.5 ลัง/));

test('Stock Card: มีเฉพาะรายงานสต็อก', () => {
  const message = buildStockFlexMessage({
    branch: 'ลาดพร้าว', submittedAt: '2026-09-13T07:35:00.000Z', submittedBy: 'น้องเอ',
    countedSlots: 90, expectedSlots: 90, outOfStockCount: 4, version: 1,
  });
  const raw = JSON.stringify(message);
  assert.strictEqual(message.type, 'flex');
  assert.match(raw, /สาขาลาดพร้าว/);
  assert.match(raw, /90 \/ 90 ช่อง/);
  assert.match(raw, /ของหมด/);
  assert.doesNotMatch(raw, /สั่งของ|supplier|PDF/i);
});

test('Stock Card: แยกรายงานไม่ครบจากของหมด', () => {
  const message = buildStockFlexMessage({
    branch: 'ลาดพร้าว', submittedAt: '2026-09-13T07:35:00.000Z', submittedBy: 'น้องเอ',
    countedSlots: 89, expectedSlots: 90, outOfStockCount: 0, version: 1,
  });
  assert.match(JSON.stringify(message), /รายงานยังไม่ครบ/);
});

test('Stock Card: แปลงเวลาเป็นกรุงเทพ', () => {
  const formatted = formatBangkokDate('2026-09-13T07:35:00.000Z');
  assert.match(formatted, /14:35/);
  assert.match(formatted, /2569/);
});

test('Stock Card: reject จำนวนที่เกินจำนวนที่ต้องนับ', () => {
  assert.throws(() => buildStockFlexMessage({
    branch: 'ลาดพร้าว', submittedAt: '2026-09-13T07:35:00.000Z', submittedBy: 'น้องเอ',
    countedSlots: 91, expectedSlots: 90, outOfStockCount: 0, version: 1,
  }), /cannot exceed/);
});
