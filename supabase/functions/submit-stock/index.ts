import { createClient } from 'npm:@supabase/supabase-js@2'

type PayloadItem = {
  tab?: string
  name?: string
  unit?: string
  qty?: number
}

type Payload = {
  branch?: string
  submitted_at?: string
  note?: string
  items?: PayloadItem[]
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

function toWeekStartBangkok(input: string) {
  const submitted = new Date(input)

  if (Number.isNaN(submitted.getTime())) {
    throw new Error('Invalid submitted_at')
  }

  const bangkokMs = submitted.getTime() + (7 * 60 * 60 * 1000)
  const bangkokDate = new Date(bangkokMs)
  const dayOfWeek = bangkokDate.getUTCDay()
  const weekStartUtc = Date.UTC(
    bangkokDate.getUTCFullYear(),
    bangkokDate.getUTCMonth(),
    bangkokDate.getUTCDate() - dayOfWeek,
  )

  return new Date(weekStartUtc).toISOString().slice(0, 10)
}

function normalizePayload(input: Payload) {
  const branch = (input.branch ?? '').trim()
  const submittedAt = input.submitted_at ?? new Date().toISOString()
  const note = (input.note ?? '').trim()
  const items = Array.isArray(input.items) ? input.items : []

  if (!branch) {
    throw new Error('branch is required')
  }

  const cleanedItems = items
    .map((item) => ({
      tab: (item.tab ?? '').trim(),
      name: (item.name ?? '').trim(),
      unit: (item.unit ?? '').trim(),
      qty: Number(item.qty ?? 0),
    }))
    .filter((item) => item.name && item.unit && item.qty > 0)

  if (cleanedItems.length === 0) {
    throw new Error('items must contain at least one qty > 0 entry')
  }

  return {
    branch,
    submittedAt,
    note,
    items: cleanedItems,
    weekStartDate: toWeekStartBangkok(submittedAt),
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse(405, { status: 'error', message: 'Method not allowed' })
  }

  try {
    const payload = normalizePayload(await req.json())
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Supabase environment is not configured')
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { data: branch, error: branchError } = await supabase
      .from('branches')
      .select('id, code, name')
      .or(`code.eq.${payload.branch},name.eq.${payload.branch}`)
      .eq('is_active', true)
      .maybeSingle()

    if (branchError) {
      throw branchError
    }

    if (!branch) {
      return jsonResponse(400, {
        status: 'error',
        message: `Unknown branch: ${payload.branch}`,
      })
    }

    const itemNames = payload.items.map((item) => item.name)
    const { data: items, error: itemError } = await supabase
      .from('inventory_items')
      .select('id, name')
      .in('name', itemNames)
      .eq('is_active', true)

    if (itemError) {
      throw itemError
    }

    const itemMap = new Map((items ?? []).map((item) => [item.name, item.id]))
    const missingNames = itemNames.filter((name) => !itemMap.has(name))

    if (missingNames.length > 0) {
      return jsonResponse(400, {
        status: 'error',
        message: 'Some items do not exist in inventory_items',
        missing_items: missingNames,
      })
    }

    const { data: submission, error: submissionError } = await supabase
      .from('stock_submissions')
      .insert({
        branch_id: branch.id,
        submitted_at: payload.submittedAt,
        week_start_date: payload.weekStartDate,
        note: payload.note,
        source: 'edge_function',
        raw_payload: {
          branch: payload.branch,
          submitted_at: payload.submittedAt,
          note: payload.note,
          items: payload.items,
        },
      })
      .select('id, week_start_date')
      .single()

    if (submissionError) {
      throw submissionError
    }

    const lineItems = payload.items.map((item) => ({
      submission_id: submission.id,
      item_id: itemMap.get(item.name),
      tab_name: item.tab,
      unit: item.unit,
      qty: item.qty,
    }))

    const { error: lineItemError } = await supabase
      .from('stock_submission_items')
      .insert(lineItems)

    if (lineItemError) {
      throw lineItemError
    }

    return jsonResponse(200, {
      status: 'ok',
      submission_id: submission.id,
      week_start_date: submission.week_start_date,
      rows_added: lineItems.length,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    return jsonResponse(400, {
      status: 'error',
      message,
    })
  }
})
