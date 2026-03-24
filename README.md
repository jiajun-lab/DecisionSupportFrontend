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

```bash
npm install
npm run dev      # 开发服务器：http://localhost:5173
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
├── mockData.ts               # Mock 数据（艺人 + 视频 + 分析数据）
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

## 对接后端

当前所有数据来自 `src/mockData.ts`。后续对接后端时，替换以下逻辑：

- `getArtistById(id)` → `GET /api/v1/artists/:id`
- `getVideoByBvId(bvId)` → `GET /api/v1/video/:bvId`
- 视频分析数据 → 后端 NLP 模型推理结果（情感分类、意图识别、Qwen 摘要）

后端服务地址见 `../DecisionSupportSystem`，默认运行在 `http://localhost:8000`。
