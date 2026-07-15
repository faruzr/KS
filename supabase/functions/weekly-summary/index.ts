// หน้า FARU → ดึงยอดแนะนำสั่ง (จาก view v2_suggestions) + สถานะการนับอาทิตย์นี้
import { createClient } from 'npm:@supabase/supabase-js@2';
import { weekStartBangkok, CORS, json } from '../_shared/week.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'GET') return json(405, { status: 'error', message: 'method not allowed' });

  const branchId = 1;
  const week = weekStartBangkok();
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  const { data: items, error } = await sb
    .from('v2_suggestions')
    .select('item_name, unit, last_remaining, last_week, max_used_8w, used_weeks, suggested_qty')
    .eq('branch_id', branchId);
  if (error) return json(500, { status: 'error', message: error.message });

  // เวลาที่น้องส่งนับล่าสุดของอาทิตย์นี้
  const { data: last } = await sb
    .from('weekly_history')
    .select('updated_at')
    .eq('branch_id', branchId).eq('week_start_date', week).eq('source', 'staff-form')
    .order('updated_at', { ascending: false }).limit(1).maybeSingle();

  return json(200, {
    status: 'ok',
    week_start_date: week,
    last_count_at: last?.updated_at ?? null,
    items: items ?? [],
  });
});
