import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ChevronDown, ChevronRight, Radio, Settings, Zap } from 'lucide-react';
import { artists } from '../mockData';

export default function Sidebar() {
  const [artistsExpanded, setArtistsExpanded] = useState(true);
  const navigate = useNavigate();

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
            <p className="text-sm font-semibold text-slate-100 leading-tight">MCN 决策平台</p>
            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">内容舆情监控系统</p>
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
          <span>总览</span>
        </NavLink>

        {/* Live Monitor (placeholder) */}
        <NavLink to="/monitor"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
              isActive
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`
          }>
          <Radio size={15} />
          <span>实时监控</span>
          <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            LIVE
          </span>
        </NavLink>

        {/* Artists section */}
        <div className="pt-3">
          <button
            onClick={() => setArtistsExpanded(v => !v)}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-widest hover:text-slate-400 transition-colors">
            {artistsExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            艺人
          </button>

          {artistsExpanded && (
            <div className="mt-1 space-y-0.5">
              {artists.map(artist => (
                <button
                  key={artist.id}
                  onClick={() => navigate(`/artist/${artist.id}`)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all duration-150 group">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${artist.avatarColor} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-[10px] font-bold text-white">{artist.initials}</span>
                  </div>
                  <span className="truncate text-left">{artist.name}</span>
                  <span className="ml-auto text-[10px] text-slate-600 group-hover:text-slate-500 transition-colors font-mono">
                    {artist.videos.length}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-white/[0.06]">
        <button className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-400 transition-colors">
          <Settings size={13} />
          <span>系统设置</span>
        </button>
        <p className="text-[10px] text-slate-700 mt-2 px-2">v0.1.0 · 仅限内部使用</p>
      </div>
    </aside>
  );
}
