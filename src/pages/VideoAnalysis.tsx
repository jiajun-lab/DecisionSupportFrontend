import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Heart, Coins, Star, MessageSquare, Clock, AlertTriangle, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useVideo } from '../hooks';
import SentimentRadar from '../components/charts/SentimentRadar';
import HotspotTimeline from '../components/charts/HotspotTimeline';
import IntentChart from '../components/charts/IntentChart';
import AISummary from '../components/AISummary';

function fmt(n: number): string {
  if (n >= 10000000) return (n / 10000000).toFixed(1) + 'KW';
  if (n >= 10000) return (n / 10000).toFixed(1) + 'W';
  return n.toString();
}

const riskConfig = {
  low:    { label: 'Healthy',  icon: CheckCircle, cls: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/8' },
  medium: { label: 'Monitor',  icon: AlertCircle,  cls: 'text-amber-400 border-amber-500/25 bg-amber-500/8' },
  high:   { label: 'Alert',    icon: AlertTriangle, cls: 'text-red-400 border-red-500/25 bg-red-500/8' },
};

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
        <div className="w-1 h-3 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function VideoAnalysis() {
  const { bvId } = useParams<{ bvId: string }>();
  const navigate = useNavigate();
  const { video, loading, analyzing, error } = useVideo(bvId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-3 text-slate-400">Loading...</span>
      </div>
    );
  }


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-red-400 mb-4">Failed to load: {error.message}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Video not found
      </div>
    );
  }

  const risk = riskConfig[video.riskLevel as keyof typeof riskConfig] || riskConfig.low;
  const RiskIcon = risk.icon;
  const scoreColor = video.sentimentScore >= 80 ? '#34d399' : video.sentimentScore >= 60 ? '#fbbf24' : '#f87171';

  const videoStats = [
    { icon: Eye,           label: 'Views',    value: fmt(video.views) },
    { icon: Heart,         label: 'Likes',    value: fmt(video.likes) },
    { icon: Coins,         label: 'Coins',    value: fmt(video.coins) },
    { icon: Star,          label: 'Favorites',value: fmt(video.favorites) },
    { icon: MessageSquare, label: 'Danmaku',  value: fmt(video.danmakuCount) },
    { icon: Clock,         label: 'Duration', value: video.duration },
  ];

  const emptyAnalysis = {
    sentiment: { praise: 0, discussion: 0, adDislike: 0, attack: 0, sarcasm: 0 },
    timeline: [],
    hotspots: [],
    intent: { waterComment: 0, suggestion: 0, rant: 0, urgeUpdate: 0, sponsored: 0 },
    aiSummary: {
      overview: 'No analysis data available',
      keyPoints: ['Click the Analyze button to generate a report'],
      riskAlerts: [],
      recommendations: [],
      hotMemes: []
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      {/* Analyzing indicator */}
      {analyzing && (
        <div className="mb-4 flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          <div className="flex-1">
            <span className="text-sm text-blue-400 font-medium">AI is generating fresh analysis...</span>
            <span className="text-xs text-slate-500 ml-2">Using local Qwen 3.5 model</span>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <button onClick={() => navigate('/')}
          className="text-slate-600 hover:text-slate-400 transition-colors">Overview</button>
        <span className="text-slate-700">/</span>
        <button onClick={() => navigate(`/artist/${video.artistId}`)}
          className="text-slate-600 hover:text-slate-400 transition-colors">{video.artistName || 'Unknown Artist'}</button>
        <span className="text-slate-700">/</span>
        <span className="text-slate-400">Video Analysis</span>
      </div>

      {/* Video Header Card */}
      <div className="card p-6 mb-6">
        <div className="flex gap-5">
          {/* Cover thumbnail */}
          <div className="w-36 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${video.coverGradient[0]}, ${video.coverGradient[1]})` }}>
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-2xl opacity-40">▶</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-slate-100 leading-snug mb-2">
                  {video.title}
                </h1>
                <div className="flex items-center gap-3">
                  {video.artistName && (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${video.coverGradient[0]}, ${video.coverGradient[1]})` }}
                      >
                        <span className="text-[8px] font-bold text-white">{video.artistName[0]}</span>
                      </div>
                      <span className="text-xs text-slate-500">{video.artistName}</span>
                    </div>
                  )}
                  <span className="text-slate-700">·</span>
                  <span className="text-xs text-slate-600 font-mono">{video.bvId}</span>
                  <span className="text-slate-700">·</span>
                  <span className="text-xs text-slate-600">{video.uploadDate}</span>
                </div>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-3">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${risk.cls}`}>
                  <RiskIcon size={12} />
                  {risk.label}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">Sentiment Score</span>
                  <span className="text-xl font-bold font-mono" style={{ color: scoreColor }}>
                    {video.sentimentScore}
                  </span>
                  <span className="text-xs text-slate-700">/100</span>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="flex items-center gap-5 mt-4 pt-4 border-t border-white/[0.05]">
              {videoStats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon size={12} className="text-slate-600" />
                  <span className="text-sm font-mono font-medium text-slate-300">{value}</span>
                  <span className="text-[10px] text-slate-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Sentiment Radar */}
        <Panel title="Sentiment Distribution">
          <SentimentRadar analysis={video.analysis || emptyAnalysis} />
        </Panel>

        {/* Intent Distribution */}
        <Panel title="Comment Intent Distribution">
          <p className="text-xs text-slate-600 mb-3">Breakdown of comments by intent type</p>
          <IntentChart analysis={video.analysis || emptyAnalysis} />

          {/* Intent legend */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { key: 'urgeUpdate', label: 'Update Request', color: '#3b82f6', desc: 'Requesting new content' },
              { key: 'suggestion', label: 'Suggestion',     color: '#8b5cf6', desc: 'Improvement feedback' },
              { key: 'rant',       label: 'Criticism',      color: '#f59e0b', desc: 'Negative expressions' },
              { key: 'sponsored',  label: 'Sponsored',      color: '#34d399', desc: 'Promotional comments' },
            ].map(item => (
              <div key={item.key} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <div>
                  <p className="text-[10px] font-medium" style={{ color: item.color }}>{item.label}</p>
                  <p className="text-[9px] text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Hotspot Timeline - full width */}
      <div className="mb-5">
        <Panel title="Danmaku Peak Timeline">
          <p className="text-xs text-slate-600 mb-4">Danmaku density across video time; blue regions are system-detected hotspots</p>
          <HotspotTimeline analysis={video.analysis || emptyAnalysis} />
        </Panel>
      </div>

      {/* AI Summary - full width */}
      <Panel title="AI Analysis Report">
        <AISummary analysis={video.analysis || emptyAnalysis} analyzing={analyzing} />
      </Panel>

      {/* Back button */}
      <div className="mt-8">
        <button
          onClick={() => navigate(`/artist/${video.artistId}`)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to {video.artistName || 'Artist'}'s Videos
        </button>
      </div>
    </div>
  );
}
