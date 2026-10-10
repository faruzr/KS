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
