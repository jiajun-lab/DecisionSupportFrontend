import { useNavigate } from 'react-router-dom';
import { Eye, Heart, Star, MessageSquare, Clock, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import type { Video } from '../types';

function fmt(n: number): string {
  if (n >= 10000000) return (n / 10000000).toFixed(1) + '千万';
  if (n >= 10000) return (n / 10000).toFixed(1) + '万';
  return n.toString();
}

interface Props {
  video: Video;
}

const riskConfig = {
  low:    { label: '健康', icon: CheckCircle, cls: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  medium: { label: '关注', icon: AlertCircle,  cls: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  high:   { label: '预警', icon: AlertTriangle, cls: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

export default function VideoCard({ video }: Props) {
  const navigate = useNavigate();
  const risk = riskConfig[video.riskLevel];
  const RiskIcon = risk.icon;

  const scoreColor =
    video.sentimentScore >= 80 ? '#34d399' :
    video.sentimentScore >= 60 ? '#fbbf24' : '#f87171';

  return (
    <div
      onClick={() => navigate(`/video/${video.bvId}`)}
      className="card cursor-pointer flex flex-col overflow-hidden group">

      {/* Cover */}
      <div className="relative h-36 overflow-hidden flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${video.coverGradient[0]}, ${video.coverGradient[1]})` }}>
        {/* Duration badge */}
        <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/50 text-slate-300 px-1.5 py-0.5 rounded backdrop-blur-sm">
          {video.duration}
        </span>
        {/* Risk badge */}
        <span className={`absolute top-2 left-2 text-[10px] font-medium px-1.5 py-0.5 rounded border flex items-center gap-1 backdrop-blur-sm ${risk.cls}`}>
          <RiskIcon size={10} />
          {risk.label}
        </span>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-all duration-300" />
        {/* Play hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm font-medium text-slate-200 line-clamp-2 leading-snug mb-3 group-hover:text-white transition-colors">
          {video.title}
        </p>

        {/* Sentiment score bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-500">舆情健康度</span>
            <span className="text-[11px] font-mono font-bold" style={{ color: scoreColor }}>
              {video.sentimentScore}
            </span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${video.sentimentScore}%`, background: scoreColor }} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-auto">
          {[
            { icon: Eye,           value: fmt(video.views),       label: '播放' },
            { icon: Heart,         value: fmt(video.likes),       label: '点赞' },
            { icon: Star,          value: fmt(video.favorites),   label: '收藏' },
            { icon: MessageSquare, value: fmt(video.danmakuCount),label: '弹幕' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <Icon size={11} className="text-slate-600 flex-shrink-0" />
              <span className="text-[11px] font-mono text-slate-400">{value}</span>
              <span className="text-[10px] text-slate-600">{label}</span>
            </div>
          ))}
        </div>

        {/* Date */}
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-white/[0.05]">
          <Clock size={10} className="text-slate-700" />
          <span className="text-[10px] text-slate-600">{video.uploadDate}</span>
        </div>
      </div>
    </div>
  );
}
