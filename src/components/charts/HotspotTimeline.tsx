import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { VideoAnalysis } from '../../types';

interface Props {
  analysis: VideoAnalysis;
}

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function HotspotTimeline({ analysis }: Props) {
  const { timeline, hotspots } = analysis;

  const xData = timeline.map(p => fmtTime(p.second));
  const yData = timeline.map(p => p.density);

  const markAreas: [object, object][] = hotspots.map(h => [
    {
      xAxis: fmtTime(h.startSecond),
      itemStyle: { color: 'rgba(59,130,246,0.08)' },
      label: { show: false },
    },
    { xAxis: fmtTime(h.endSecond) },
  ]);

  const markPoints = hotspots.map(h => {
    const closest = timeline.reduce((prev, cur) =>
      Math.abs(cur.second - Math.round((h.startSecond + h.endSecond) / 2)) <
      Math.abs(prev.second - Math.round((h.startSecond + h.endSecond) / 2))
        ? cur : prev
    );
    return {
      xAxis: fmtTime(closest.second),
      yAxis: closest.density,
      name: h.label,
      value: h.label,
      symbol: 'pin',
      symbolSize: 28,
      itemStyle: { color: '#3b82f6' },
      label: {
        show: true,
        formatter: () => '★',
        color: '#fff',
        fontSize: 10,
      },
    };
  });

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    grid: { left: 40, right: 16, top: 16, bottom: 40 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#0c1528',
      borderColor: 'rgba(148,163,184,0.15)',
      textStyle: { color: '#e2e8f0', fontSize: 11, fontFamily: 'Inter, sans-serif' },
      formatter: (params: unknown) => {
        const arr = params as Array<{ name: string; value: number }>;
        const p = arr[0];
        return `<b>${p.name}</b><br/>Danmaku Density: <b>${p.value}</b> /min`;
      },
    },
    xAxis: {
      type: 'category',
      data: xData,
      axisLabel: {
        color: '#475569',
        fontSize: 10,
        fontFamily: 'JetBrains Mono, monospace',
        interval: Math.floor(xData.length / 6),
      },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      name: '/min',
      nameTextStyle: { color: '#475569', fontSize: 10 },
      axisLabel: { color: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.07)', type: 'dashed' } },
      axisLine: { show: false },
    },
    series: [
      {
        type: 'line',
        data: yData,
        smooth: 0.4,
        symbol: 'none',
        lineStyle: { color: '#3b82f6', width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59,130,246,0.35)' },
              { offset: 1, color: 'rgba(59,130,246,0.02)' },
            ],
          },
        },
        markArea: {
          silent: true,
          data: markAreas,
        },
        markPoint: {
          data: markPoints,
          label: { show: false },
        },
      },
    ],
  };

  return (
    <div>
      <ReactECharts option={option} style={{ height: 200 }} />
      {/* Hotspot list */}
      <div className="mt-3 space-y-2">
        {hotspots.map((h, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[9px] font-bold text-blue-400">{i + 1}</span>
            </div>
            <span className="text-[11px] text-slate-400 flex-1">{h.label}</span>
            <span className="text-[10px] font-mono text-slate-600">{fmtTime(h.startSecond)}–{fmtTime(h.endSecond)}</span>
            <span className="text-[10px] font-mono font-semibold text-blue-400">{h.peakDensity}/min</span>
          </div>
        ))}
      </div>
    </div>
  );
}
