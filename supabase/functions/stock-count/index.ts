import { createClient } from 'npm:@supabase/supabase-js@2'

type CountItem = {
  name?: string
  unit?: string
  qty_remaining?: number
}

type CountPayload = {
  branch?: string
  counted_at?: string
  note?: string
  items?: CountItem[]
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

// Bangkok has no DST, so a fixed +07:00 offset is safe here.
// (Same logic as submit-stock/index.ts — keep both in sync.)
function toWeekStartBangkok(input: string) {
  const counted = new Date(input)

  if (Number.isNaN(counted.getTime())) {
    throw new Error('Invalid counted_at')
  }

  const bangkokMs = counted.getTime() + (7 * 60 * 60 * 1000)
  const bangkokDate = new Date(bangkokMs)
  const dayOfWeek = bangkokDate.getUTCDay()
  const weekStartUtc = Date.UTC(
    bangkokDate.getUTCFullYear(),
    bangkokDate.getUTCMonth(),
    bangkokDate.getUTCDate() - dayOfWeek,
  )

  return new Date(weekStartUtc).toISOString().slice(0, 10)
}

function normalizePayload(input: CountPayload) {
  const branch = (input.branch ?? '').trim()
  const countedAt = input.counted_at ?? new Date().toISOString()
  const note = (input.note ?? '').trim()
  const items = Array.isArray(input.items) ? input.items : []

  if (!branch) {
    throw new Error('branch is required')
  }

  const cleanedItems = items
    .map((item) => ({
      name: (item.name ?? '').trim(),
      unit: (item.unit ?? '').trim(),
      qtyRemaining: item.qty_remaining,
    }))
    .filter((item): item is { name: string; unit: string; qtyRemaining: number } =>
      item.name !== '' &&
      item.unit !== '' &&
      typeof item.qtyRemaining === 'number' &&
      Number.isFinite(item.qtyRemaining) &&
      item.qtyRemaining >= 0)

  if (cleanedItems.length === 0) {
    throw new Error('items must contain at least one counted entry (qty_remaining >= 0)')
  }

  return {
    branch,
    countedAt,
    note,
    items: cleanedItems,
    weekStartDate: toWeekStartBangkok(countedAt),
  }
}

async function resolveBranch(
  supabase: ReturnType<typeof createClient>,
  branchInput: string,
) {
  const { data: branch, error } = await supabase
    .from('branches')
    .select('id, code, name')
    .or(`code.eq.${branchInput},name.eq.${branchInput}`)
    .eq('is_active', true)
    .maybeSingle()

  if (error) throw error
  return branch
}

async function handleGet(req: Request, supabase: ReturnType<typeof createClient>) {
  const url = new URL(req.url)
  const branchInput = (url.searchParams.get('branch') ?? 'หาดใหญ่').trim()

  const branch = await resolveBranch(supabase, branchInput)

  if (!branch) {
    return jsonResponse(400, { status: 'error', message: `Unknown branch: ${branchInput}` })
  }

  const { data, error } = await supabase
    .from('order_suggestions')
    .select('item_id, item_name, category, unit, last_remaining, last_counted_week, last_counted_at, avg_weekly_use, sample_weeks, suggested_qty')
    .eq('branch_id', branch.id)

  if (error) {
    return jsonResponse(500, { status: 'error', message: error.message })
  }

  return jsonResponse(200, { status: 'ok', branch: branch.name, suggestions: data ?? [] })
}

async function handlePost(req: Request, supabase: ReturnType<typeof createClient>) {
  const payload = normalizePayload(await req.json())

  const branch = await resolveBranch(supabase, payload.branch)

  if (!branch) {
    return jsonResponse(400, { status: 'error', message: `Unknown branch: ${payload.branch}` })
  }

  const itemNames = payload.items.map((item) => item.name)
  const { data: items, error: itemError } = await supabase
    .from('inventory_items')
    .select('id, name')
    .in('name', itemNames)
    .eq('is_active', true)

  if (itemError) throw itemError

  const itemMap = new Map((items ?? []).map((item) => [item.name, item.id]))
  const missingNames = itemNames.filter((name) => !itemMap.has(name))

  if (missingNames.length > 0) {
    return jsonResponse(400, {
      status: 'error',
      message: 'Some items do not exist in inventory_items',
      missing_items: missingNames,
    })
  }

  const { data: count, error: countError } = await supabase
    .from('stock_counts')
    .upsert(
      {
        branch_id: branch.id,
        counted_at: payload.countedAt,
        week_start_date: payload.weekStartDate,
        note: payload.note,
        source: 'form',
        raw_payload: {
          branch: payload.branch,
          counted_at: payload.countedAt,
          note: payload.note,
          items: payload.items,
        },
      },
      { onConflict: 'branch_id,week_start_date' },
    )
    .select('id, week_start_date')
    .single()

  if (countError) throw countError

  const { error: deleteError } = await supabase
    .from('stock_count_items')
    .delete()
    .eq('count_id', count.id)

  if (deleteError) throw deleteError

  const lineItems = payload.items.map((item) => ({
    count_id: count.id,
    item_id: itemMap.get(item.name),
    unit: item.unit,
    qty_remaining: item.qtyRemaining,
  }))

  const { error: lineItemError } = await supabase
    .from('stock_count_items')
    .insert(lineItems)

  if (lineItemError) throw lineItemError

  return jsonResponse(200, {
    status: 'ok',
    count_id: count.id,
    week_start_date: count.week_start_date,
    rows_added: lineItems.length,
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse(500, { status: 'error', message: 'Supabase environment is not configured' })
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)

  try {
    if (req.method === 'GET') {
      return await handleGet(req, supabase)
    }

    if (req.method === 'POST') {
      return await handlePost(req, supabase)
    }

    return jsonResponse(405, { status: 'error', message: 'Method not allowed' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return jsonResponse(400, { status: 'error', message })
  }
})
