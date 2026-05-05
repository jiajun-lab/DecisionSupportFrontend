/**
 * Bilibili Admin Account Login Modal
 *
 * Features:
 * 1. QR code scan login
 * 2. Manual Cookie login
 * 3. Login status display
 */

import { useState } from 'react';
import { X, ScanLine, Cookie, LogOut, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useBilibiliAuth } from '../hooks/useBilibiliAuth';

interface BilibiliLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LoginTab = 'qr' | 'cookie';

export function BilibiliLoginModal({ isOpen, onClose }: BilibiliLoginModalProps) {
  const [activeTab, setActiveTab] = useState<LoginTab>('qr');
  const [cookieInput, setCookieInput] = useState('');

  const {
    isLoggedIn,
    loginTime,
    expiresIn,
    isLoading,
    qrStatus,
    qrMessage,
    qrCodeUrl,
    startQRLogin,
    cancelQRLogin,
    loginWithCookie,
    logout,
  } = useBilibiliAuth();

  const handleCookieSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cookieInput.trim()) return;

    const success = await loginWithCookie(cookieInput.trim());
    if (success) {
      setCookieInput('');
      onClose();
    }
  };

  const handleClose = () => {
    cancelQRLogin();
    setActiveTab('qr');
    setCookieInput('');
    onClose();
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!isOpen) return null;

  const formatExpiresIn = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/20">
            <span className="text-lg font-bold text-pink-400">B</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Bilibili Admin Login</h2>
            <p className="text-sm text-slate-400">Log in for accurate fan counts and engagement data</p>
          </div>
        </div>

        {/* Logged-in state */}
        {isLoggedIn ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle size={20} />
                <span className="font-medium">Logged In</span>
              </div>
              <div className="mt-2 space-y-1 text-sm text-slate-300">
                <p>Login time: {loginTime ? new Date(loginTime).toLocaleString() : '-'}</p>
                <p>Expires in: {formatExpiresIn(expiresIn)}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 py-2.5 text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <LogOut size={18} />
              )}
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="mb-6 flex gap-2 rounded-lg bg-white/5 p-1">
              <button
                onClick={() => setActiveTab('qr')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors ${
                  activeTab === 'qr'
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ScanLine size={16} />
                QR Login
              </button>
              <button
                onClick={() => setActiveTab('cookie')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors ${
                  activeTab === 'cookie'
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Cookie size={16} />
                Cookie Login
              </button>
            </div>

            {/* QR Login */}
            {activeTab === 'qr' && (
              <div className="space-y-4">
                {qrStatus === 'idle' ? (
                  <div className="flex flex-col items-center py-8">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                      <ScanLine size={32} className="text-slate-400" />
                    </div>
                    <p className="mb-4 text-center text-slate-400">
                      Scan with Bilibili App to log in
                    </p>
                    <button
                      onClick={startQRLogin}
                      className="rounded-lg bg-blue-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                    >
                      Get QR Code
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4">
                    {/* QR Code */}
                    <div className="relative mb-4 rounded-lg bg-white p-3">
                      {qrCodeUrl ? (
                        <div className="flex h-48 w-48 items-center justify-center text-slate-800">
                          <p className="text-center text-xs">QR code content:<br/>{qrCodeUrl.slice(0, 50)}...</p>
                        </div>
                      ) : (
                        <div className="flex h-48 w-48 items-center justify-center">
                          <Loader2 size={32} className="animate-spin text-slate-400" />
                        </div>
                      )}

                      {/* Overlay */}
                      {(qrStatus === 'confirmed' || qrStatus === 'expired' || qrStatus === 'error') && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/70">
                          {qrStatus === 'confirmed' && (
                            <CheckCircle size={48} className="text-emerald-400" />
                          )}
                          {qrStatus === 'expired' && (
                            <div className="text-center">
                              <AlertCircle size={32} className="mx-auto mb-2 text-amber-400" />
                              <span className="text-sm text-white">Expired</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Status message */}
                    <p className={`text-center text-sm ${
                      qrStatus === 'error' ? 'text-red-400' :
                      qrStatus === 'confirmed' ? 'text-emerald-400' :
                      'text-slate-400'
                    }`}>
                      {qrMessage}
                    </p>

                    {/* Refresh button */}
                    {(qrStatus === 'expired' || qrStatus === 'error') && (
                      <button
                        onClick={startQRLogin}
                        className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                      >
                        Refresh
                      </button>
                    )}

                    {/* Cancel button */}
                    {(qrStatus === 'pending' || qrStatus === 'scanned') && (
                      <button
                        onClick={cancelQRLogin}
                        className="mt-4 text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Cookie Login */}
            {activeTab === 'cookie' && (
              <form onSubmit={handleCookieSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Bilibili Cookie
                  </label>
                  <textarea
                    value={cookieInput}
                    onChange={(e) => setCookieInput(e.target.value)}
                    placeholder="SESSDATA=xxx; bili_jct=xxx; DedeUserID=xxx"
                    rows={4}
                    className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Hint: Log in to the Bilibili website and copy the Cookie from your browser's developer tools
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!cookieInput.trim() || isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Cookie size={18} />
                      Login
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
