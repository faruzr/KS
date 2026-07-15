// หน้า FARU → ยืนยันยอดสั่ง บันทึก "ordered" ลง weekly_history (อาทิตย์ปัจจุบัน) — มี PIN
import { createClient } from 'npm:@supabase/supabase-js@2';
import { weekStartBangkok, CORS, json } from '../_shared/week.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json(405, { status: 'error', message: 'method not allowed' });

  const pin = req.headers.get('x-order-pin') ?? '';
  const expected = Deno.env.get('ORDER_PIN') ?? '';
  if (!expected || pin !== expected) return json(401, { status: 'error', message: 'PIN ไม่ถูกต้อง' });

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.items) || body.items.length === 0)
    return json(400, { status: 'error', message: 'ต้องมี items อย่างน้อย 1 รายการ' });

  const items = [];
  for (const it of body.items) {
    const qty = Number(it.qty);
    if (!it?.name || !it?.unit || !Number.isFinite(qty) || qty < 0)
      return json(400, { status: 'error', message: `รายการไม่ถูกต้อง: ${JSON.stringify(it)}` });
    items.push({ name: String(it.name).trim(), unit: String(it.unit).trim(), qty });
  }

  const week = weekStartBangkok();
  const branchId = 1;
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  const { data: inv } = await sb.from('inventory_items').select('id, name').eq('is_active', true);
  const idOf = new Map((inv ?? []).map((r: { id: number; name: string }) => [r.name, r.id]));

  const rows = items.map((i) => ({
    branch_id: branchId, item_id: idOf.get(i.name) ?? null,
    item_name: i.name, unit: i.unit, week_start_date: week,
    ordered: i.qty, source: 'faru-confirm',
  }));

  const { error } = await sb.from('weekly_history')
    .upsert(rows, { onConflict: 'branch_id,week_start_date,item_name,unit', ignoreDuplicates: false });
  if (error) return json(500, { status: 'error', message: error.message });

  return json(200, { status: 'ok', week_start_date: week, rows: rows.length });
});
