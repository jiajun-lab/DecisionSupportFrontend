import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, PlayCircle, Eye, ArrowRight, Activity, Loader2 } from 'lucide-react';
import { useArtists } from '../hooks';

function fmt(n: number): string {
  if (n >= 100000000) return (n / 100000000).toFixed(1) + '亿';
  if (n >= 10000) return (n / 10000).toFixed(0) + '万';
  return n.toString();
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { artists, loading, error } = useArtists();

  // 计算统计数据
  const totalFans = artists.reduce((s, a) => s + (a.fans || 0), 0);
  const totalVideos = artists.reduce((s, a) => s + (a.totalVideos || 0), 0);
  const totalViews = artists.reduce((s, a) => s + (a.totalViews || 0), 0);
  const activeAlerts = 0; // TODO: 从后端获取风险预警数量

  const globalStats = [
    { label: '旗下艺人', value: artists.length.toString(), icon: Users, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: '总粉丝数', value: fmt(totalFans), icon: TrendingUp, color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
    { label: '视频作品', value: totalVideos.toString(), icon: PlayCircle, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: '累计播放', value: fmt(totalViews), icon: Eye, color: '#22d3ee', bg: 'rgba(34,211,238,0.1)' },
  ];

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

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-[11px] text-emerald-400 font-medium uppercase tracking-widest">系统正常运行</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">MCN 内容决策中心</h1>
        <p className="text-sm text-slate-500 mt-1">管理旗下艺人的视频舆情、爆点与 AI 分析报告</p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {globalStats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: stat.bg }}>
                  <Icon size={17} style={{ color: stat.color }} />
                </div>
                {stat.label === '总粉丝数' && (
                  <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded font-medium">
                    ↑ 2.3%
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-slate-100 font-mono animate-count">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Alert Banner */}
      {activeAlerts > 0 && (
        <div className="mb-8 flex items-center gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
          <Activity size={16} className="text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-300">
              发现 <span className="font-bold">{activeAlerts}</span> 条视频舆情预警
            </p>
            <p className="text-xs text-red-400/70 mt-0.5">负面评论占比超过阈值，建议优先处理</p>
          </div>
          <button className="text-[11px] text-red-400 hover:text-red-300 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors">
            查看详情
          </button>
        </div>
      )}

      {/* Artists Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-200">艺人管理</h2>
          <span className="text-xs text-slate-600">{artists.length} 位艺人</span>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {artists.map(artist => {
            const videos = artist.videos || [];
            const highRisk = videos.filter(v => v.riskLevel === 'high').length;
            const avgScore = videos.length > 0
              ? Math.round(videos.reduce((s, v) => s + v.sentimentScore, 0) / videos.length)
              : 0;
            const scoreColor = avgScore >= 80 ? '#34d399' : avgScore >= 60 ? '#fbbf24' : '#f87171';

            return (
              <div key={artist.id}
                className="card p-6 cursor-pointer group"
                onClick={() => navigate(`/artist/${artist.id}`)}>

                {/* Artist Header */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${artist.avatarColor[0]}, ${artist.avatarColor[1]})` }}>
                    <span className="text-xl font-bold text-white">{artist.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-100 group-hover:text-white transition-colors">
                        {artist.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{artist.category}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{artist.latestActivity} 最近更新</p>
                  </div>
                  <ArrowRight size={16} className="text-slate-700 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: '粉丝', value: fmt(artist.fans || 0) },
                    { label: '视频', value: (artist.totalVideos || 0).toString() },
                    { label: '播放', value: fmt(artist.totalViews || 0) },
                  ].map(s => (
                    <div key={s.label} className="text-center p-2.5 rounded-lg bg-white/[0.025]">
                      <p className="text-sm font-bold font-mono text-slate-200">{s.value}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Category badge */}
                <div className="mt-4 pt-4 border-t border-white/[0.05]">
                  <span className="text-[11px] text-slate-500 px-2 py-1 rounded bg-white/[0.03]">
                    {artist.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
