import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { VideoAnalysis } from '../../types';

interface Props {
  analysis: VideoAnalysis;
}

const INTENT_CONFIG = [
  { key: 'urgeUpdate'   as const, label: 'Update Req',  color: '#3b82f6' },
  { key: 'suggestion'   as const, label: 'Suggestion',  color: '#8b5cf6' },
  { key: 'rant'         as const, label: 'Criticism',   color: '#f59e0b' },
  { key: 'waterComment' as const, label: 'Filler',      color: '#64748b' },
  { key: 'sponsored'    as const, label: 'Sponsored',   color: '#34d399' },
];

export default function IntentChart({ analysis }: Props) {
  const { intent, commentCount } = analysis;

  // 后端返回的已经是百分比，直接使用
  const sorted = [...INTENT_CONFIG]
    .map(cfg => ({ ...cfg, pct: intent[cfg.key] }))
    .sort((a, b) => b.pct - a.pct);

  // 根据 commentCount 反算实际条数
  const toCount = (pct: number) =>
    commentCount > 0 ? Math.round((pct / 100) * commentCount) : null;

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    grid: { left: 70, right: 55, top: 8, bottom: 8 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'none' },
      backgroundColor: '#0c1528',
      borderColor: 'rgba(148,163,184,0.15)',
      textStyle: { color: '#e2e8f0', fontSize: 11, fontFamily: 'Inter, sans-serif' },
      formatter: (params: unknown) => {
        const arr = params as Array<{ name: string; value: number; dataIndex: number }>;
        const p = arr[0];
        const rawPct = sorted[p.dataIndex]?.pct ?? p.value;
        const n = toCount(rawPct);
        const countStr = n !== null ? ` · ${n} comments` : '';
        return `${p.name}: <b>${rawPct.toFixed(1)}%</b>${countStr}`;
      },
    },
    xAxis: {
      type: 'value',
      max: 100,
      axisLabel: { show: false },
      splitLine: { show: false },
      axisLine: { show: false },
    },
    yAxis: {
      type: 'category',
      data: sorted.map(s => s.label),
      axisLabel: {
        color: '#94a3b8',
        fontSize: 11,
        fontFamily: 'Inter, sans-serif',
      },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: 'bar',
        data: sorted.map(s => ({
          value: s.pct,
          itemStyle: { color: s.color, borderRadius: [0, 4, 4, 0] },
        })),
        label: {
          show: true,
          position: 'right' as const,
          formatter: (p: { value: unknown }) => {
            const v = typeof p.value === 'number' ? p.value : 0;
            return `${v.toFixed(1)}%`;
          },
          color: '#94a3b8',
          fontSize: 10,
          fontFamily: 'JetBrains Mono, monospace',
        },
        barMaxWidth: 16,
        barCategoryGap: '35%',
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: 180 }} />
  );
}
