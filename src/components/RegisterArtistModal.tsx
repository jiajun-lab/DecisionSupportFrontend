/**
 * 注册新艺人弹窗
 * 通过B站UID和BV号注册UP主
 */

import { useState } from 'react';
import { X, UserPlus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { registerArtistByUid } from '../api/client';

interface RegisterArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 'input' | 'submitting' | 'success' | 'error';

export default function RegisterArtistModal({ isOpen, onClose, onSuccess }: RegisterArtistModalProps) {
  const [uid, setUid] = useState('');
  const [bvid, setBvid] = useState('');
  const [step, setStep] = useState<Step>('input');
  const [result, setResult] = useState<{
    artistName: string;
    videosFound: number;
    videosProcessed: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (!uid.trim() || !bvid.trim()) {
      setErrorMessage('请填写UID和BV号');
      return;
    }

    setStep('submitting');
    setErrorMessage('');

    try {
      const response = await registerArtistByUid(uid.trim(), bvid.trim());

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
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  B站 UID
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

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  验证 BV号
                </label>
                <input
                  type="text"
                  value={bvid}
                  onChange={(e) => setBvid(e.target.value)}
                  placeholder="例如：BV1GJ411x7h7"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  该UP主任意一个视频的BV号，用于验证身份
                </p>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={!uid.trim() || !bvid.trim()}
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
