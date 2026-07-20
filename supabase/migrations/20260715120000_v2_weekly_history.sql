-- KS Stock v2 — ตารางประวัติรายอาทิตย์ + view สูตรแนะนำ "หนักสุด 8 อาทิตย์"
-- ไม่แตะ legacy tables (stock_counts / stock_submissions / order_suggestions ฯลฯ)

create table if not exists public.weekly_history (
  id bigint generated always as identity primary key,
  branch_id bigint not null default 1 references public.branches(id),
  item_id bigint references public.inventory_items(id),
  item_name text not null,
  unit text not null,
  week_start_date date not null,
  remaining numeric check (remaining is null or remaining >= 0),
  ordered numeric check (ordered is null or ordered >= 0),
  used numeric,                       -- เก็บค่าจาก Excel ไว้อ้างอิง (view คำนวณ used เองจาก remaining+ordered)
  source text not null default 'excel-import',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (branch_id, week_start_date, item_name, unit)
);

alter table public.weekly_history enable row level security;
-- ตั้งใจไม่มี policy: anon เข้าไม่ได้ ทุกอย่างผ่าน edge function (service role bypass RLS)

create index if not exists weekly_history_item_idx
  on public.weekly_history (branch_id, item_name, unit, week_start_date desc);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists weekly_history_touch on public.weekly_history;
create trigger weekly_history_touch before update on public.weekly_history
  for each row execute function public.touch_updated_at();

-- ── view สูตรแนะนำ ─────────────────────────────────────────────
-- used(สัปดาห์ W) = remaining(W) + ordered(W) − remaining(W ถัดไป)   [ตรงกับ Excel]
-- แนะนำสั่ง = max(used ใน ≤8 สัปดาห์ล่าสุด) − remaining ล่าสุด  (ปัดขึ้น, ไม่ต่ำกว่า 0)
create or replace view public.v2_suggestions as
with base as (
  select branch_id, item_name, unit, week_start_date, remaining, ordered,
         lead(remaining)        over w as next_remaining,
         lead(week_start_date)  over w as next_week
  from public.weekly_history
  window w as (partition by branch_id, item_name, unit order by week_start_date)
),
usage as (
  select branch_id, item_name, unit, week_start_date,
         remaining + coalesce(ordered, 0) - next_remaining as used
  from base
  where next_remaining is not null and (next_week - week_start_date) = 7
),
usage_ranked as (
  select *, row_number() over (partition by branch_id, item_name, unit
                               order by week_start_date desc) as rn
  from usage
  where used >= 0                       -- ข้ามสัปดาห์นับเพี้ยน (used ติดลบ)
),
max8 as (
  select branch_id, item_name, unit,
         max(used) as max_used_8w, count(*) as used_weeks
  from usage_ranked
  where rn <= 8
  group by branch_id, item_name, unit
),
latest as (
  select distinct on (branch_id, item_name, unit)
         branch_id, item_name, unit,
         remaining as last_remaining, week_start_date as last_week
  from public.weekly_history
  where remaining is not null
  order by branch_id, item_name, unit, week_start_date desc
)
select l.branch_id, l.item_name, l.unit,
       l.last_remaining, l.last_week,
       m.max_used_8w, coalesce(m.used_weeks, 0) as used_weeks,
       case when m.max_used_8w is null or l.last_remaining is null then null
            else greatest(0, ceil(m.max_used_8w - l.last_remaining)) end as suggested_qty
from latest l
left join max8 m using (branch_id, item_name, unit);
