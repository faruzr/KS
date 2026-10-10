import { test } from 'node:test';
import assert from 'node:assert/strict';
import { REPORT_BRANCH, REPORT_SLOTS, validateReport, reportReceipt } from '../lib/ladprao-report.js';
import handler from '../api/ladprao-stock.js';

const fixture = () => ({requestId:'11111111-1111-4111-8111-111111111111',branch:REPORT_BRANCH,submittedBy:'ผู้ทดสอบ',note:'หมายเหตุ',items:REPORT_SLOTS.map(s=>({name:s.name,unit:s.unit,qty_remaining:0}))});
test('accept complete zero counts and preserve note', () => { const r = validateReport(fixture()); assert.equal(r.items.length, REPORT_SLOTS.length); assert.equal(r.note,'หมายเหตุ'); });
test('reject incomplete count', () => { const p=fixture();p.items.pop();assert.throws(()=>validateReport(p)); });
test('reject empty, negative and nonfinite numbers', () => { for (const qty of ['',null,-1,NaN,Infinity]) {const p=fixture();p.items[0].qty_remaining=qty;assert.throws(()=>validateReport(p));} });
test('reject duplicates and unknown products', () => { const p=fixture();p.items[1]=p.items[0];assert.throws(()=>validateReport(p));const q=fixture();q.items[0].name='unknown';assert.throws(()=>validateReport(q)); });
test('reject branch override',()=>assert.throws(()=>validateReport({...fixture(),branch:'หาดใหญ่'})));
test('accept decimal quantities',()=>{const p=fixture();p.items[0].qty_remaining=0.5;assert.equal(validateReport(p).items[0].qty_remaining,0.5);});
test('receipt needs matching request and LINE acceptance evidence',()=>{const p=fixture();const good={requestId:p.requestId,lineRequestId:'line-1',delivery:'accepted'};assert.equal(reportReceipt(good,p.requestId).delivery,'accepted');for(const bad of [{},{...good,lineRequestId:''},{...good,requestId:'other'},{...good,delivery:'success'}])assert.throws(()=>reportReceipt(bad,p.requestId));});
test('receipt never claims database persistence',()=>assert.equal('saved' in reportReceipt({requestId:'r',lineRequestId:'line-1',delivery:'accepted'},'r'),false));
test('server bridge refuses unconfigured live submissions without fetch',async()=>{
  const old=process.env.KS_STOCK_READY;delete process.env.KS_STOCK_READY;
  const res={setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
  try{await handler({method:'POST',headers:{},body:fixture()},res);assert.equal(res.code,503);}finally{if(old!==undefined)process.env.KS_STOCK_READY=old;}
});
test('per-item note is optional, trimmed, max 50 chars, text only',()=>{const p=fixture();p.items[0].note='  1 ลัง 4 กระป๋อง ';const r=validateReport(p);assert.equal(r.items[0].note,'1 ลัง 4 กระป๋อง');assert.equal(r.items[1].note,'');for(const bad of ['ก'.repeat(51),5,{}]){const q=fixture();q.items[0].note=bad;assert.throws(()=>validateReport(q));}});
test('EXP list names all exist in the catalog',async()=>{const {EXP_REQUIRED}=await import('../lib/ladprao-catalog.js');for(const n of EXP_REQUIRED)assert.ok(REPORT_SLOTS.some(s=>s.name===n),n);assert.equal(REPORT_SLOTS.filter(s=>s.expRequired).length,EXP_REQUIRED.size);});
test('EXP required only for perishables that still have stock',()=>{const i=REPORT_SLOTS.findIndex(s=>s.expRequired);const p=fixture();p.items[i].qty_remaining=2;assert.throws(()=>validateReport(p),/EXP/);p.items[i].exp='2026-10-14';assert.equal(validateReport(p).items[i].exp,'2026-10-14');const q=fixture();assert.equal(validateReport(q).items[i].exp,'');const j=REPORT_SLOTS.findIndex(s=>!s.expRequired);const r=fixture();r.items[j].qty_remaining=5;assert.equal(validateReport(r).items[j].exp,'');});
test('EXP must be a real YYYY-MM-DD date (rejects BE year, 30 Feb, text)',()=>{for(const bad of ['2569-10-14','2026-02-30','14/10/69','x',5]){const p=fixture();p.items[0].exp=bad;assert.throws(()=>validateReport(p),/EXP/,String(bad));}});
