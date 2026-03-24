import { Sparkles, AlertTriangle, Lightbulb, Hash } from 'lucide-react';
import type { VideoAnalysis } from '../types';

interface Props {
  analysis: VideoAnalysis;
}

export default function AISummary({ analysis }: Props) {
  const { aiSummary } = analysis;

  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="p-4 rounded-xl border border-blue-500/15 bg-blue-500/5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={13} className="text-blue-400" />
          <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wide">AI 综合评述</span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{aiSummary.overview}</p>
      </div>

      {/* Key Points */}
      {aiSummary.keyPoints.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Lightbulb size={13} className="text-amber-400" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">核心洞察</span>
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
            <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wide">风险预警</span>
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
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">运营建议</span>
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
            <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wide">热梗追踪</span>
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
