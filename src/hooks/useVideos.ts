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
  error: Error | null;
  refresh: () => void;
}

/**
 * 获取单个视频详情
 */
export function useVideo(bvId: string | undefined): UseVideoReturn {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
    fetchVideo();
  }, [fetchVideo]);

  return {
    video,
    loading,
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
