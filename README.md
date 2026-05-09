# MCN Content Decision Platform — Frontend

A video sentiment analysis dashboard for MCN agency operators, providing at-a-glance views of all managed creators' videos with sentiment distribution, danmaku hotspot detection, comment intent analysis, and AI-generated reports.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| Charts | Apache ECharts 5 + echarts-for-react |
| Routing | React Router v6 |
| Icons | Lucide React |
| QR Code | qrcode.react |

---

## Quick Start

**Requirements:** Node.js 18+, backend running at `http://localhost:8000`

```bash
cd DecisionSupportFrontend
npm install
npm run dev      # Dev server: http://localhost:5173
npm run build    # Production build
npm run preview  # Preview production build
```

---

## Pages

```
/                    MCN Overview Dashboard
/artist/:id          Artist Video List
/video/:bvId         Video Analysis Detail
/monitor             Real-time Monitor (reserved)
```

### Dashboard `/`

- **Global stats bar**: Total artists, total fans, total videos, total views
- **Risk alert banner**: Auto-detected when any video is High risk
- **Bilibili login reminder**: Shown when not authenticated
- **Artist cards** (grid):
  - Avatar (gradient color), name, category
  - Fans / total views / average sentiment score (color-coded: ≥80 green, ≥60 yellow, <60 red)
  - High-risk video count badge
  - Refresh button (incremental update) / Delete button
- **Register Artist** modal: enter Bilibili UID to auto-crawl
- **Bilibili Admin Login** modal: QR-code or Cookie tab

### Artist Videos `/artist/:id`

- Artist profile header: avatar, name, category, fans, total views, likes, average sentiment score
- **Filter by risk level**: All / Healthy (low) / Monitor (medium) / Alert (high)
- **Sort by**: Upload date (newest) / Views (highest) / Sentiment score (best)
- **Video cards** (grid):
  - Title, sentiment score progress bar (color-coded)
  - 6 stats: Views, Likes, Coins, Favorites, Danmaku count, Duration
  - Risk level badge (color-coded)
  - Click → Video Analysis page

### Video Analysis `/video/:bvId`

- Breadcrumb navigation + video header with 6 key stats
- Sentiment score (large, color-coded) + Risk level badge
- **Analyze** button: triggers NLP pipeline; frontend polls for LLM summary update

**Four analysis panels:**

| Panel | Chart Type | Data |
|-------|-----------|------|
| **Sentiment Distribution** | ECharts Radar (5-axis) | praise / discussion / adDislike / attack / sarcasm percentages |
| **Comment Intent Distribution** | ECharts Horizontal Bar | urgeUpdate / suggestion / rant / waterComment / sponsored percentages |
| **Danmaku Hotspot Timeline** | ECharts Line + MarkArea | Danmaku density per second; highlighted hotspot intervals with TextRank labels |
| **AI Smart Analysis Report** | Structured text | Overview, Key Insights, Risk Alerts, Recommendations, Trending Phrases |

---

## Bilibili Login Flow

**QR Code tab:**
1. Click "Get QR Code" → backend calls Bilibili OAuth API
2. Display QR code (via `qrcode.react`)
3. Poll `/auth/bilibili/qrcode/status` every 2s
4. Status: `pending` → `scanned` → `confirmed` → reload page
5. Auto-expire after 180s with retry option

**Cookie tab:**
- Paste cookie string from browser DevTools (`SESSDATA=...`)
- Backend validates + stores; reload on success

---

## Custom Hooks → API Mapping

| Hook | API Endpoint |
|------|-------------|
| `useArtists()` | `GET /api/v1/artists` |
| `useArtist(id)` | `GET /api/v1/artists/:id` |
| `useVideos(filters)` | `GET /api/v1/videos` |
| `useVideo(bvId)` | `GET /api/v1/video/:bvId` |
| `useVideoAnalysis(bvId)` | `GET /api/v1/analysis/:bvId` (polls for LLM update) |
| `useBilibiliAuth()` | `GET/POST/DELETE /api/v1/auth/bilibili/*` |
| `crawlVideo(bvId)` | `POST /api/v1/crawl/:bvId` |
| `analyzeVideo(bvId)` | `POST /api/v1/analyze/:bvId` |
| `refreshArtist(id)` | `POST /api/v1/artists/:id/refresh` |

---

## Project Structure

```
src/
├── types.ts                      # Global TypeScript type definitions
├── api/
│   └── client.ts                 # API client (all backend calls)
├── hooks/
│   ├── useArtists.ts             # Artist data hooks
│   ├── useVideos.ts              # Video data hooks
│   ├── useBilibiliAuth.ts        # Bilibili QR/cookie auth + polling
│   └── useVideoAnalysis.ts       # Analysis fetch + LLM polling
├── components/
│   ├── Sidebar.tsx               # Fixed left navigation
│   ├── VideoCard.tsx             # Video card with sentiment bar
│   ├── AISummary.tsx             # AI report display (overview / insights / alerts / recommendations)
│   ├── BilibiliLoginModal.tsx    # QR code + cookie login modal
│   └── charts/
│       ├── SentimentRadar.tsx    # ECharts 5-axis radar chart
│       ├── HotspotTimeline.tsx   # ECharts line chart with hotspot mark areas & pins
│       └── IntentChart.tsx       # ECharts horizontal bar chart
├── pages/
│   ├── Dashboard.tsx             # MCN overview page
│   ├── ArtistVideos.tsx          # Artist video list + filters
│   └── VideoAnalysis.tsx         # Full video analysis page
├── App.tsx                       # Route configuration
└── main.tsx                      # Entry point
```

---

## Backend

Backend service: `../DecisionSupportSystem` — FastAPI running at `http://localhost:8000`

See backend README for full API documentation, NLP pipeline details, and BERT model training.
