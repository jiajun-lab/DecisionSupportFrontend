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
  analysis: VideoAnalysis;
}

export interface VideoAnalysis {
  sentiment: {
    praise: number;
    discussion: number;
    adDislike: number;
    attack: number;
    sarcasm: number;
  };
  timeline: Array<{ second: number; density: number }>;
  hotspots: Array<{
    startSecond: number;
    endSecond: number;
    label: string;
    peakDensity: number;
  }>;
  intent: {
    waterComment: number;
    suggestion: number;
    rant: number;
    urgeUpdate: number;
    sponsored: number;
  };
  aiSummary: {
    overview: string;
    keyPoints: string[];
    riskAlerts: string[];
    recommendations: string[];
    hotMemes: string[];
  };
}
