import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ArtistVideos from './pages/ArtistVideos';
import VideoAnalysis from './pages/VideoAnalysis';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex h-screen overflow-hidden" style={{ background: '#070d1a' }}>
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/artist/:id" element={<ArtistVideos />} />
              <Route path="/video/:bvId" element={<VideoAnalysis />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
