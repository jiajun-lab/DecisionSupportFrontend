import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { VideoAnalysis } from '../../types';

interface Props {
  analysis: VideoAnalysis;
}

const INTENT_CONFIG = [
  { key: 'urgeUpdate',   label: '催更',   color: '#3b82f6' },
  { key: 'suggestion',   label: '建议',   color: '#8b5cf6' },
  { key: 'rant',         label: '吐槽',   color: '#f59e0b' },
  { key: 'waterComment', label: '水贴',   color: '#64748b' },
  { key: 'sponsored',    label: '商业好评', color: '#34d399' },
] as const;

export default function IntentChart({ analysis }: Props) {
  const { intent } = analysis;
  const total = Object.values(intent).reduce((a, b) => a + b, 0);

  const sorted = [...INTENT_CONFIG]
    .map(cfg => ({ ...cfg, value: intent[cfg.key] }))
    .sort((a, b) => b.value - a.value);

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    grid: { left: 70, right: 50, top: 8, bottom: 8 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'none' },
      backgroundColor: '#0c1528',
      borderColor: 'rgba(148,163,184,0.15)',
      textStyle: { color: '#e2e8f0', fontSize: 11, fontFamily: 'Inter, sans-serif' },
      formatter: (params: unknown) => {
        const arr = params as Array<{ name: string; value: number }>;
        const p = arr[0];
        const pct = total > 0 ? Math.round((p.value / total) * 100) : 0;
        return `${p.name}: <b>${pct}%</b> (${p.value})`;
      },
    },
    xAxis: {
      type: 'value',
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
          value: s.value,
          itemStyle: { color: s.color, borderRadius: [0, 4, 4, 0] },
        })),
        label: {
          show: true,
          position: 'right' as const,
          formatter: (p: { value: unknown }) => {
            const v = typeof p.value === 'number' ? p.value : 0;
            const pct = total > 0 ? Math.round((v / total) * 100) : 0;
            return `${pct}%`;
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
