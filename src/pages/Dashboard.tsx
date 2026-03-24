import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, PlayCircle, Eye, ArrowRight, Activity } from 'lucide-react';
import { artists } from '../mockData';

function fmt(n: number): string {
  if (n >= 100000000) return (n / 100000000).toFixed(1) + '亿';
  if (n >= 10000) return (n / 10000).toFixed(0) + '万';
  return n.toString();
}

export default function Dashboard() {
  const navigate = useNavigate();

  const totalFans = artists.reduce((s, a) => s + a.fans, 0);
  const totalVideos = artists.reduce((s, a) => s + a.totalVideos, 0);
  const totalViews = artists.reduce((s, a) => s + a.totalViews, 0);
  const activeAlerts = artists.flatMap(a => a.videos).filter(v => v.riskLevel === 'high').length;

  const globalStats = [
    { label: '旗下艺人', value: artists.length.toString(), icon: Users, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: '总粉丝数', value: fmt(totalFans), icon: TrendingUp, color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
    { label: '视频作品', value: totalVideos.toString(), icon: PlayCircle, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: '累计播放', value: fmt(totalViews), icon: Eye, color: '#22d3ee', bg: 'rgba(34,211,238,0.1)' },
  ];

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
            const highRisk = artist.videos.filter(v => v.riskLevel === 'high').length;
            const avgScore = artist.videos.length > 0
              ? Math.round(artist.videos.reduce((s, v) => s + v.sentimentScore, 0) / artist.videos.length)
              : 0;
            const scoreColor = avgScore >= 80 ? '#34d399' : avgScore >= 60 ? '#fbbf24' : '#f87171';

            return (
              <div key={artist.id}
                className="card p-6 cursor-pointer group"
                onClick={() => navigate(`/artist/${artist.id}`)}>

                {/* Artist Header */}
                <div className="flex items-start gap-4 mb-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${artist.avatarColor} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <span className="text-xl font-bold text-white">{artist.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-100 group-hover:text-white transition-colors">
                        {artist.name}
                      </h3>
                      {highRisk > 0 && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-medium">
                          {highRisk} 预警
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{artist.category}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{artist.latestActivity} 最近更新</p>
                  </div>
                  <ArrowRight size={16} className="text-slate-700 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: '粉丝', value: fmt(artist.fans) },
                    { label: '视频', value: artist.totalVideos.toString() },
                    { label: '播放', value: fmt(artist.totalViews) },
                  ].map(s => (
                    <div key={s.label} className="text-center p-2.5 rounded-lg bg-white/[0.025]">
                      <p className="text-sm font-bold font-mono text-slate-200">{s.value}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Sentiment score */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] text-slate-500">平均舆情健康度</span>
                    <span className="text-[12px] font-mono font-bold" style={{ color: scoreColor }}>
                      {avgScore} / 100
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${avgScore}%`, background: scoreColor }} />
                  </div>
                </div>

                {/* Recent video titles */}
                <div className="mt-4 pt-4 border-t border-white/[0.05] space-y-1.5">
                  {artist.videos.slice(0, 2).map(v => (
                    <div key={v.bvId} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: v.riskLevel === 'high' ? '#f87171' : v.riskLevel === 'medium' ? '#fbbf24' : '#34d399' }} />
                      <p className="text-[11px] text-slate-500 truncate">{v.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
