import { LADPRAO_SHEETS, EXP_REQUIRED } from './ladprao-catalog.js';

export const REPORT_BRANCH = 'ลาดพร้าว 122';
export const REPORT_SLOTS = LADPRAO_SHEETS.flatMap((sheet, sheetIndex) => sheet.flatMap(group =>
  group.items.map(([name, unit]) => ({ name, label: name, unit, category: group.section, sheet: sheetIndex, expRequired: EXP_REQUIRED.has(name) }))));

export function validateReport(input) {
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

export function reportReceipt(body, requestId) {
  if (body?.requestId !== requestId || body?.delivery !== 'accepted' || typeof body.lineRequestId !== 'string' || !body.lineRequestId) throw new Error('ยังยืนยันว่า LINE รับรายงานไม่ได้');
  return { requestId, delivery: 'accepted', lineRequestId: body.lineRequestId };
}
