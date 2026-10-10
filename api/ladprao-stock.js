import { validateReport, reportReceipt } from '../lib/ladprao-report.js';

// Server-side bridge only. Never send LINE credentials or the n8n URL to the browser.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'ใช้ POST เท่านั้น' });
  }
  // No staff key since 8 Oct 2026 (FARU's call): anyone with the form link can submit. n8n still checks its own secret.
  const { KS_STOCK_N8N_URL: url, KS_STOCK_N8N_SECRET: secret, KS_STOCK_READY: ready } = process.env;
  if (ready !== 'true' || !url || !secret) return res.status(503).json({ message: 'ยังไม่เปิดส่งรายงานจริง รอเชื่อม LINE' });
  let payload;
  try {
    const input = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (JSON.stringify(input).length > 100000) throw new Error('ข้อมูลมีขนาดใหญ่เกินไป');
    payload = validateReport(input);
    if (typeof input.submittedAt !== 'string' || !Number.isFinite(Date.parse(input.submittedAt))) throw new Error('วันที่รายงานไม่ถูกต้อง');
    payload.submittedAt = input.submittedAt;
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
  try {
    if (new URL(url).protocol !== 'https:') throw new Error('invalid endpoint');
    const upstream = await fetch(url, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(45000),
      headers: { 'Content-Type': 'application/json', 'X-KS-Stock-Secret': secret, 'Idempotency-Key': payload.requestId },
      body: JSON.stringify(payload),
    });
    if (!upstream.ok) throw new Error('upstream response not confirmed');
    return res.status(200).json(reportReceipt(await upstream.json(), payload.requestId));
  } catch {
    // A timeout may happen AFTER LINE accepts: keep the same retry key.
    return res.status(502).json({ requestId: payload.requestId, status: 'unknown', message: 'ยังยืนยันผลไม่ได้ กรุณาลองตรวจผลด้วยรายงานเดิม ห้ามสร้างรอบใหม่' });
  }
}
