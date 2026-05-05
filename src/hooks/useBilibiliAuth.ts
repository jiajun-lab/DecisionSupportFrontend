/**
 * B站管理账号登录状态 Hooks
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as api from '../api/client';

export type QRStatus = 'idle' | 'pending' | 'scanned' | 'confirmed' | 'expired' | 'error';

interface UseBilibiliAuthReturn {
  // 登录状态
  isLoggedIn: boolean;
  loginTime: string | null;
  expiresIn: number;
  isLoading: boolean;

  // 二维码登录
  qrStatus: QRStatus;
  qrMessage: string;
  qrCodeUrl: string | null;
  startQRLogin: () => Promise<void>;
  cancelQRLogin: () => void;

  // Cookie登录
  loginWithCookie: (cookie: string) => Promise<boolean>;

  // 登出
  logout: () => Promise<void>;

  // 刷新状态
  refreshStatus: () => Promise<void>;
}

/**
 * B站管理账号登录状态管理
 */
export function useBilibiliAuth(): UseBilibiliAuthReturn {
  // 登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginTime, setLoginTime] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 二维码登录状态
  const [qrStatus, setQrStatus] = useState<QRStatus>('idle');
  const [qrMessage, setQrMessage] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  // 用于轮询的ref
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const qrcodeKeyRef = useRef<string>('');

  /**
   * 获取登录状态
   */
  const refreshStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const status = await api.getBilibiliLoginStatus();
      setIsLoggedIn(status.logged_in);
      setLoginTime(status.login_time || null);
      setExpiresIn(status.expires_in);
    } catch (err) {
      console.error('Failed to get Bilibili login status:', err);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初始加载时获取状态
  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  /**
   * 开始二维码登录流程
   */
  const startQRLogin = useCallback(async () => {
    try {
      setQrStatus('pending');
      setQrMessage('Fetching QR code...');
      setQrCodeUrl(null);

      // 1. 获取二维码
      const qrResponse = await api.getBilibiliQRCode();

      if (!qrResponse.success) {
        setQrStatus('error');
        setQrMessage(qrResponse.message || 'Failed to get QR code');
        return;
      }

      setQrCodeUrl(qrResponse.url);
      qrcodeKeyRef.current = qrResponse.qrcode_key;
      setQrMessage('Scan with Bilibili App');

      // 2. 开始轮询
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }

      pollingRef.current = setInterval(async () => {
        try {
          const status = await api.checkBilibiliQRStatus(qrResponse.qrcode_key);

          switch (status.status) {
            case 'pending':
              setQrMessage('Waiting for scan...');
              break;
            case 'scanned':
              setQrStatus('scanned');
              setQrMessage('QR scanned — please confirm on your phone');
              break;
            case 'confirmed':
              // 登录成功
              if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
              }
              setQrStatus('confirmed');
              setQrMessage('Login successful');
              setQrCodeUrl(null);

              // 刷新登录状态
              await refreshStatus();
              break;
            case 'expired':
              if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
              }
              setQrStatus('expired');
              setQrMessage('QR code expired, please try again');
              break;
            case 'error':
              if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
              }
              setQrStatus('error');
              setQrMessage(status.message || 'Login failed');
              break;
          }
        } catch (err) {
          console.error('Failed to poll QR status:', err);
        }
      }, 2000); // 每2秒轮询一次

      // 设置过期定时器
      setTimeout(() => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          // Always expire — the polling interval is also cleared so no duplicate state update
          setQrStatus('expired');
          setQrMessage('QR code expired');
        }
      }, qrResponse.expires * 1000);

    } catch (err) {
      setQrStatus('error');
      setQrMessage(err instanceof Error ? err.message : 'Login failed');
    }
  }, [refreshStatus]);

  /**
   * 取消二维码登录
   */
  const cancelQRLogin = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setQrStatus('idle');
    setQrMessage('');
    setQrCodeUrl(null);
    qrcodeKeyRef.current = '';
  }, []);

  /**
   * 使用Cookie登录
   */
  const loginWithCookie = useCallback(async (cookie: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await api.setBilibiliCookie(cookie);

      if (result.success) {
        await refreshStatus();
        return true;
      } else {
        alert(result.message);
        return false;
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to set Cookie');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [refreshStatus]);

  /**
   * 登出
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await api.logoutBilibili();
      setIsLoggedIn(false);
      setLoginTime(null);
      setExpiresIn(0);
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  return {
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
    refreshStatus,
  };
}
