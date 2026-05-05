import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { VideoAnalysis } from '../../types';

interface Props {
  analysis: VideoAnalysis;
}

export default function SentimentRadar({ analysis }: Props) {
  const { sentiment } = analysis;
  const total = sentiment.praise + sentiment.discussion + sentiment.adDislike + sentiment.attack + sentiment.sarcasm;
  const pct = (v: number) => total > 0 ? Math.round((v / total) * 100) : 0;

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    radar: {
      shape: 'circle',
      indicator: [
        { name: 'Praise', max: 100 },
        { name: 'Discussion', max: 100 },
        { name: 'Ad Dislike', max: 100 },
        { name: 'Attack', max: 100 },
        { name: 'Sarcasm', max: 100 },
      ],
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
            value: [
              pct(sentiment.praise),
              pct(sentiment.discussion),
              pct(sentiment.adDislike),
              pct(sentiment.attack),
              pct(sentiment.sarcasm),
            ],
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
      },
    ],
    tooltip: {
      backgroundColor: '#0c1528',
      borderColor: 'rgba(148,163,184,0.15)',
      textStyle: { color: '#e2e8f0', fontSize: 12, fontFamily: 'Inter, sans-serif' },
    },
  };

  const items = [
    { label: 'Praise',      value: pct(sentiment.praise),     color: '#34d399' },
    { label: 'Discussion',  value: pct(sentiment.discussion), color: '#3b82f6' },
    { label: 'Ad Dislike',  value: pct(sentiment.adDislike),  color: '#fbbf24' },
    { label: 'Attack',      value: pct(sentiment.attack),     color: '#f87171' },
    { label: 'Sarcasm',     value: pct(sentiment.sarcasm),    color: '#a78bfa' },
  ];

  return (
    <div>
      <ReactECharts option={option} style={{ height: 240 }} />
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 px-2">
        {items.map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
            <span className="text-[11px] text-slate-400 flex-1">{item.label}</span>
            <span className="text-[11px] font-mono font-semibold" style={{ color: item.color }}>
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
