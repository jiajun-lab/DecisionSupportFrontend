import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ArtistVideos from './pages/ArtistVideos';
import VideoAnalysis from './pages/VideoAnalysis';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center">
        <span className="text-2xl">🚧</span>
      </div>
      <p className="text-sm text-slate-500">{title} — 功能即将上线</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden" style={{ background: '#070d1a' }}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/artist/:id" element={<ArtistVideos />} />
            <Route path="/video/:bvId" element={<VideoAnalysis />} />
            <Route path="/monitor" element={<PlaceholderPage title="实时监控" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
