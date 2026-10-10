# Ladprao stock form — local implementation checkpoint

> เอกสารนี้ถูกแทนที่สำหรับสถานะ Production โดย `LADPRAO_STOCK_RUNBOOK.md` เก็บไว้เป็นประวัติการออกแบบและขอบเขตก่อนเปิดจริง

## CURRENT OVERRIDE — 12 September 2026: no Supabase / no persistence

FARU explicitly removed Supabase and durable stock history from current scope. The older persistence plan below is superseded, not an activation requirement for this sending-only version.

- Current path: Rich Menu → form → same-origin API → authenticated n8n form webhook → LINE push. No stock database writes.
- Receipt is `{requestId,delivery:"accepted",lineRequestId}`; never return `saved:true`. LINE acceptance is not proof all members received/read the card.
- `lib/ladprao-delivery.js` builds a summary Flex + complete stock quantities grouped by product/units + note. Group ID is fixed server-side to the verified Operation group.
- RequestId is sent as X-Line-Retry-Key from the first request. Retry same content/key only; LINE retains keys for 24 hours. Client blocks retry after 23 hours. Reloading the browser loses request state: inspect the group before submitting a fresh report.
- New n8n form branch is a draft with a DISABLED trigger `Receive stock form — setup pending` at `ks-ladprao-stock-submit`. Existing LINE event webhook is separate. No real group messages sent during setup.
- Before activation: create a dedicated inbound Header Auth credential (`X-KS-Stock-Secret`), wire the same value into server-only KS_STOCK_N8N_SECRET, set server-only KS_STOCK_N8N_URL and KS_STOCK_STAFF_KEY, apply edge rate limiting, then enable/publish ONLY after review. Keep KS_STOCK_READY unset until live test succeeds.
- Need approved hosting/deployment destination for `/ladprao-stock.html` and `/api/ladprao-stock`; the local Python preview serves HTML only, not the API. Never put localhost in Rich Menu.
- Validate LINE message payload with the validation endpoint before explicit group-send test. Then configure Rich Menu with the real HTTPS URL. Do not publish a menu with an unusable link.

## Superseded persistence proposal (not current scope)

New isolated files: `ladprao-stock.html`, `lib/ladprao-report.js`, `api/ladprao-stock.js`.
Old Hat Yai pages and old workflows are unchanged. This is NOT deployed or connected end-to-end.

## Intended path

Rich Menu link → ladprao-stock.html → same-origin /api/ladprao-stock → authenticated n8n form webhook → durable report/outbox → LINE group.
The existing `ks-ladprao-line` webhook receives LINE events. Do NOT use it as the form submission endpoint.

## Required before activation

- Confirm the reused catalog for Ladprao; page currently labels it a draft.
- Select/approve deployment target and confirm serverless support for the new API route.
- Provision a high-entropy staff access key out of band; do not put it in the link, source, or local storage. This draft uses shared staff access, not individual staff identity. Add rate limiting at the deployment edge before public access.
- Configure server-only KS_STOCK_N8N_URL (HTTPS new form webhook), KS_STOCK_N8N_SECRET and KS_STOCK_STAFF_KEY.
- Build form branch in the NEW n8n workflow only. Validate inbound secret before processing; validate catalog and payload server-side.
- Persist report and delivery job atomically with UNIQUE requestId and payload hash. Repeated identical request returns original receipt; changed payload with same requestId must return conflict. Never rely on workflow memory for this.
- Persist LINE retry key per delivery; retry the same key, do not send a second independent push after a timeout. Check supported LINE retry behavior before activation. Keep delivery failure observable for operator review.
- OA token stays in n8n credentials. Verify bot identity and candidate group name (`ลาดพร้าว 122 Operation`) before sending. Candidate ID is documented in LINE_OA_FOUNDATION.md, not trusted browser input.
- Return only after durable save: `{requestId,reportId,saved:true,delivery:"sent"|"pending"|"failed"}`. Only use `sent` after a verified LINE API acceptance; not proof every member read the card.
- Test complete count, missing count, explicit zero, decimal, note, double tap, timeout-after-save, retry, LINE failure, invalid staff key, invalid inbound secret, and wrong group.
- Set KS_STOCK_READY=true only after those gates. Remove the draft notice only after catalog and live integration are approved. Do not deploy or change Rich Menu automatically.

## Current boundary

The local form validates complete counts, sends a stable requestId, locks the payload during uncertain outcomes, and distinguishes save from delivery. Browser reload recovery is not implemented: keep the page open after an uncertain response. The n8n persistence/delivery branch and credentials remain unconfigured. The server bridge returns 503 by default rather than claiming a saved report.
