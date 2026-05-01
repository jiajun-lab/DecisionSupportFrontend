import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Heart, Coins, Star, MessageSquare, Clock, AlertTriangle, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useVideo } from '../hooks';
import SentimentRadar from '../components/charts/SentimentRadar';
import HotspotTimeline from '../components/charts/HotspotTimeline';
import IntentChart from '../components/charts/IntentChart';
import AISummary from '../components/AISummary';

function fmt(n: number): string {
  if (n >= 10000000) return (n / 10000000).toFixed(1) + '千万';
  if (n >= 10000) return (n / 10000).toFixed(1) + '万';
  return n.toString();
}

const riskConfig = {
  low:    { label: '舆情健康', icon: CheckCircle, cls: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/8' },
  medium: { label: '需要关注', icon: AlertCircle,  cls: 'text-amber-400 border-amber-500/25 bg-amber-500/8' },
  high:   { label: '舆情预警', icon: AlertTriangle, cls: 'text-red-400 border-red-500/25 bg-red-500/8' },
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
  const { video, loading, error } = useVideo(bvId);

  // 加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-3 text-slate-400">加载中...</span>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-red-400 mb-4">加载失败: {error.message}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        视频不存在
      </div>
    );
  }

  const risk = riskConfig[video.riskLevel as keyof typeof riskConfig] || riskConfig.low;
  const RiskIcon = risk.icon;
  const scoreColor = video.sentimentScore >= 80 ? '#34d399' : video.sentimentScore >= 60 ? '#fbbf24' : '#f87171';

  const videoStats = [
    { icon: Eye,           label: '播放',  value: fmt(video.views) },
    { icon: Heart,         label: '点赞',  value: fmt(video.likes) },
    { icon: Coins,         label: '投币',  value: fmt(video.coins) },
    { icon: Star,          label: '收藏',  value: fmt(video.favorites) },
    { icon: MessageSquare, label: '弹幕',  value: fmt(video.danmakuCount) },
    { icon: Clock,         label: '时长',  value: video.duration },
  ];

  // 分析数据不存在时的空状态
  const emptyAnalysis = {
    sentiment: { praise: 0, discussion: 0, adDislike: 0, attack: 0, sarcasm: 0 },
    timeline: [],
    hotspots: [],
    intent: { waterComment: 0, suggestion: 0, rant: 0, urgeUpdate: 0, sponsored: 0 },
    aiSummary: {
      overview: '暂无分析数据',
      keyPoints: ['请先点击分析按钮生成报告'],
      riskAlerts: [],
      recommendations: [],
      hotMemes: []
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <button onClick={() => navigate('/')}
          className="text-slate-600 hover:text-slate-400 transition-colors">总览</button>
        <span className="text-slate-700">/</span>
        <button onClick={() => navigate(`/artist/${video.artistId}`)}
          className="text-slate-600 hover:text-slate-400 transition-colors">{artist?.name}</button>
        <span className="text-slate-700">/</span>
        <span className="text-slate-400">视频分析</span>
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
                  <span className="text-xs text-slate-600">舆情指数</span>
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
        <Panel title="情感分布雷达">
          <SentimentRadar analysis={video.analysis || emptyAnalysis} />
        </Panel>

        {/* Intent Distribution */}
        <Panel title="评论意图分布">
          <p className="text-xs text-slate-600 mb-3">评论按意图类型的占比分析</p>
          <IntentChart analysis={video.analysis || emptyAnalysis} />

          {/* Intent legend */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { key: 'urgeUpdate', label: '催更', color: '#3b82f6', desc: '期待更多内容' },
              { key: 'suggestion', label: '建议', color: '#8b5cf6', desc: '改进意见' },
              { key: 'rant',       label: '吐槽', color: '#f59e0b', desc: '负面情绪表达' },
              { key: 'sponsored',  label: '商业好评', color: '#34d399', desc: '推广类评论' },
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
        <Panel title="弹幕爆点时间线">
          <p className="text-xs text-slate-600 mb-4">视频各时间段弹幕密度分布，蓝色区域为系统标注爆点</p>
          <HotspotTimeline analysis={video.analysis || emptyAnalysis} />
        </Panel>
      </div>

      {/* AI Summary - full width */}
      <Panel title="AI 智能分析报告">
        <AISummary analysis={video.analysis || emptyAnalysis} />
      </Panel>

      {/* Back button */}
      <div className="mt-8">
        <button
          onClick={() => navigate(`/artist/${video.artistId}`)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          返回 {video.artistName || '艺人'} 的视频列表
        </button>
      </div>
    </div>
  );
}
