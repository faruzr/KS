// อาทิตย์เริ่มวันอาทิตย์ เวลาไทย (UTC+7, ไม่มี DST) — ตรงกับ stock-count/submit-stock เดิม
export function weekStartBangkok(input?: string): string {
  const d = input ? new Date(input) : new Date();
  if (Number.isNaN(d.getTime())) throw new Error('Invalid date');
  const bkk = new Date(d.getTime() + 7 * 3600_000);
  const start = Date.UTC(bkk.getUTCFullYear(), bkk.getUTCMonth(), bkk.getUTCDate() - bkk.getUTCDay());
  return new Date(start).toISOString().slice(0, 10);
}

export const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-order-pin',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}
