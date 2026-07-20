Deno.serve(async () => {
  const res = await fetch(
    'https://tpeipvacrtdligxhfomd.supabase.co/storage/v1/object/public/forms/index.html'
  )
  return new Response(res.body, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': 'inline',
      'X-Content-Type-Options': 'nosniff',
    }
  })
})
