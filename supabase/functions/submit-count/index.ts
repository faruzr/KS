// หน้าน้อง → บันทึก "ของเหลือ" ลง weekly_history (อาทิตย์ปัจจุบัน)
import { createClient } from 'npm:@supabase/supabase-js@2';
import { weekStartBangkok, CORS, json } from '../_shared/week.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json(405, { status: 'error', message: 'method not allowed' });

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.items) || body.items.length === 0)
    return json(400, { status: 'error', message: 'ต้องมี items อย่างน้อย 1 รายการ' });

  const items = [];
  for (const it of body.items) {
    const qty = Number(it.qty_remaining);
    if (!it?.name || !it?.unit || !Number.isFinite(qty) || qty < 0)
      return json(400, { status: 'error', message: `รายการไม่ถูกต้อง: ${JSON.stringify(it)}` });
    items.push({ name: String(it.name).trim(), unit: String(it.unit).trim(), qty });
  }

  const week = weekStartBangkok(body.counted_at);
  const note = (body.note ?? '').trim() || null;
  const branchId = 1;

  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  // resolve item_id best-effort (ไม่ reject ถ้าไม่เจอ — เก็บ item_name ไว้)
  const { data: inv } = await sb.from('inventory_items').select('id, name').eq('is_active', true);
  const idOf = new Map((inv ?? []).map((r: { id: number; name: string }) => [r.name, r.id]));

  const rows = items.map((i) => ({
    branch_id: branchId, item_id: idOf.get(i.name) ?? null,
    item_name: i.name, unit: i.unit, week_start_date: week,
    remaining: i.qty, note, source: 'staff-form',
  }));

  const { error } = await sb.from('weekly_history')
    .upsert(rows, { onConflict: 'branch_id,week_start_date,item_name,unit', ignoreDuplicates: false });
  if (error) return json(500, { status: 'error', message: error.message });

  return json(200, { status: 'ok', week_start_date: week, rows: rows.length });
});
