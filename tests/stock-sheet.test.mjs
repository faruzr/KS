import {test} from 'node:test';
import assert from 'node:assert/strict';
import {REPORT_BRANCH,REPORT_SLOTS,validateReport} from '../lib/ladprao-report.js';
import {LADPRAO_SHEETS} from '../lib/ladprao-catalog.js';
import {buildStockSheetsHtml} from '../lib/stock-sheet.js';
const report=()=>validateReport({requestId:'11111111-1111-4111-8111-111111111111',branch:REPORT_BRANCH,submittedBy:'<b>แบม</b>',note:'',items:REPORT_SLOTS.map((s,i)=>({name:s.name,unit:s.unit,qty_remaining:i===0?0:3,note:i===1?'4 <กระป๋อง>':undefined}))});
test('catalog matches the paper list: 89 unique items over 3 sheets (35/39/15)',()=>{assert.equal(REPORT_SLOTS.length,89);assert.equal(new Set(REPORT_SLOTS.map(s=>s.name)).size,89);assert.deepEqual(LADPRAO_SHEETS.map(sh=>sh.reduce((n,g)=>n+g.items.length,0)),[35,39,15]);});
test('each sheet lists exactly its own items, escapes user text, marks zero rows',()=>{const sheets=buildStockSheetsHtml(report(),'2026-10-11T08:30:00Z');assert.equal(sheets.length,3);REPORT_SLOTS.forEach(s=>sheets.forEach((html,i)=>assert.equal(html.includes('<td>'+s.label+'</td>'),s.sheet===i,s.label)));for(const html of sheets){assert.ok(!html.includes('<b>แบม'));assert.ok(html.includes('&lt;b&gt;แบม'));}assert.match(sheets[0],/class="out"><td>ไข่มุกดำ/);assert.match(sheets[2],/แผ่น 3\/3/);});
test('per-item note shows in the note column, escaped; blank otherwise',()=>{const sheets=buildStockSheetsHtml(report(),'2026-10-11T08:30:00Z');assert.match(sheets[0],/<td class="note">4 &lt;กระป๋อง&gt;<\/td>/);assert.match(sheets[0],/<th>หมายเหตุ<\/th>/);assert.match(sheets[2],/<td class="note"><\/td>/);});
