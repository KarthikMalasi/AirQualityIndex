# 🌬️ AirScope — Air Quality Dashboard

A real-time air quality monitoring dashboard built with React (Vite), Redux Toolkit, React Router, Recharts, and Tailwind CSS.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Live AQI Display** | Circular gauge with color-coded AQI level |
| **6 Pollutants** | PM2.5, PM10, O₃, NO₂, SO₂, CO with status indicators |
| **24h Trend Chart** | Interactive line chart with pollutant toggle |
| **Bar Chart** | Concentration comparison on Details page |
| **City Search** | Debounced city search with dropdown (300ms) |
| **Favorite Cities** | Add/remove favorites, persisted to localStorage |
| **Dark/Light Mode** | OS-aware default, toggled via header button |
| **Auto-Refresh** | Data refreshes every 60 seconds automatically |
| **Lazy Loading** | All pages are lazy-loaded with React.lazy + Suspense |
| **Memoization** | useMemo + useCallback throughout |
| **Error Boundary** | Catches and displays unexpected runtime errors |
| **Error Handling** | API failures fall back to realistic demo data |
| **Responsive** | Works on mobile, tablet, and desktop |

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── AQICard.jsx          # Main AQI circular gauge card
│   ├── AQIChart.jsx         # 24h recharts line chart
│   ├── CitySearch.jsx       # Debounced city search
│   ├── ErrorAlert.jsx       # API error banner
│   ├── ErrorBoundary.jsx    # React error boundary
│   ├── FavoriteCityChip.jsx # Pill chip for quick city switching
│   ├── Header.jsx           # Nav + dark mode toggle
│   ├── PageLoader.jsx       # Lazy load fallback
│   ├── PollutantGrid.jsx    # 6-pollutant card grid
│   └── RefreshBar.jsx       # Countdown + manual refresh
├── hooks/
│   ├── useAirQuality.js     # Auto-refresh + dispatch logic
│   └── useDebounce.js       # Debounce hook
├── pages/
│   ├── Dashboard.jsx        # / — main view
│   ├── Details.jsx          # /details — full analysis
│   ├── Favorites.jsx        # /favorites — city management
│   └── NotFound.jsx         # 404
├── redux/
│   ├── store.js
│   └── slices/
│       ├── airQualitySlice.js   # AQI data + city selection
│       ├── citiesSlice.js       # Favorites (localStorage)
│       └── uiSlice.js           # Dark mode
├── services/
│   └── airQualityService.js # OpenAQ v3 API + mock fallback
├── App.jsx
├── index.css
└── main.jsx
```

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment (optional)

```bash
cp .env.example .env
```

Edit `.env` and add your [OpenAQ API key](https://openaq.org/) for higher rate limits. The app works without a key using realistic demo data.

```
VITE_OPENAQ_API_KEY=your_key_here
```

### 3. Start development server

```bash
npm run dev
```

App runs at `http://localhost:3000`

### 4. Build for production

```bash
npm run build
npm run preview  # Preview production build locally
```

---

## 🌐 Deployment

### Vercel

```bash
npx vercel --prod
```

Or connect your GitHub repo to Vercel and it auto-deploys. The `vercel.json` handles SPA routing.

Set environment variable in Vercel dashboard:
- `VITE_OPENAQ_API_KEY` = your OpenAQ key

### Netlify

```bash
npx netlify deploy --prod --dir=dist
```

Or drag the `dist/` folder to [Netlify Drop](https://app.netlify.com/drop). The `netlify.toml` handles redirects.

---

## 🔑 API Details

The app uses the **OpenAQ v3 API** (free, open data):
- Endpoint: `https://api.openaq.org/v3`
- No key required for basic usage (rate-limited)
- Free API key available at [openaq.org](https://openaq.org/)

**Fallback**: If the API is unavailable or rate-limited, the app automatically generates realistic mock data so the dashboard always renders.

---

## 🏗️ Tech Stack

- **React 18** + **Vite 5**
- **Redux Toolkit** — state management
- **React Router v6** — client-side routing
- **Axios** — HTTP client
- **Recharts** — charts
- **Tailwind CSS v3** — styling
- **DM Sans + Syne + JetBrains Mono** — typography

---

## 📊 AQI Scale Reference

| AQI | Category | Color |
|---|---|---|
| 0–50 | Good | 🟢 Green |
| 51–100 | Moderate | 🟡 Yellow |
| 101–150 | Unhealthy for Sensitive Groups | 🟠 Orange |
| 151–200 | Unhealthy | 🔴 Red |
| 201–300 | Very Unhealthy | 🟣 Purple |
| 301–500 | Hazardous | ⬛ Dark Red |

AQI is computed using the US EPA formula based on PM2.5 concentration.
