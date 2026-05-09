/**
 * 视频数据 Hooks
 */

import { useState, useEffect, useCallback } from 'react';
import type { Video, VideoAnalysis } from '../types';
import * as api from '../api/client';

interface UseVideosReturn {
  videos: Video[];
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

/**
 * 获取视频列表
 */
export function useVideos(params?: {
  artist_id?: string;
  risk_level?: string;
}): UseVideosReturn {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getVideos(params);
      setVideos(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch videos'));
    } finally {
      setLoading(false);
    }
  }, [params?.artist_id, params?.risk_level]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return {
    videos,
    loading,
    error,
    refresh: fetchVideos,
  };
}

interface UseVideoReturn {
  video: Video | null;
  loading: boolean;
  analyzing: boolean;
  error: Error | null;
  refresh: () => void;
}

/**
 * 获取单个视频详情
 * 每次进入页面都会自动触发实时分析
 */
export function useVideo(bvId: string | undefined): UseVideoReturn {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 用于手动刷新，不触发分析
  const fetchVideo = useCallback(async () => {
    if (!bvId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.getVideoWithAnalysis(bvId);
      setVideo(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch video'));
    } finally {
      setLoading(false);
    }
  }, [bvId]);

  useEffect(() => {
    // 获取数据并自动触发实时分析
    const init = async () => {
      if (!bvId) {
        setLoading(false);
        return;
      }

      // 1. 先获取现有数据
      try {
        setLoading(true);
        setError(null);
        const data = await api.getVideoWithAnalysis(bvId);
        setVideo(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch video'));
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }

      // 2. 自动触发 AI 分析（同步执行）
      try {
        setAnalyzing(true);
        console.log('[useVideo] Triggering AI analysis for:', bvId);

        // 调用分析 API，直接返回分析结果
        const analysis = await api.analyzeVideo(bvId);
        console.log('[useVideo] AI analysis completed');
        console.log('[useVideo] Received analysis:', {
          overview: analysis.aiSummary?.overview?.substring(0, 50),
          isLLM: (analysis as any)._is_llm_result,
          keyPointsCount: analysis.aiSummary?.keyPoints?.length,
          hotspotsCount: analysis.hotspots?.length,
        });

        // 更新 video 数据，合并分析结果
        setVideo(prev => {
          if (!prev) return null;
          return {
            ...prev,
            analysis,
          };
        });
      } catch (err) {
        console.error('[useVideo] Auto analysis failed:', err);
      } finally {
        setAnalyzing(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bvId]); // 只在 bvId 变化时触发

  return {
    video,
    loading,
    analyzing,
    error,
    refresh: fetchVideo,
  };
}

interface UseAnalysisReturn {
  analysis: VideoAnalysis | null;
  loading: boolean;
  error: Error | null;
  analyzing: boolean;
  triggerAnalysis: () => Promise<void>;
  refresh: () => void;
}

/**
 * 获取视频分析结果
 */
export function useVideoAnalysis(bvId: string | undefined): UseAnalysisReturn {
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnalysis = useCallback(async () => {
    if (!bvId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.getVideoAnalysis(bvId);
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch analysis'));
    } finally {
      setLoading(false);
    }
  }, [bvId]);

  const triggerAnalysis = useCallback(async () => {
    if (!bvId) return;

    try {
      setAnalyzing(true);
      setError(null);
      await api.analyzeVideo(bvId);
      // 轮询等待分析完成
      await new Promise(resolve => setTimeout(resolve, 3000));
      await fetchAnalysis();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to trigger analysis'));
    } finally {
      setAnalyzing(false);
    }
  }, [bvId, fetchAnalysis]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  return {
    analysis,
    loading,
    error,
    analyzing,
    triggerAnalysis,
    refresh: fetchAnalysis,
  };
}
