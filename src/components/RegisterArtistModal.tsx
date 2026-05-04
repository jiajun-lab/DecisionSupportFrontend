/**
 * 注册新艺人弹窗
 * 通过B站UID和BV号注册UP主
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
      setErrorMessage('请填写UID');
      return;
    }
    // 未登录时需要BV号验证
    if (!isLoggedIn && !bvid.trim()) {
      setErrorMessage('未登录管理账号，请提供BV号进行验证');
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
        setErrorMessage(response.message || '注册失败');
        setStep('error');
      }
    } catch (err: any) {
      setErrorMessage(err.message || '网络错误，请重试');
      setStep('error');
    }
  };

  const handleClose = () => {
    // 重置状态
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
              <h3 className="text-lg font-semibold text-slate-100">注册新艺人</h3>
              <p className="text-xs text-slate-500">通过B站UID添加UP主</p>
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
              {/* 登录提醒 */}
              {!isLoggedIn && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <LogIn size={16} className="text-amber-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-amber-300">
                      登录管理账号后，仅需UID即可注册
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
                      去登录
                    </button>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  B站 UID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  placeholder="例如：208259"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  在UP主个人空间URL中找到，如 space.bilibili.com/208259
                </p>
              </div>

              {/* BV号 - 未登录时必填，登录后可选 */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  验证 BV号 {!isLoggedIn && <span className="text-red-400">*</span>}
                  {isLoggedIn && <span className="text-slate-500 text-xs">（可选）</span>}
                </label>
                <input
                  type="text"
                  value={bvid}
                  onChange={(e) => setBvid(e.target.value)}
                  placeholder={isLoggedIn ? "不填则自动获取该UP主视频" : "例如：BV1GJ411x7h7"}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  {isLoggedIn
                    ? "填写后优先处理该视频，不填则自动获取UP主最近视频"
                    : "该UP主任意一个视频的BV号，用于验证身份"}
                </p>
              </div>

              {/* Cookie 输入（可选） - 仅在未登录时显示 */}
              {!isLoggedIn && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">
                      B站 Cookie（可选）
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCookie(!showCookie)}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      {showCookie ? '收起' : '展开'}
                    </button>
                  </div>
                  {showCookie && (
                    <>
                      <textarea
                        value={cookie}
                        onChange={(e) => setCookie(e.target.value)}
                        placeholder="粘贴B站Cookie，用于获取真实粉丝数和更多视频..."
                        rows={3}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all text-xs font-mono"
                      />
                      <p className="mt-1.5 text-xs text-slate-500">
                        在B站网页版登录后，打开开发者工具-Application-Cookies，复制bilibili.com下的所有Cookie
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
                  注册并分析
                </button>
              </div>

              <div className="text-xs text-slate-600 bg-white/[0.02] p-3 rounded-lg">
                <p className="font-medium text-slate-500 mb-1">说明：</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>注册后会自动爬取该UP主的视频</li>
                  <li>系统将自动触发舆情分析（约需30-60秒）</li>
                  <li>频繁操作可能触发B站风控限制</li>
                </ul>
              </div>
            </div>
          )}

          {step === 'submitting' && (
            <div className="py-12 flex flex-col items-center">
              <Loader2 size={48} className="text-blue-400 animate-spin mb-4" />
              <p className="text-slate-300 font-medium">正在注册并分析...</p>
              <p className="text-sm text-slate-500 mt-2">这可能需要30-60秒</p>
              <button
                onClick={handleClose}
                className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg transition-colors"
              >
                关闭
              </button>
            </div>
          )}

          {step === 'success' && result && (
            <div className="py-8 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-emerald-400" />
              </div>
              <h4 className="text-lg font-semibold text-slate-100 mb-1">
                {result.artistName} 注册成功
              </h4>
              <p className="text-sm text-slate-500 text-center">
                发现 {result.videosFound} 个视频，成功处理 {result.videosProcessed} 个
              </p>
              <button
                onClick={handleClose}
                className="mt-6 px-6 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors"
              >
                完成
              </button>
            </div>
          )}

          {step === 'error' && (
            <div className="py-8 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <AlertCircle size={32} className="text-red-400" />
              </div>
              <h4 className="text-lg font-semibold text-slate-100 mb-1">注册失败</h4>
              <p className="text-sm text-slate-500 text-center max-w-xs">
                {errorMessage}
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleRetry}
                  className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                >
                  重试
                </button>
                <button
                  onClick={handleClose}
                  className="px-6 py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
