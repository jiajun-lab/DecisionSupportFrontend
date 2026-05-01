/**
 * API 客户端
 * 封装后端 API 调用
 */

import type { Artist, ArtistSimple, Video, VideoAnalysis } from '../types';

const API_BASE_URL = 'http://localhost:8001/api/v1';

/**
 * 基础请求函数
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  return response.json();
}

// ========== 艺人相关 API ==========

/**
 * 获取所有艺人列表
 */
export async function getArtists(): Promise<ArtistSimple[]> {
  return fetchApi('/artists');
}

/**
 * 获取艺人详情（包含视频列表）
 */
export async function getArtist(artistId: string): Promise<Artist> {
  return fetchApi(`/artists/${artistId}`);
}

/**
 * 创建艺人
 */
export async function createArtist(artist: Omit<ArtistSimple, 'videos'>): Promise<{ code: number; message: string; data: ArtistSimple }> {
  return fetchApi('/artists', {
    method: 'POST',
    body: JSON.stringify(artist),
  });
}

/**
 * 删除艺人
 */
export async function deleteArtist(artistId: string): Promise<{ code: number; message: string }> {
  return fetchApi(`/artists/${artistId}`, {
    method: 'DELETE',
  });
}

/**
 * 通过B站UID注册UP主
 * @param uid B站UID
 * @param bvid 用于验证的BV号（该UP主的任意视频）
 * @param cookie B站Cookie（可选，用于获取真实粉丝数）
 */
export async function registerArtistByUid(
  uid: string,
  bvid: string,
  cookie?: string
): Promise<{
  code: number;
  message: string;
  data: {
    artist: ArtistSimple | null;
    videosFound: number;
    videosProcessed: number;
  }
}> {
  return fetchApi('/artists/register', {
    method: 'POST',
    body: JSON.stringify({ uid, bvid, cookie }),
  });
}

// ========== 视频相关 API ==========

/**
 * 获取视频列表
 */
export async function getVideos(params?: {
  artist_id?: string;
  risk_level?: string;
  limit?: number;
  offset?: number;
}): Promise<Video[]> {
  const queryParams = new URLSearchParams();
  if (params?.artist_id) queryParams.append('artist_id', params.artist_id);
  if (params?.risk_level) queryParams.append('risk_level', params.risk_level);
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.offset) queryParams.append('offset', params.offset.toString());

  const query = queryParams.toString();
  return fetchApi(`/videos${query ? `?${query}` : ''}`);
}

/**
 * 获取艺人的视频列表
 */
export async function getArtistVideos(
  artistId: string,
  riskLevel?: string
): Promise<Video[]> {
  const query = riskLevel ? `?risk_level=${riskLevel}` : '';
  return fetchApi(`/artists/${artistId}/videos${query}`);
}

/**
 * 获取视频详情
 */
export async function getVideo(bvId: string): Promise<Video> {
  const response = await fetchApi<any>(`/video/${bvId}`);
  // 转换后端字段到前端格式
  return {
    bvId: response.v_id,
    title: response.title,
    coverGradient: response.cover_gradient || ['#1a1a2e', '#16213e'],
    views: response.stats?.view || 0,
    likes: response.stats?.like || 0,
    coins: response.stats?.coin || 0,
    favorites: response.stats?.favorite || 0,
    danmakuCount: response.stats?.danmaku_count || 0,
    uploadDate: response.upload_date || '',
    duration: response.duration || '',
    artistId: response.artist_id || '',
    artistName: '', // 需要通过其他方式获取
    sentimentScore: response.sentiment_score || 0,
    riskLevel: response.risk_level || 'low',
    analysis: undefined,
  };
}

// ========== 爬虫相关 API ==========

/**
 * 触发视频爬虫
 */
export async function crawlVideo(
  bvId: string,
  artistId?: string
): Promise<{ message: string; status: string }> {
  return fetchApi(`/crawl/${bvId}`, {
    method: 'POST',
  });
}

// ========== 分析相关 API ==========

/**
 * 触发 NLP 分析
 */
export async function analyzeVideo(bvId: string): Promise<{ message: string; status: string }> {
  return fetchApi(`/analyze/${bvId}`, {
    method: 'POST',
  });
}

/**
 * 获取视频分析结果
 */
export async function getVideoAnalysis(bvId: string): Promise<VideoAnalysis> {
  const response = await fetchApi<any>(`/analysis/${bvId}`);

  // 转换后端字段到前端格式
  return {
    sentiment: response.sentiment || {
      praise: 0, discussion: 0, adDislike: 0, attack: 0, sarcasm: 0
    },
    timeline: response.timeline || [],
    hotspots: response.hotspots || [],
    intent: response.intent || {
      waterComment: 0, suggestion: 0, rant: 0, urgeUpdate: 0, sponsored: 0
    },
    aiSummary: response.aiSummary || {
      overview: '',
      keyPoints: [],
      riskAlerts: [],
      recommendations: [],
      hotMemes: []
    },
  };
}

/**
 * 获取视频完整信息（包含分析）
 */
export async function getVideoWithAnalysis(bvId: string): Promise<Video> {
  // 并行获取视频信息和分析结果
  const [videoData, artistData, analysisData] = await Promise.all([
    fetchApi<any>(`/video/${bvId}`),
    fetchApi<any>(`/video/${bvId}`).then(v =>
      v.artist_id ? fetchApi<any>(`/artists/${v.artist_id}`).catch(() => null) : null
    ),
    getVideoAnalysis(bvId).catch(() => null),
  ]);

  return {
    bvId: videoData.v_id,
    title: videoData.title,
    coverGradient: videoData.cover_gradient || ['#1a1a2e', '#16213e'],
    views: videoData.stats?.view || 0,
    likes: videoData.stats?.like || 0,
    coins: videoData.stats?.coin || 0,
    favorites: videoData.stats?.favorite || 0,
    danmakuCount: videoData.stats?.danmaku_count || 0,
    uploadDate: videoData.upload_date || '',
    duration: videoData.duration || '',
    artistId: videoData.artist_id || '',
    artistName: artistData?.name || '',
    sentimentScore: videoData.sentiment_score || 0,
    riskLevel: videoData.risk_level || 'low',
    analysis: analysisData || undefined,
  };
}
