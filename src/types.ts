export interface Artist {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  category: string;
  fans: number;
  totalVideos: number;
  totalViews: number;
  latestActivity: string;
  videos: Video[];
}

// Simplified artist type for list views (from API)
export interface ArtistSimple {
  id: string;
  name: string;
  initials: string;
  avatarColor: [string, string];  // Array format from API
  category: string;
  fans: number;
  totalVideos: number;
  totalViews: number;
  latestActivity: string;
  videos: Video[];
}

export interface Video {
  bvId: string;
  title: string;
  coverGradient: [string, string];
  views: number;
  likes: number;
  coins: number;
  favorites: number;
  danmakuCount: number;
  uploadDate: string;
  duration: string;
  artistId: string;
  artistName: string;
  sentimentScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  analysis?: VideoAnalysis;
}

export interface VideoAnalysis {
  /** 情感分布，各字段为百分比（合计约 100） */
  sentiment: {
    praise: number;
    discussion: number;
    adDislike: number;
    attack: number;
    sarcasm: number;
  };
  /** 意图分布，各字段为百分比（合计约 100） */
  intent: {
    waterComment: number;
    suggestion: number;
    rant: number;
    urgeUpdate: number;
    sponsored: number;
  };
  /** 参与分类的有效评论总条数（用于从百分比还原实际计数） */
  commentCount: number;
  timeline: Array<{ second: number; density: number }>;
  hotspots: Array<{
    startSecond: number;
    endSecond: number;
    label: string;
    peakDensity: number;
  }>;
  aiSummary: {
    overview: string;
    keyPoints: string[];
    riskAlerts: string[];
    recommendations: string[];
    hotMemes: string[];
  };
}
