/**
 * 全局认证状态管理 Context
 * 用于共享B站登录状态 across the app
 */

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import * as api from '../api/client';

export type QRStatus = 'idle' | 'pending' | 'scanned' | 'confirmed' | 'expired' | 'error';

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
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
  const pollingRef = React.useRef<NodeJS.Timeout | null>(null);
  const qrcodeKeyRef = React.useRef<string>('');

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
      console.error('获取B站登录状态失败:', err);
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
      setQrMessage('正在获取二维码...');
      setQrCodeUrl(null);

      // 1. 获取二维码
      const qrResponse = await api.getBilibiliQRCode();

      if (!qrResponse.success) {
        setQrStatus('error');
        setQrMessage(qrResponse.message || '获取二维码失败');
        return;
      }

      setQrCodeUrl(qrResponse.url);
      qrcodeKeyRef.current = qrResponse.qrcode_key;
      setQrMessage('请使用B站App扫描二维码');

      // 2. 开始轮询
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }

      pollingRef.current = setInterval(async () => {
        try {
          const status = await api.checkBilibiliQRStatus(qrResponse.qrcode_key);

          switch (status.status) {
            case 'pending':
              setQrMessage('等待扫码...');
              break;
            case 'scanned':
              setQrStatus('scanned');
              setQrMessage('已扫码，请在手机上确认登录');
              break;
            case 'confirmed':
              // 登录成功
              if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
              }
              setQrStatus('confirmed');
              setQrMessage('登录成功');
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
              setQrMessage('二维码已过期，请重试');
              break;
            case 'error':
              if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
              }
              setQrStatus('error');
              setQrMessage(status.message || '登录失败');
              break;
          }
        } catch (err) {
          console.error('轮询二维码状态失败:', err);
        }
      }, 2000); // 每2秒轮询一次

      // 设置过期定时器
      setTimeout(() => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
        if (qrStatus === 'pending' || qrStatus === 'scanned') {
          setQrStatus('expired');
          setQrMessage('二维码已过期');
        }
      }, qrResponse.expires * 1000);

    } catch (err) {
      setQrStatus('error');
      setQrMessage(err instanceof Error ? err.message : '登录失败');
    }
  }, [qrStatus, refreshStatus]);

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
      alert(err instanceof Error ? err.message : 'Cookie设置失败');
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
      console.error('登出失败:', err);
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

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Need to import React for useRef
import React from 'react';
