import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ChevronDown, ChevronRight, Settings, Zap, Loader2 } from 'lucide-react';
import { useArtists } from '../hooks';

export default function Sidebar() {
  const [artistsExpanded, setArtistsExpanded] = useState(true);
  const navigate = useNavigate();
  const { artists, loading } = useArtists();

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col h-full border-r border-white/[0.06]"
      style={{ background: 'linear-gradient(180deg, #080e1d 0%, #060c18 100%)' }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100 leading-tight">MCN Platform</p>
            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Content Sentiment Monitor</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {/* Overview */}
        <NavLink to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
              isActive
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`
          }>
          <LayoutDashboard size={15} />
          <span>Overview</span>
        </NavLink>

        {/* Artists section */}
        <div className="pt-3">
          <button
            onClick={() => setArtistsExpanded(v => !v)}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-widest hover:text-slate-400 transition-colors">
            {artistsExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            Artists
          </button>

          {artistsExpanded && (
            <div className="mt-1 space-y-0.5">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 size={16} className="animate-spin text-slate-600" />
                </div>
              ) : artists.length === 0 ? (
                <div className="px-3 py-4 text-xs text-slate-600 text-center">
                  暂无艺人数据
                </div>
              ) : (
                artists.map(artist => (
                  <button
                    key={artist.id}
                    onClick={() => navigate(`/artist/${artist.id}`)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all duration-150 group">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${artist.avatarColor} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-[10px] font-bold text-white">{artist.initials}</span>
                    </div>
                    <span className="truncate text-left">{artist.name}</span>
                    <span className="ml-auto text-[10px] text-slate-600 group-hover:text-slate-500 transition-colors font-mono">
                      {artist.videos?.length || 0}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-white/[0.06]">
        <button className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-400 transition-colors">
          <Settings size={13} />
          <span>Settings</span>
        </button>
        <p className="text-[10px] text-slate-700 mt-2 px-2">v0.1.0 · Internal Use Only</p>
      </div>
    </aside>
  );
}
