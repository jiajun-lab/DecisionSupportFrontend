import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { VideoAnalysis } from '../../types';

interface Props {
  analysis: VideoAnalysis;
}

const SENTIMENT_CONFIG = [
  { key: 'praise'     as const, label: 'Praise',     color: '#34d399' },
  { key: 'discussion' as const, label: 'Discussion',  color: '#3b82f6' },
  { key: 'adDislike'  as const, label: 'Ad Dislike',  color: '#fbbf24' },
  { key: 'attack'     as const, label: 'Attack',      color: '#f87171' },
  { key: 'sarcasm'    as const, label: 'Sarcasm',     color: '#a78bfa' },
];

export default function SentimentRadar({ analysis }: Props) {
  const { sentiment, commentCount } = analysis;

  // 后端返回的已经是百分比，直接使用；round 到整数显示
  const pct = (v: number) => Math.round(v);
  // 根据 commentCount 反算实际条数（commentCount=0 时退化为只显示百分比）
  const count = (v: number) =>
    commentCount > 0 ? Math.round((v / 100) * commentCount) : null;

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    radar: {
      shape: 'circle',
      indicator: SENTIMENT_CONFIG.map(c => ({ name: c.label, max: 100 })),
      center: ['50%', '50%'],
      radius: '68%',
      splitNumber: 4,
      axisName: {
        color: '#94a3b8',
        fontSize: 11,
        fontFamily: 'Inter, sans-serif',
      },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } },
      splitArea: {
        areaStyle: {
          color: ['rgba(148,163,184,0.01)', 'rgba(148,163,184,0.03)'],
        },
      },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: SENTIMENT_CONFIG.map(c => pct(sentiment[c.key])),
            name: 'Sentiment Distribution',
            areaStyle: {
              color: {
                type: 'radial',
                x: 0.5, y: 0.5, r: 0.5,
                colorStops: [
                  { offset: 0, color: 'rgba(59,130,246,0.6)' },
                  { offset: 1, color: 'rgba(139,92,246,0.15)' },
                ],
              },
            },
            lineStyle: { color: '#3b82f6', width: 2 },
            itemStyle: { color: '#3b82f6', borderColor: '#3b82f6', borderWidth: 2 },
          },
        ],
        symbol: 'circle',
        symbolSize: 5,
        tooltip: {
          formatter: (params: unknown) => {
            const p = params as { name: string; value: number[] };
            return SENTIMENT_CONFIG.map((c, i) => {
              const v = p.value[i];
              const n = count(sentiment[c.key]);
              return `<span style="color:${c.color}">●</span> ${c.label}: <b>${v}%</b>${n !== null ? ` (${n} comments)` : ''}`;
            }).join('<br/>');
          },
        },
      },
    ],
    tooltip: {
      backgroundColor: '#0c1528',
      borderColor: 'rgba(148,163,184,0.15)',
      textStyle: { color: '#e2e8f0', fontSize: 12, fontFamily: 'Inter, sans-serif' },
    },
  };

  return (
    <div>
      <ReactECharts option={option} style={{ height: 240 }} />
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 px-2">
        {SENTIMENT_CONFIG.map(cfg => {
          const v = sentiment[cfg.key];
          const n = count(v);
          return (
            <div key={cfg.key} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
              <span className="text-[11px] text-slate-400 flex-1">{cfg.label}</span>
              <span className="text-[11px] font-mono font-semibold" style={{ color: cfg.color }}>
                {pct(v)}%
              </span>
              {n !== null && (
                <span className="text-[10px] text-slate-500 font-mono">({n})</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
