import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, PlayCircle, Eye, ArrowRight, Activity, Loader2, Plus, Trash2, X, AlertTriangle, LogIn } from 'lucide-react';
import { useArtists } from '../hooks';
import { deleteArtist } from '../api/client';
import RegisterArtistModal from '../components/RegisterArtistModal';
import { BilibiliLoginModal } from '../components/BilibiliLoginModal';
import { useBilibiliAuth } from '../hooks/useBilibiliAuth';

function fmt(n: number): string {
  if (n >= 100000000) return (n / 100000000).toFixed(1) + 'B';
  if (n >= 10000) return (n / 10000).toFixed(0) + 'W';
  return n.toString();
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { artists, loading, error, refresh } = useArtists();
  const { isLoggedIn } = useBilibiliAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBilibiliLoginModalOpen, setIsBilibiliLoginModalOpen] = useState(false);

  const [artistToDelete, setArtistToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalFans = artists.reduce((s, a) => s + (a.fans || 0), 0);
  const totalVideos = artists.reduce((s, a) => s + (a.totalVideos || 0), 0);
  const totalViews = artists.reduce((s, a) => s + (a.totalViews || 0), 0);
  const activeAlerts = 0;

  const globalStats = [
    { label: 'Artists',     value: artists.length.toString(), icon: Users,       color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Total Fans',  value: fmt(totalFans),            icon: TrendingUp,  color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
    { label: 'Videos',      value: totalVideos.toString(),    icon: PlayCircle,  color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Total Views', value: fmt(totalViews),           icon: Eye,         color: '#22d3ee', bg: 'rgba(34,211,238,0.1)' },
  ];

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

  const handleDelete = async () => {
    if (!artistToDelete) return;

    setIsDeleting(true);
    try {
      await deleteArtist(artistToDelete.id);
      refresh();
      setArtistToDelete(null);
    } catch (err: any) {
      alert('Delete failed: ' + (err.message || 'Unknown error'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-[11px] text-emerald-400 font-medium uppercase tracking-widest">System Online</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">MCN Content Decision Hub</h1>
          <p className="text-sm text-slate-500 mt-1">Manage artist video sentiment, hotspots and AI analysis reports</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBilibiliLoginModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 rounded-lg transition-colors"
          >
            <span className="font-bold text-lg">B</span>
            <span className="font-medium">Admin Account</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
          >
            <Plus size={18} />
            <span className="font-medium">Register Artist</span>
          </button>
        </div>
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
                {stat.label === 'Total Fans' && (
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
              Detected <span className="font-bold">{activeAlerts}</span> video sentiment alert{activeAlerts > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-red-400/70 mt-0.5">Negative comment ratio exceeds threshold — prioritize review</p>
          </div>
          <button className="text-[11px] text-red-400 hover:text-red-300 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors">
            View Details
          </button>
        </div>
      )}

      {/* Bilibili login reminder */}
      {!isLoggedIn && (
        <div className="mb-8 flex items-center gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <LogIn size={16} className="text-amber-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-300">
              Not logged in to Bilibili admin account
            </p>
            <p className="text-xs text-amber-400/70 mt-0.5">
              Log in for accurate fan counts and engagement data. UID-only registration available after login.
            </p>
          </div>
          <button
            onClick={() => setIsBilibiliLoginModalOpen(true)}
            className="text-[11px] text-amber-400 hover:text-amber-300 border border-amber-500/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            Login Now
          </button>
        </div>
      )}

      {/* Artists Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-200">Artist Management</h2>
          <span className="text-xs text-slate-600">{artists.length} artist{artists.length !== 1 ? 's' : ''}</span>
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
                className="card p-6 cursor-pointer group relative"
                onClick={() => navigate(`/artist/${artist.id}`)}>

                {/* Artist Header */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${artist.avatarColor[0]}, ${artist.avatarColor[1]})` }}>
                    <span className="text-xl font-bold text-white">{artist.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-100 group-hover:text-white transition-colors">
                        {artist.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{artist.category}</p>
                    <p className="text-xs text-slate-600 mt-0.5">Last updated {artist.latestActivity}</p>
                  </div>
                  <ArrowRight size={16} className="text-slate-700 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Fans',   value: fmt(artist.fans || 0) },
                    { label: 'Videos', value: (artist.totalVideos || 0).toString() },
                    { label: 'Likes',  value: fmt(artist.totalViews || 0) },
                  ].map(s => (
                    <div key={s.label} className="text-center p-2.5 rounded-lg bg-white/[0.025]">
                      <p className="text-sm font-bold font-mono text-slate-200">{s.value}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Category badge & Delete */}
                <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 px-2 py-1 rounded bg-white/[0.03]">
                    {artist.category}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setArtistToDelete({ id: artist.id, name: artist.name });
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    title="Delete Artist"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <RegisterArtistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => { refresh(); }}
        isLoggedIn={isLoggedIn}
        onOpenLogin={() => setIsBilibiliLoginModalOpen(true)}
      />

      <BilibiliLoginModal
        isOpen={isBilibiliLoginModalOpen}
        onClose={() => setIsBilibiliLoginModalOpen(false)}
      />

      {/* Delete Confirm Modal */}
      {artistToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm card p-6 animate-fade-in">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={24} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-1">Confirm Delete</h3>
                <p className="text-sm text-slate-500">
                  Delete artist <span className="text-slate-300 font-medium">{artistToDelete.name}</span>?
                </p>
                <p className="text-xs text-slate-600 mt-2">
                  This will permanently delete all videos, comments and analysis data for this artist. This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setArtistToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Confirm Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
