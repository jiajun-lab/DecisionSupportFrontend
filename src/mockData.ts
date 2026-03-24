import type { Artist, Video } from './types';

function genTimeline(durationSec: number, peaks: Array<{ center: number; height: number; spread: number }>): Array<{ second: number; density: number }> {
  const step = 30;
  const points: Array<{ second: number; density: number }> = [];
  for (let s = 0; s <= durationSec; s += step) {
    let density = 5 + Math.random() * 10;
    for (const peak of peaks) {
      const dist = Math.abs(s - peak.center);
      density += peak.height * Math.exp(-(dist * dist) / (2 * peak.spread * peak.spread));
    }
    points.push({ second: s, density: Math.round(density) });
  }
  return points;
}

const videos: Video[] = [
  // ─── 林小柒 ───────────────────────────────────────────────────────────────
  {
    bvId: 'BV1xx411c7mD',
    title: '我在云南秘境发现了一个没有外人的村子，他们的生活让我沉默了',
    coverGradient: ['#1a6b3c', '#0f4c75'],
    views: 4820000, likes: 312000, coins: 98000, favorites: 201000, danmakuCount: 28400,
    uploadDate: '2024-03-15', duration: '18:42', artistId: 'linxiaoqi', artistName: '林小柒',
    sentimentScore: 88, riskLevel: 'low',
    analysis: {
      sentiment: { praise: 65, discussion: 18, adDislike: 5, attack: 2, sarcasm: 10 },
      timeline: genTimeline(1122, [
        { center: 240, height: 120, spread: 60 },
        { center: 720, height: 180, spread: 45 },
        { center: 1020, height: 95, spread: 50 },
      ]),
      hotspots: [
        { startSecond: 200, endSecond: 290, label: '发现隐秘村落', peakDensity: 145 },
        { startSecond: 680, endSecond: 770, label: '非遗手工艺展示', peakDensity: 198 },
        { startSecond: 980, endSecond: 1060, label: '与村民共餐', peakDensity: 112 },
      ],
      intent: { waterComment: 8, suggestion: 22, rant: 5, urgeUpdate: 45, sponsored: 20 },
      aiSummary: {
        overview: '本期视频整体口碑极佳，观众情绪以正向共鸣为主。云南秘境系列内容引发了强烈的向往情绪，"好想去" "太美了" 等评论占据高频词。',
        keyPoints: [
          '手工艺展示片段（12:00-12:50）是本期最强爆点，弹幕密度峰值达 198条/分',
          '非遗文化内容引发深度讨论，催更率极高，粉丝期待"第二季"',
          '结尾BGM选曲引发大量弹幕认同，音乐氛围营造成功',
        ],
        riskAlerts: [
          '部分评论提及"这集广告软植入有点明显"，需关注商单透明度',
        ],
        recommendations: [
          '可考虑将手工艺内容拆分为独立系列，流量潜力巨大',
          '结合地方旅游局联动，有利于内容变现且不影响用户体验',
        ],
        hotMemes: ['秘境YYDS', '我不去我遗憾终生', '这辈子一定要去一次'],
      },
    },
  },
  {
    bvId: 'BV1ab411f7kR',
    title: '【云南系列02】用最原始的方式做一顿饭，食材全部来自山野',
    coverGradient: ['#2d5016', '#1a3a0a'],
    views: 3150000, likes: 218000, coins: 71000, favorites: 155000, danmakuCount: 19200,
    uploadDate: '2024-03-22', duration: '22:15', artistId: 'linxiaoqi', artistName: '林小柒',
    sentimentScore: 85, riskLevel: 'low',
    analysis: {
      sentiment: { praise: 60, discussion: 22, adDislike: 7, attack: 3, sarcasm: 8 },
      timeline: genTimeline(1335, [
        { center: 300, height: 100, spread: 70 },
        { center: 850, height: 160, spread: 55 },
        { center: 1200, height: 130, spread: 50 },
      ]),
      hotspots: [
        { startSecond: 250, endSecond: 360, label: '采摘野菜', peakDensity: 115 },
        { startSecond: 810, endSecond: 900, label: '野外生火烹饪', peakDensity: 178 },
        { startSecond: 1150, endSecond: 1260, label: '最终成品展示', peakDensity: 148 },
      ],
      intent: { waterComment: 10, suggestion: 18, rant: 6, urgeUpdate: 50, sponsored: 16 },
      aiSummary: {
        overview: '食材采集与烹饪过程引发大量弹幕互动，原始生活方式契合当前观众"反城市焦虑"情绪出口。',
        keyPoints: [
          '"野外生火烹饪"是本期核心爆点，真实感极强，弹幕自发刷 "好香" 形成互动浪潮',
          '观众认同感强烈，大量弹幕表达"下班就看这个解压"',
        ],
        riskAlerts: [],
        recommendations: [
          '在画面中适当加入食材科普字幕，增加内容密度，吸引美食博主互动',
        ],
        hotMemes: ['隔着屏幕都香了', '好想躺平', '治愈系天花板'],
      },
    },
  },
  {
    bvId: 'BV1cd411e7bN',
    title: '恰饭视频：带你看看XX品牌的护肤理念（广告）',
    coverGradient: ['#1e3a5f', '#2d1b69'],
    views: 1280000, likes: 45000, coins: 8200, favorites: 22000, danmakuCount: 5100,
    uploadDate: '2024-03-29', duration: '8:30', artistId: 'linxiaoqi', artistName: '林小柒',
    sentimentScore: 42, riskLevel: 'high',
    analysis: {
      sentiment: { praise: 15, discussion: 10, adDislike: 45, attack: 18, sarcasm: 12 },
      timeline: genTimeline(510, [
        { center: 120, height: 80, spread: 40 },
        { center: 400, height: 60, spread: 35 },
      ]),
      hotspots: [
        { startSecond: 90, endSecond: 160, label: '开场吐槽高峰', peakDensity: 95 },
        { startSecond: 370, endSecond: 440, label: '产品价格公示', peakDensity: 72 },
      ],
      intent: { waterComment: 20, suggestion: 5, rant: 50, urgeUpdate: 5, sponsored: 20 },
      aiSummary: {
        overview: '⚠️ 本期广告视频引发较强负面情绪。"怎么又恰饭" 类评论占比高达 38%，舆情风险较高。',
        keyPoints: [
          '广告内容与日常风格差异过大，受众落差感明显',
          '产品定价偏高，粉丝性价比质疑声较多',
        ],
        riskAlerts: [
          '恶意攻击占比 18%，已触发预警阈值，建议开启精选评论',
          '"取关" 相关词汇在评论中出现频次上升 +340%',
        ],
        recommendations: [
          '广告植入需要与日常内容场景强绑定，减少割裂感',
          '控制商单频率，建议每月不超过 1 条纯广告视频',
        ],
        hotMemes: ['恰饭别太猛', '下次一定', 'up主也要恰饭'],
      },
    },
  },
  {
    bvId: 'BV1ef411h7gT',
    title: '在大理租了一间老院子，决定在这里住三个月',
    coverGradient: ['#4a1942', '#1a1a6e'],
    views: 5600000, likes: 445000, coins: 132000, favorites: 310000, danmakuCount: 41000,
    uploadDate: '2024-04-05', duration: '25:08', artistId: 'linxiaoqi', artistName: '林小柒',
    sentimentScore: 92, riskLevel: 'low',
    analysis: {
      sentiment: { praise: 72, discussion: 15, adDislike: 3, attack: 1, sarcasm: 9 },
      timeline: genTimeline(1508, [
        { center: 380, height: 200, spread: 80 },
        { center: 900, height: 150, spread: 60 },
        { center: 1380, height: 170, spread: 65 },
      ]),
      hotspots: [
        { startSecond: 300, endSecond: 460, label: '初见院落全景', peakDensity: 220 },
        { startSecond: 850, endSecond: 960, label: '与房东奶奶对话', peakDensity: 168 },
        { startSecond: 1320, endSecond: 1440, label: '夕阳下的庭院时光', peakDensity: 190 },
      ],
      intent: { waterComment: 5, suggestion: 15, rant: 3, urgeUpdate: 65, sponsored: 12 },
      aiSummary: {
        overview: '本期为全年最佳表现视频。院落生活叙事触碰到都市疲倦族群最深的共鸣，完播率预计超过 65%。',
        keyPoints: [
          '初见院落镜头引爆弹幕，出现 "这就是我想要的生活" 类弹幕刷屏现象',
          '与房东奶奶的互动情感浓度极高，弹幕共情率高',
          '整体节奏克制、诗意，非常符合品牌调性',
        ],
        riskAlerts: [],
        recommendations: [
          '可考虑出周边纪录片或 Vlog 系列，延续大理院落叙事 IP',
          '适合接民宿、文旅类优质商单，与内容风格高度契合',
        ],
        hotMemes: ['这辈子一定要有一个大理院子', 'YYDS', '太治愈了吧'],
      },
    },
  },

  // ─── 影视飓风 ───────────────────────────────────────────────────────────────
  {
    bvId: 'BV1gh411i7hU',
    title: '我花了半年测试200台相机，这是我的结论',
    coverGradient: ['#1a1a2e', '#16213e'],
    views: 8200000, likes: 612000, coins: 280000, favorites: 420000, danmakuCount: 62000,
    uploadDate: '2024-03-18', duration: '31:22', artistId: 'videohurricane', artistName: '影视飓风',
    sentimentScore: 94, riskLevel: 'low',
    analysis: {
      sentiment: { praise: 70, discussion: 22, adDislike: 3, attack: 1, sarcasm: 4 },
      timeline: genTimeline(1882, [
        { center: 500, height: 250, spread: 100 },
        { center: 1100, height: 200, spread: 80 },
        { center: 1700, height: 180, spread: 75 },
      ]),
      hotspots: [
        { startSecond: 400, endSecond: 610, label: '最佳综合相机揭晓', peakDensity: 280 },
        { startSecond: 1040, endSecond: 1180, label: '旗舰相机横评', peakDensity: 225 },
        { startSecond: 1640, endSecond: 1780, label: '最终选购建议', peakDensity: 200 },
      ],
      intent: { waterComment: 5, suggestion: 30, rant: 8, urgeUpdate: 35, sponsored: 22 },
      aiSummary: {
        overview: '专业评测内容获得创作者社区高度认可，信息密度与可信度双高，成为圈内引用标杆。',
        keyPoints: [
          '"最佳综合相机" 揭晓瞬间是全片最高弹幕峰值，280条/分，出现自发倒计时弹幕',
          '专业数据详细，讨论评论占比22%，技术深度受用户高度肯定',
          '结尾选购建议实用性强，收藏率异常高',
        ],
        riskAlerts: [],
        recommendations: [
          '可将各品牌横评剪辑为单独短视频投放，扩大分发范围',
          '考虑开设摄影器材评测专栏，形成内容矩阵',
        ],
        hotMemes: ['核弹级测评', '含金量MAX', '买了买了'],
      },
    },
  },
  {
    bvId: 'BV1ij411j7iV',
    title: '为什么电影里的夜景这么好看？顶级摄影师的秘密',
    coverGradient: ['#0a0a2e', '#1a0a3e'],
    views: 5400000, likes: 398000, coins: 155000, favorites: 280000, danmakuCount: 38000,
    uploadDate: '2024-03-25', duration: '18:55', artistId: 'videohurricane', artistName: '影视飓风',
    sentimentScore: 91, riskLevel: 'low',
    analysis: {
      sentiment: { praise: 68, discussion: 25, adDislike: 2, attack: 1, sarcasm: 4 },
      timeline: genTimeline(1135, [
        { center: 300, height: 180, spread: 70 },
        { center: 750, height: 220, spread: 65 },
        { center: 1050, height: 160, spread: 55 },
      ]),
      hotspots: [
        { startSecond: 250, endSecond: 360, label: '光绘原理揭秘', peakDensity: 195 },
        { startSecond: 700, endSecond: 810, label: '对比实拍演示', peakDensity: 238 },
        { startSecond: 1000, endSecond: 1100, label: '调色技巧展示', peakDensity: 175 },
      ],
      intent: { waterComment: 6, suggestion: 28, rant: 5, urgeUpdate: 40, sponsored: 21 },
      aiSummary: {
        overview: '科普向内容在影像爱好者群体中引发强烈共鸣，技术揭秘叙事节奏把控极佳。',
        keyPoints: [
          '对比实拍演示环节弹幕刷屏 "原来如此"，知识获得感驱动高分享率',
          '调色技巧部分受到摄影师群体追捧，专业讨论评论质量高',
        ],
        riskAlerts: [],
        recommendations: [
          '开设专属技术教学系列，配套课程销售空间较大',
        ],
        hotMemes: ['知识改变弹幕', '学到了学到了', '存档慢慢看'],
      },
    },
  },
  {
    bvId: 'BV1kl411k7jW',
    title: '拍了10年视频，我终于搞懂了什么是"好内容"',
    coverGradient: ['#1e1b4b', '#312e81'],
    views: 6800000, likes: 520000, coins: 198000, favorites: 350000, danmakuCount: 48000,
    uploadDate: '2024-04-01', duration: '28:40', artistId: 'videohurricane', artistName: '影视飓风',
    sentimentScore: 96, riskLevel: 'low',
    analysis: {
      sentiment: { praise: 75, discussion: 18, adDislike: 2, attack: 1, sarcasm: 4 },
      timeline: genTimeline(1720, [
        { center: 420, height: 230, spread: 90 },
        { center: 1000, height: 260, spread: 85 },
        { center: 1580, height: 210, spread: 80 },
      ]),
      hotspots: [
        { startSecond: 360, endSecond: 500, label: '10年内容复盘', peakDensity: 248 },
        { startSecond: 940, endSecond: 1080, label: '核心观点输出', peakDensity: 285 },
        { startSecond: 1510, endSecond: 1660, label: '创作者思考分享', peakDensity: 228 },
      ],
      intent: { waterComment: 4, suggestion: 20, rant: 4, urgeUpdate: 52, sponsored: 20 },
      aiSummary: {
        overview: '创作者深度自省视频引发行业级别讨论，成为 B 站内容创作圈年度必看视频之一。',
        keyPoints: [
          '"核心观点输出"片段弹幕密度全片最高，引发大量创作者感同身受的互动',
          '视频被大量创作者转发推荐，形成二次传播效应',
          '评论区出现高质量长评，内容深度获圈内高度认可',
        ],
        riskAlerts: [],
        recommendations: [
          '本视频适合用于品牌方展示影响力，可配合商务发展使用',
          '可延伸为创作者系列访谈内容，构建行业影响力矩阵',
        ],
        hotMemes: ['救了', '每个做内容的都该看', '泪目'],
      },
    },
  },

  // ─── 朱一旦 ─────────────────────────────────────────────────────────────────
  {
    bvId: 'BV1mn411m7kX',
    title: '朱一旦的枯燥生活：我花了100万做了一件没用的事',
    coverGradient: ['#78350f', '#431407'],
    views: 12500000, likes: 980000, coins: 420000, favorites: 680000, danmakuCount: 95000,
    uploadDate: '2024-03-20', duration: '12:30', artistId: 'zhuyidan', artistName: '朱一旦',
    sentimentScore: 90, riskLevel: 'low',
    analysis: {
      sentiment: { praise: 62, discussion: 25, adDislike: 4, attack: 2, sarcasm: 7 },
      timeline: genTimeline(750, [
        { center: 180, height: 300, spread: 70 },
        { center: 480, height: 380, spread: 60 },
        { center: 680, height: 340, spread: 55 },
      ]),
      hotspots: [
        { startSecond: 140, endSecond: 240, label: '荒诞事件揭示', peakDensity: 320 },
        { startSecond: 440, endSecond: 530, label: '反转高潮', peakDensity: 405 },
        { startSecond: 640, endSecond: 720, label: '结尾金句', peakDensity: 365 },
      ],
      intent: { waterComment: 10, suggestion: 12, rant: 8, urgeUpdate: 55, sponsored: 15 },
      aiSummary: {
        overview: '荒诞叙事风格精准拿捏当代年轻人情绪，本期反转设计尤为出色，引发大规模自发传播。',
        keyPoints: [
          '"反转高潮"弹幕密度 405条/分，为本账号历史峰值，大量用户发出"哈哈哈哈"浪潮',
          '结尾金句成为站内热梗，被大量视频引用',
          '视频节奏极度精准，12分钟内三次情绪爆发设计完美',
        ],
        riskAlerts: [],
        recommendations: [
          '可将"结尾金句"系列化，做成周期性内容 IP',
        ],
        hotMemes: ['枯燥的人生', '富哥真会玩', 'HHHH太真实了'],
      },
    },
  },
  {
    bvId: 'BV1op411n7lY',
    title: '我雇了20个人专门陪我无聊，一天花费 23 万',
    coverGradient: ['#5b21b6', '#1e1b4b'],
    views: 9800000, likes: 760000, coins: 310000, favorites: 520000, danmakuCount: 78000,
    uploadDate: '2024-03-28', duration: '10:45', artistId: 'zhuyidan', artistName: '朱一旦',
    sentimentScore: 88, riskLevel: 'low',
    analysis: {
      sentiment: { praise: 60, discussion: 22, adDislike: 5, attack: 3, sarcasm: 10 },
      timeline: genTimeline(645, [
        { center: 150, height: 260, spread: 65 },
        { center: 400, height: 340, spread: 55 },
        { center: 590, height: 310, spread: 50 },
      ]),
      hotspots: [
        { startSecond: 110, endSecond: 200, label: '雇人计划揭晓', peakDensity: 278 },
        { startSecond: 360, endSecond: 450, label: '无聊实验过程', peakDensity: 358 },
        { startSecond: 550, endSecond: 630, label: '荒诞结论', peakDensity: 330 },
      ],
      intent: { waterComment: 12, suggestion: 10, rant: 9, urgeUpdate: 58, sponsored: 11 },
      aiSummary: {
        overview: '本期延续荒诞富豪人设，对"无聊经济学"的解构让观众在发笑的同时产生深度共鸣。',
        keyPoints: [
          '"无聊实验过程"弹幕创下高密度，大量弹幕自发形成叙事配合',
          '内容哲学性得到知乎高质量用户群讨论，站外破圈效应明显',
        ],
        riskAlerts: [
          '少数评论质疑内容"炫富有点过"，需注意边界把握',
        ],
        recommendations: [
          '适当加入更多"普通人视角"对照，增加故事张力',
        ],
        hotMemes: ['富哥今天状态不好', '这就是有钱人的快乐', '我也想这样'],
      },
    },
  },
  {
    bvId: 'BV1qr411o7mZ',
    title: '把公司所有员工的工资发到直播间，结果闹翻了',
    coverGradient: ['#7f1d1d', '#450a0a'],
    views: 15200000, likes: 1180000, coins: 520000, favorites: 790000, danmakuCount: 120000,
    uploadDate: '2024-04-08', duration: '16:20', artistId: 'zhuyidan', artistName: '朱一旦',
    sentimentScore: 85, riskLevel: 'medium',
    analysis: {
      sentiment: { praise: 55, discussion: 28, adDislike: 6, attack: 5, sarcasm: 6 },
      timeline: genTimeline(980, [
        { center: 200, height: 350, spread: 75 },
        { center: 600, height: 480, spread: 70 },
        { center: 880, height: 420, spread: 65 },
      ]),
      hotspots: [
        { startSecond: 150, endSecond: 270, label: '员工薪资公示', peakDensity: 375 },
        { startSecond: 550, endSecond: 670, label: '现场冲突爆发', peakDensity: 512 },
        { startSecond: 830, endSecond: 940, label: '最终收场', peakDensity: 445 },
      ],
      intent: { waterComment: 15, suggestion: 15, rant: 20, urgeUpdate: 40, sponsored: 10 },
      aiSummary: {
        overview: '本期引发强烈的劳动议题讨论，超预期破圈。"现场冲突爆发"片段弹幕密度创账号历史新高。',
        keyPoints: [
          '"现场冲突"片段 512条/分弹幕密度，引发极强真实感讨论',
          '员工薪资话题触发广泛社会共鸣，分享率显著高于平均',
          '评论区出现大量高质量劳动关系讨论，内容深度超预期',
        ],
        riskAlerts: [
          '恶意攻击占比 5%，需监控；有质疑内容真实性的声音，应准备应对方案',
          '劳动议题敏感，评论区需持续监控舆情走向',
        ],
        recommendations: [
          '建议针对真实性质疑出一个简短回应视频，维护内容可信度',
        ],
        hotMemes: ['社会主义打工人', '我被这工资看到了', '朱总有点猛'],
      },
    },
  },

  // ─── 老番茄 ─────────────────────────────────────────────────────────────────
  {
    bvId: 'BV1st411p7nA',
    title: '【老番茄】我玩了三年原神，这是我的最终感受',
    coverGradient: ['#064e3b', '#065f46'],
    views: 7200000, likes: 580000, coins: 210000, favorites: 380000, danmakuCount: 68000,
    uploadDate: '2024-03-16', duration: '23:15', artistId: 'laofanqie', artistName: '老番茄',
    sentimentScore: 87, riskLevel: 'low',
    analysis: {
      sentiment: { praise: 62, discussion: 28, adDislike: 4, attack: 2, sarcasm: 4 },
      timeline: genTimeline(1395, [
        { center: 350, height: 200, spread: 80 },
        { center: 850, height: 250, spread: 70 },
        { center: 1250, height: 220, spread: 75 },
      ]),
      hotspots: [
        { startSecond: 290, endSecond: 430, label: '三年回顾感触', peakDensity: 215 },
        { startSecond: 790, endSecond: 920, label: '游戏评价核心段', peakDensity: 268 },
        { startSecond: 1190, endSecond: 1320, label: '最终定论', peakDensity: 238 },
      ],
      intent: { waterComment: 8, suggestion: 25, rant: 15, urgeUpdate: 38, sponsored: 14 },
      aiSummary: {
        overview: '游戏长期用户视角引发深度共鸣，兼顾批评与肯定的态度获得高可信度评价。',
        keyPoints: [
          '游戏评价核心段引发游戏玩家强烈讨论，两极化评论均很活跃',
          '原神玩家群体认同感强，部分不玩原神的观众也被内容吸引',
          '深度游戏评测风格区别于短评，具备相当强的内容壁垒',
        ],
        riskAlerts: [],
        recommendations: [
          '游戏评测可往"玩家心路历程"纪录片方向发展，差异化竞争',
        ],
        hotMemes: ['三年老玩家的眼泪', '说到心坎了', '太真实了'],
      },
    },
  },
  {
    bvId: 'BV1uv411q7oB',
    title: '【老番茄】我花1个月速通了B站所有游戏区的TOP100，结论是…',
    coverGradient: ['#1e3a5f', '#0f2942'],
    views: 4800000, likes: 385000, coins: 140000, favorites: 260000, danmakuCount: 45000,
    uploadDate: '2024-04-03', duration: '35:40', artistId: 'laofanqie', artistName: '老番茄',
    sentimentScore: 89, riskLevel: 'low',
    analysis: {
      sentiment: { praise: 65, discussion: 26, adDislike: 3, attack: 2, sarcasm: 4 },
      timeline: genTimeline(2140, [
        { center: 500, height: 180, spread: 90 },
        { center: 1200, height: 220, spread: 85 },
        { center: 1900, height: 195, spread: 80 },
      ]),
      hotspots: [
        { startSecond: 420, endSecond: 600, label: '游戏质量分层分析', peakDensity: 195 },
        { startSecond: 1130, endSecond: 1290, label: '隐藏佳作推荐', peakDensity: 238 },
        { startSecond: 1830, endSecond: 2000, label: '最终游戏排行揭晓', peakDensity: 210 },
      ],
      intent: { waterComment: 7, suggestion: 30, rant: 10, urgeUpdate: 42, sponsored: 11 },
      aiSummary: {
        overview: '游戏盘点类内容完播率高，"隐藏佳作推荐"片段带动多款冷门游戏在站内搜索量暴增。',
        keyPoints: [
          '隐藏佳作推荐产生显著带货效应，多款游戏当日搜索量+300%',
          '观众对排行揭晓充满期待，弹幕预测互动活跃',
          '35分钟长视频完播率表现优异，内容吸引力极强',
        ],
        riskAlerts: [],
        recommendations: [
          '可围绕"被低估的好游戏"做成系列，形成稳定受众预期',
        ],
        hotMemes: ['被这个盘点带飞了', '存档必看', 'UP真的懂游戏'],
      },
    },
  },
];

export const artists: Artist[] = [
  {
    id: 'linxiaoqi',
    name: '林小柒',
    initials: '柒',
    avatarColor: 'from-emerald-500 to-teal-600',
    category: '生活 · 旅行 · 美食',
    fans: 25800000,
    totalVideos: 312,
    totalViews: 1580000000,
    latestActivity: '2024-04-05',
    videos: videos.filter(v => v.artistId === 'linxiaoqi'),
  },
  {
    id: 'videohurricane',
    name: '影视飓风',
    initials: '飓',
    avatarColor: 'from-blue-500 to-indigo-600',
    category: '科技 · 影视创作',
    fans: 8600000,
    totalVideos: 186,
    totalViews: 680000000,
    latestActivity: '2024-04-01',
    videos: videos.filter(v => v.artistId === 'videohurricane'),
  },
  {
    id: 'zhuyidan',
    name: '朱一旦',
    initials: '旦',
    avatarColor: 'from-amber-500 to-orange-600',
    category: '剧情 · 段子 · 商业讽刺',
    fans: 12300000,
    totalVideos: 98,
    totalViews: 920000000,
    latestActivity: '2024-04-08',
    videos: videos.filter(v => v.artistId === 'zhuyidan'),
  },
  {
    id: 'laofanqie',
    name: '老番茄',
    initials: '番',
    avatarColor: 'from-red-500 to-rose-600',
    category: '游戏 · 二次元评测',
    fans: 15200000,
    totalVideos: 428,
    totalViews: 1120000000,
    latestActivity: '2024-04-03',
    videos: videos.filter(v => v.artistId === 'laofanqie'),
  },
];

export function getVideoByBvId(bvId: string): Video | undefined {
  return videos.find(v => v.bvId === bvId);
}

export function getArtistById(id: string): Artist | undefined {
  return artists.find(a => a.id === id);
}
