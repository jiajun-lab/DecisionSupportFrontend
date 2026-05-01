# MCN 内容决策平台 — Frontend

面向 MCN 机构运营人员的视频舆情分析仪表盘，支持查看旗下艺人的所有视频，并对每条视频的情感分布、弹幕爆点、评论意图及 AI 分析报告进行可视化展示。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite 5 |
| 样式 | Tailwind CSS 3 |
| 图表 | Apache ECharts 5 + echarts-for-react |
| 路由 | React Router v6 |
| 图标 | Lucide React |

## 快速开始

### 1. 环境要求

- Node.js 18+
- 后端服务运行在 `http://localhost:8000`（见 `../DecisionSupportSystem`）

### 2. 安装依赖

```bash
cd DecisionSupportFrontend
npm install
```

### 3. 启动开发服务器

```bash
npm run dev      # 开发服务器：http://localhost:5173
```

其他命令：
```bash
npm run build    # 生产构建
npm run preview  # 预览生产构建
```

## 页面结构

```
/                    MCN 总览仪表盘
/artist/:id          艺人视频列表
/video/:bvId         单视频分析详情
/monitor             实时监控（预留）
```

### 总览仪表盘 `/`

- 全局统计：旗下艺人数、总粉丝数、视频作品数、累计播放量
- 舆情预警 Banner：自动检测高风险视频并提示
- 艺人卡片：每位艺人的粉丝/播放/健康度均分及最新视频状态

### 艺人视频列表 `/artist/:id`

- 艺人 Profile 头部展示核心数据
- 按风险等级筛选（健康 / 关注 / 预警）
- 按播放量、健康度、发布日期排序
- 视频卡片：封面、标题、舆情健康度进度条、6 项核心数据指标

### 视频分析详情 `/video/:bvId`

包含四个分析模块：

| 模块 | 说明 |
|------|------|
| 情感分布雷达 | 五维情感占比（赞美共鸣、剧情讨论、广告反感、恶意攻击、反讽） |
| 评论意图分布 | 五类意图横向柱状图（催更、建议、吐槽、水贴、商业好评） |
| 弹幕爆点时间线 | 全程弹幕密度折线图，高亮标注峰值爆点区间 |
| AI 智能分析报告 | 综合评述、核心洞察、风险预警、运营建议、热梗追踪 |

## 项目结构

```
src/
├── types.ts                  # 全局 TypeScript 类型定义
├── api/
│   └── client.ts             # API 客户端（封装后端接口调用）
├── hooks/
│   ├── useArtists.ts         # 艺人数据获取 Hook
│   └── useVideos.ts          # 视频数据获取 Hooks
├── App.tsx                   # 路由配置
├── main.tsx                  # 入口
├── index.css                 # 全局样式 & Tailwind 指令
├── components/
│   ├── Sidebar.tsx           # 左侧固定导航栏
│   ├── VideoCard.tsx         # 视频卡片组件
│   ├── AISummary.tsx         # AI 报告展示组件
│   └── charts/
│       ├── SentimentRadar.tsx    # 情感分布雷达图
│       ├── HotspotTimeline.tsx   # 弹幕爆点时间线图
│       └── IntentChart.tsx       # 评论意图分布图
└── pages/
    ├── Dashboard.tsx         # MCN 总览页
    ├── ArtistVideos.tsx      # 艺人视频列表页
    └── VideoAnalysis.tsx     # 视频分析详情页
```

## API 对接

前端已通过自定义 Hooks 对接后端 API：

| Hook | 功能 | 后端接口 |
|------|------|----------|
| `useArtists()` | 获取所有艺人列表 | `GET /api/v1/artists` |
| `useArtist(id)` | 获取单个艺人详情 | `GET /api/v1/artists/:id` |
| `useVideos()` | 获取视频列表（支持筛选） | `GET /api/v1/videos` |
| `useVideo(bvId)` | 获取视频详情 | `GET /api/v1/video/:bvId` |
| `useVideoAnalysis(bvId)` | 获取视频分析结果 | `GET /api/v1/analysis/:bvId` |
| `crawlVideo(bvId)` | 触发视频爬虫 | `POST /api/v1/crawl/:bvId` |
| `analyzeVideo(bvId)` | 触发 NLP 分析 | `POST /api/v1/analyze/:bvId` |

后端服务地址：`http://localhost:8000`，详见 `../DecisionSupportSystem`。

## 开发指南

### 添加新 API 调用

在 `src/api/client.ts` 中添加：

```typescript
export async function getComments(bvId: string) {
  const res = await fetch(`${API_BASE}/comments/${bvId}`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
}
```

### 添加新 Hook

在 `src/hooks/` 目录下创建（参考现有 hooks）：

```typescript
export function useComments(bvId: string) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getComments(bvId)
      .then(setComments)
      .finally(() => setLoading(false));
  }, [bvId]);

  return { comments, loading };
}
```
