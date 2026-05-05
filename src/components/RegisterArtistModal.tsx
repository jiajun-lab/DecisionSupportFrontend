/**
 * Register New Artist Modal
 * Add a Bilibili creator by UID and optional BV ID
 */

import { useState } from 'react';
import { X, UserPlus, Loader2, CheckCircle, AlertCircle, LogIn } from 'lucide-react';
import { registerArtistByUid } from '../api/client';

interface RegisterArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isLoggedIn?: boolean;
  onOpenLogin?: () => void;
}

type Step = 'input' | 'submitting' | 'success' | 'error';

export default function RegisterArtistModal({ isOpen, onClose, onSuccess, isLoggedIn = false, onOpenLogin }: RegisterArtistModalProps) {
  const [uid, setUid] = useState('');
  const [bvid, setBvid] = useState('');
  const [cookie, setCookie] = useState('');
  const [showCookie, setShowCookie] = useState(false);
  const [step, setStep] = useState<Step>('input');
  const [result, setResult] = useState<{
    artistName: string;
    videosFound: number;
    videosProcessed: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (!uid.trim()) {
      setErrorMessage('Please enter a UID');
      return;
    }
    if (!isLoggedIn && !bvid.trim()) {
      setErrorMessage('Not logged in. Please provide a BV ID for verification');
      return;
    }

    setStep('submitting');
    setErrorMessage('');

    try {
      const response = await registerArtistByUid(uid.trim(), bvid.trim() || undefined, cookie.trim() || undefined);

      if (response.code === 200 && response.data.artist) {
        setResult({
          artistName: response.data.artist.name,
          videosFound: response.data.videosFound,
          videosProcessed: response.data.videosProcessed,
        });
        setStep('success');
        onSuccess();
      } else {
        setErrorMessage(response.message || 'Registration failed');
        setStep('error');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error, please try again');
      setStep('error');
    }
  };

  const handleClose = () => {
    setUid('');
    setBvid('');
    setCookie('');
    setShowCookie(false);
    setStep('input');
    setResult(null);
    setErrorMessage('');
    onClose();
  };

  const handleRetry = () => {
    setStep('input');
    setErrorMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md card overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <UserPlus size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Register New Artist</h3>
              <p className="text-xs text-slate-500">Add a creator by Bilibili UID</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'input' && (
            <div className="space-y-4">
              {/* Login reminder */}
              {!isLoggedIn && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <LogIn size={16} className="text-amber-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-amber-300">
                      Log in to admin account to register with UID only
                    </p>
                  </div>
                  {onOpenLogin && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenLogin();
                      }}
                      className="text-xs text-amber-400 hover:text-amber-300 underline"
                    >
                      Login
                    </button>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Bilibili UID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  placeholder="e.g. 208259"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Found in the creator's profile URL, e.g. space.bilibili.com/208259
                </p>
              </div>

              {/* BV ID — required without login, optional with login */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Verify BV ID {!isLoggedIn && <span className="text-red-400">*</span>}
                  {isLoggedIn && <span className="text-slate-500 text-xs"> (optional)</span>}
                </label>
                <input
                  type="text"
                  value={bvid}
                  onChange={(e) => setBvid(e.target.value)}
                  placeholder={isLoggedIn ? "Leave blank to auto-fetch creator's videos" : "e.g. BV1GJ411x7h7"}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  {isLoggedIn
                    ? "If provided, this video will be prioritized; otherwise, recent videos will be fetched automatically"
                    : "Any BV ID from this creator, used for identity verification"}
                </p>
              </div>

              {/* Cookie (optional) — only shown when not logged in */}
              {!isLoggedIn && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">
                      Bilibili Cookie (optional)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCookie(!showCookie)}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      {showCookie ? 'Collapse' : 'Expand'}
                    </button>
                  </div>
                  {showCookie && (
                    <>
                      <textarea
                        value={cookie}
                        onChange={(e) => setCookie(e.target.value)}
                        placeholder="Paste Bilibili Cookie here..."
                        rows={3}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all text-xs font-mono"
                      />
                      <p className="mt-1.5 text-xs text-slate-500">
                        Log in to Bilibili website and copy all cookies from the Application tab in browser developer tools
                      </p>
                    </>
                  )}
                </div>
              )}

              {errorMessage && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={!uid.trim() || (!isLoggedIn && !bvid.trim())}
                  className="w-full py-3 bg-blue-500/20 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-blue-400 font-medium rounded-lg transition-colors"
                >
                  Register & Analyze
                </button>
              </div>

              <div className="text-xs text-slate-600 bg-white/[0.02] p-3 rounded-lg">
                <p className="font-medium text-slate-500 mb-1">Notes:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>The creator's videos will be crawled automatically after registration</li>
                  <li>Sentiment analysis will be triggered automatically (approx. 30–60 seconds)</li>
                  <li>Frequent operations may trigger Bilibili's rate-limiting</li>
                </ul>
              </div>
            </div>
          )}

          {step === 'submitting' && (
            <div className="py-12 flex flex-col items-center">
              <Loader2 size={48} className="text-blue-400 animate-spin mb-4" />
              <p className="text-slate-300 font-medium">Registering and analyzing...</p>
              <p className="text-sm text-slate-500 mt-2">This may take 30–60 seconds</p>
              <button
                onClick={handleClose}
                className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {step === 'success' && result && (
            <div className="py-8 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-emerald-400" />
              </div>
              <h4 className="text-lg font-semibold text-slate-100 mb-1">
                {result.artistName} registered successfully
              </h4>
              <p className="text-sm text-slate-500 text-center">
                Found {result.videosFound} video{result.videosFound !== 1 ? 's' : ''}, {result.videosProcessed} processed successfully
              </p>
              <button
                onClick={handleClose}
                className="mt-6 px-6 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {step === 'error' && (
            <div className="py-8 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <AlertCircle size={32} className="text-red-400" />
              </div>
              <h4 className="text-lg font-semibold text-slate-100 mb-1">Registration Failed</h4>
              <p className="text-sm text-slate-500 text-center max-w-xs">
                {errorMessage}
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleRetry}
                  className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                >
                  Retry
                </button>
                <button
                  onClick={handleClose}
                  className="px-6 py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
