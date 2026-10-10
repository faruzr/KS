import { LADPRAO_SHEETS } from './ladprao-catalog.js';

export const REPORT_BRANCH = 'ลาดพร้าว 122';
export const REPORT_SLOTS = LADPRAO_SHEETS.flatMap((sheet, sheetIndex) => sheet.flatMap(group =>
  group.items.map(([name, unit]) => ({ name, label: name, unit, category: group.section, sheet: sheetIndex }))));

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
    mapped.set(key, { qty: item.qty_remaining, note: (item.note ?? '').trim() });
  }
  const items = REPORT_SLOTS.map(slot => {
    const key = JSON.stringify([slot.name, slot.unit]);
    if (!mapped.has(key)) throw new Error('รายการสินค้าไม่ตรงกับแบบฟอร์ม');
    const { qty, note } = mapped.get(key);
    return { name: slot.name, unit: slot.unit, qty_remaining: qty, note };
  });
  return { requestId: input.requestId, branch: REPORT_BRANCH, submittedBy: input.submittedBy.trim(), note: input.note.trim(), items };
}

export function reportReceipt(body, requestId) {
  if (body?.requestId !== requestId || body?.delivery !== 'accepted' || typeof body.lineRequestId !== 'string' || !body.lineRequestId) throw new Error('ยังยืนยันว่า LINE รับรายงานไม่ได้');
  return { requestId, delivery: 'accepted', lineRequestId: body.lineRequestId };
}
