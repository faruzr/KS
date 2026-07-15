// สร้างข้อความ LINE ต่อแท็บ (เรียงตามลำดับแท็บใน CATALOG, ข้าม qty<=0, ข้ามแท็บว่าง)
import { CATALOG } from './catalog.js';

const TAB_ORDER = CATALOG.map(t => t.tab);

export function buildLineMessages(orders, weekLabel) {
  const byTab = new Map();
  for (const o of orders) {
    if (!(Number(o.qty) > 0)) continue;
    if (!byTab.has(o.tab)) byTab.set(o.tab, []);
    byTab.get(o.tab).push(o);
  }
  return TAB_ORDER.filter(tab => byTab.has(tab)).map(tab => {
    const items = byTab.get(tab);
    const lines = items.map((o, i) => `${i + 1}. ${o.name} — ${Number(o.qty)} ${o.unit}`);
    return {
      tab,
      count: items.length,
      text: `🧾 สั่งของ${tab} — Kongsi หาดใหญ่\n📅 อาทิตย์ ${weekLabel}\n\n${lines.join('\n')}\n\nรวม ${items.length} รายการ 🙏`,
    };
  });
}
