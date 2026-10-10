// Bundles the tested lib/ files into the Code nodes of n8n workflow "ลาดพร้าว 122 — Stock Report (Image)" (MRVobiy9MFj1eMbg).
// Run: node scripts/build-n8n-stock-code.mjs → scripts/out/n8n-*.js, then paste each into the node of the same name.
// The catalog lives only in the render node; its output `catalogCheck` must equal the value printed here.
import { readFileSync, writeFileSync } from 'node:fs';
import { REPORT_SLOTS } from '../lib/ladprao-report.js';

const src = f => readFileSync(new URL(`../lib/${f}.js`, import.meta.url), 'utf8').replace(/^import .*;\n/gm, '').replace(/^export /gm, '');
const fn = (f, name) => { const s = src(f); const start = s.indexOf(`function ${name}(`); return s.slice(start, s.indexOf('\n}\n', start) + 3); };
const hashSrc = `function catalogHash(value) { let h = 5381; for (let i = 0; i < value.length; i++) h = (Math.imul(h, 33) ^ value.charCodeAt(i)) >>> 0; return h; }\n`;

const render = `${['ladprao-catalog', 'ladprao-report', 'stock-card', 'stock-sheet', 'ladprao-delivery'].map(src).join('\n')}
${hashSrc}
const body = $input.first().json.body ?? {};
const delivery = buildLadpraoDelivery(body);
const report = validateReport(body);
const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date(body.submittedAt));
const catalogCheck = catalogHash(JSON.stringify(REPORT_SLOTS));
return buildStockSheetsHtml(report, body.submittedAt).map((html, i) => ({
  json: { requestId: report.requestId, sheet: i + 1, fileName: \`สต็อกลาดพร้าว122_\${day}_\${report.requestId.slice(0, 8)}_แผ่น\${i + 1}.png\`, catalogCheck, delivery },
  binary: { data: { data: Buffer.from(html, 'utf8').toString('base64'), mimeType: 'text/html', fileName: 'index.html' } },
}));`;

const push = `${fn('ladprao-delivery', 'withSheetImages')}
const sheets = $('Validate and render stock sheet').all().map(i => i.json);
const SHEET_COUNT = sheets.length;
let imageFileIds = null;
try {
  const ups = $('Upload image to Drive').all().map(i => i.json);
  const shares = $('Share image by link').all().map(i => i.json);
  imageFileIds = ups.map((up, i) => up.id && !up.error && up.mimeType === 'image/png' && shares[i]?.id && !shares[i].error ? up.id : null);
} catch {}
const messages = withSheetImages(sheets[0].delivery.messages, imageFileIds);
return [{ json: { requestId: sheets[0].requestId, imageFileIds, push: { to: sheets[0].delivery.to, messages } } }];`;

const confirm = `${fn('ladprao-delivery', 'classifyLineResponse')}
return [{ json: classifyLineResponse($input.first().json, $('Build LINE push').first().json.requestId) }];`;

writeFileSync(new URL('./out/n8n-render.js', import.meta.url), render);
writeFileSync(new URL('./out/n8n-push.js', import.meta.url), push);
writeFileSync(new URL('./out/n8n-confirm.js', import.meta.url), confirm);
console.log('catalogCheck', new Function(`${hashSrc}return catalogHash`)()(JSON.stringify(REPORT_SLOTS)));
