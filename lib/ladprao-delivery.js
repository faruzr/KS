import { validateReport, REPORT_SLOTS } from './ladprao-report.js';

const SHEET_COUNT = Math.max(...REPORT_SLOTS.map(s => s.sheet)) + 1;
import { buildStockFlexMessage } from './stock-card.js';

export function buildLadpraoDelivery(input, imageFileIds) {
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
    products.get(item.name).units.push(`${item.qty_remaining} ${item.unit}${item.note ? ` (${item.note})` : ''}`);
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
export function withSheetImages(messages, imageFileIds) {
  if (!Array.isArray(imageFileIds) || imageFileIds.length !== SHEET_COUNT || SHEET_COUNT > 5
    || !imageFileIds.every(id => typeof id === 'string' && /^[A-Za-z0-9_-]{10,200}$/.test(id))) return messages;
  return imageFileIds.map(id => ({ type:'image', originalContentUrl:`https://lh3.googleusercontent.com/d/${id}=w1080`, previewImageUrl:`https://lh3.googleusercontent.com/d/${id}=w480` }));
}

export function classifyLineResponse(response, requestId) {
  const headers = response.headers || {};
  const lineRequestId = response.statusCode === 200 ? headers['x-line-request-id'] : response.statusCode === 409 ? headers['x-line-accepted-request-id'] : null;
  if (typeof lineRequestId === 'string' && lineRequestId) return {statusCode:200,requestId,delivery:'accepted',lineRequestId};
  return {statusCode:502,requestId,delivery:'unknown',message:'ยังยืนยันว่า LINE รับรายงานไม่ได้ กรุณาตรวจกลุ่มก่อนลองใหม่'};
}
