const GREEN = '#137C4B';
const GREEN_LIGHT = '#EAF7F0';
const TEXT = '#1F2937';
const MUTED = '#6B7280';
const RED = '#DC2626';

function text(value, { size = 'sm', weight = 'regular', color = TEXT, flex = 0 } = {}) {
  return { type: 'text', text: String(value), size, weight, color, flex, wrap: true };
}

function metricRow(label, value, color = TEXT) {
  return {
    type: 'box',
    layout: 'horizontal',
    spacing: 'md',
    contents: [
      text(label, { color: MUTED, flex: 1 }),
      text(value, { weight: 'bold', color, flex: 0 }),
    ],
  };
}

export function formatBangkokDate(input) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) throw new Error('submittedAt must be a valid date');

  return new Intl.DateTimeFormat('th-TH', {
    timeZone: 'Asia/Bangkok',
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function buildStockFlexMessage({
  branch,
  submittedAt,
  submittedBy,
  countedSlots,
  expectedSlots,
  outOfStockCount,
  version = 1,
}) {
  if (!String(branch ?? '').trim()) throw new Error('branch is required');
  if (!String(submittedBy ?? '').trim()) throw new Error('submittedBy is required');

  for (const [name, value] of Object.entries({ countedSlots, expectedSlots, outOfStockCount, version })) {
    if (!Number.isInteger(value) || value < 0) throw new Error(`${name} must be a non-negative integer`);
  }
  if (expectedSlots === 0) throw new Error('expectedSlots must be greater than zero');
  if (countedSlots > expectedSlots) throw new Error('countedSlots cannot exceed expectedSlots');
  if (outOfStockCount > countedSlots) throw new Error('outOfStockCount cannot exceed countedSlots');

  const complete = countedSlots === expectedSlots;
  const submittedLabel = formatBangkokDate(submittedAt);

  return {
    type: 'flex',
    altText: `รายงานสต็อก สาขา${branch} — ${countedSlots}/${expectedSlots} ช่อง`,
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: GREEN,
        paddingAll: '20px',
        spacing: 'sm',
        contents: [
          text('รายงานสต็อกประจำสัปดาห์', { size: 'xl', weight: 'bold', color: '#FFFFFF' }),
          text(`สาขา${branch}`, { size: 'md', color: '#D1FAE5' }),
          text(submittedLabel, { size: 'xs', color: '#D1FAE5' }),
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '20px',
        spacing: 'lg',
        contents: [
          metricRow('ผู้ตรวจ', submittedBy),
          { type: 'separator', color: '#E5E7EB' },
          metricRow('ความครบถ้วน', `${countedSlots} / ${expectedSlots} ช่อง`, complete ? GREEN : '#D97706'),
          metricRow('ของหมด', `${outOfStockCount} รายการ`, outOfStockCount > 0 ? RED : GREEN),
          metricRow('ฉบับรายงาน', `ฉบับที่ ${version}`),
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: GREEN_LIGHT,
        paddingAll: '14px',
        contents: [
          text(complete ? '✓ ส่งรายงานสต็อกครบแล้ว' : '⚠ รายงานยังไม่ครบ', {
            weight: 'bold',
            color: complete ? GREEN : '#D97706',
          }),
        ],
      },
    },
  };
}
