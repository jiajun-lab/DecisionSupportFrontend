import { AlertTriangle, Lightbulb, Hash, Loader2, Zap } from 'lucide-react';
import type { VideoAnalysis } from '../types';

interface Props {
  analysis: VideoAnalysis;
  analyzing?: boolean;
}

export default function AISummary({ analysis, analyzing = false }: Props) {
  const { aiSummary } = analysis;

  // 如果没有 AI 分析结果，显示分析中状态
  const hasOverview = aiSummary.overview && aiSummary.overview.trim().length > 10;

  if (!hasOverview) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-sm text-slate-400">
          {analyzing ? 'Generating analysis...' : 'Waiting for analysis...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Type Label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={13} className="text-amber-400" />
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide">Analysis Summary</span>
        </div>
        {analyzing && (
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <Loader2 size={10} className="animate-spin" />
            <span>Generating analysis...</span>
          </div>
        )}
      </div>

      {/* Overview */}
      <div className="p-4 rounded-xl border border-amber-500/15 bg-amber-500/5">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={13} className="text-amber-400" />
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide">
            Overview
          </span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{aiSummary.overview}</p>
      </div>

      {/* Key Points */}
      {aiSummary.keyPoints.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Lightbulb size={13} className="text-amber-400" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Key Insights</span>
          </div>
          <div className="space-y-2">
            {aiSummary.keyPoints.map((point, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-white/[0.025] border border-white/[0.05]">
                <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(251,191,36,0.15)' }}>
                  <span className="text-[9px] font-bold text-amber-400">{i + 1}</span>
                </div>
                <p className="text-[12px] text-slate-300 leading-snug">{point}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Alerts */}
      {aiSummary.riskAlerts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <AlertTriangle size={13} className="text-red-400" />
            <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wide">Risk Alerts</span>
          </div>
          <div className="space-y-2">
            {aiSummary.riskAlerts.map((alert, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/15">
                <AlertTriangle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-[12px] text-red-300 leading-snug">{alert}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {aiSummary.recommendations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Recommendations</span>
          </div>
          <div className="space-y-2">
            {aiSummary.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-white/[0.025] border border-white/[0.05]">
                <div className="w-1 h-full min-h-[12px] rounded-full bg-gradient-to-b from-blue-500 to-purple-500 flex-shrink-0" />
                <p className="text-[12px] text-slate-400 leading-snug">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hot Memes */}
      {aiSummary.hotMemes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Hash size={13} className="text-purple-400" />
            <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wide">Trending Phrases</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {aiSummary.hotMemes.map((meme, i) => (
              <span key={i}
                className="text-[11px] px-2.5 py-1 rounded-full border bg-purple-500/8 border-purple-500/20 text-purple-300">
                #{meme}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
