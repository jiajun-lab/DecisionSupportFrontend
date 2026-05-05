import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Heart, Star, TrendingUp, Filter, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useArtist } from '../hooks';
import VideoCard from '../components/VideoCard';

function fmt(n: number): string {
  if (n >= 100000000) return (n / 100000000).toFixed(1) + 'B';
  if (n >= 10000) return (n / 10000).toFixed(1) + 'W';
  return n.toString();
}

type Filter = 'all' | 'low' | 'medium' | 'high';

export default function ArtistVideos() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [riskFilter, setRiskFilter] = useState<Filter>('all');
  const [sortBy, setSortBy] = useState<'views' | 'sentiment' | 'date'>('date');

  const { artist, loading, error } = useArtist(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-3 text-slate-400">Loading...</span>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-red-400 mb-4">{error?.message || 'Artist not found'}</div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  let filtered = [...artist.videos];
  if (riskFilter !== 'all') filtered = filtered.filter(v => v.riskLevel === riskFilter);

  if (sortBy === 'views')     filtered.sort((a, b) => b.views - a.views);
  if (sortBy === 'sentiment') filtered.sort((a, b) => b.sentimentScore - a.sentimentScore);
  if (sortBy === 'date')      filtered.sort((a, b) => b.uploadDate.localeCompare(a.uploadDate));

  const totalViews = artist.videos.reduce((s, v) => s + v.views, 0);
  const totalLikes = artist.videos.reduce((s, v) => s + v.likes, 0);
  const avgScore = artist.videos.length > 0
    ? Math.round(artist.videos.reduce((s, v) => s + v.sentimentScore, 0) / artist.videos.length)
    : 0;

  const filterButtons: { key: Filter; label: string; color: string }[] = [
    { key: 'all',    label: 'All',     color: '' },
    { key: 'low',    label: 'Healthy', color: 'text-emerald-400' },
    { key: 'medium', label: 'Monitor', color: 'text-amber-400' },
    { key: 'high',   label: 'Alert',   color: 'text-red-400' },
  ];

  return (
    <div className="p-8 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-6 transition-colors group">
        <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Overview
      </button>

      {/* Artist Profile Header */}
      <div className="card p-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0"
               style={{ background: `linear-gradient(135deg, ${artist.avatarColor[0]}, ${artist.avatarColor[1]})` }}>
            <span className="text-3xl font-bold text-white">{artist.initials}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-100 mb-1">{artist.name}</h1>
            <p className="text-sm text-slate-500">{artist.category}</p>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, label: 'Fans',      value: fmt(artist.fans), color: '#34d399' },
              { icon: Eye,        label: 'Views',     value: fmt(totalViews),  color: '#3b82f6' },
              { icon: Heart,      label: 'Likes',     value: fmt(totalLikes),  color: '#f472b6' },
              { icon: Star,       label: 'Avg Score', value: `${avgScore}`,    color: '#fbbf24' },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="text-center">
                  <Icon size={14} className="mx-auto mb-1" style={{ color: s.color }} />
                  <p className="text-lg font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-slate-600" />
          <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            {filterButtons.map(btn => (
              <button
                key={btn.key}
                onClick={() => setRiskFilter(btn.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                  riskFilter === btn.key
                    ? 'bg-white/[0.08] text-slate-200'
                    : `text-slate-600 hover:text-slate-400 ${btn.color}`
                }`}>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600">Sort:</span>
          {[
            { key: 'date' as const,      label: 'Latest' },
            { key: 'views' as const,     label: 'Views' },
            { key: 'sentiment' as const, label: 'Health' },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`text-xs px-2.5 py-1 rounded transition-all ${
                sortBy === s.key
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-slate-600 hover:text-slate-400'
              }`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      {filtered.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-slate-600 text-sm">
          No videos match the current filter
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {filtered.map(video => (
            <VideoCard key={video.bvId} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
