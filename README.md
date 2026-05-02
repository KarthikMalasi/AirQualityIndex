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
| **Dark/Light Mode** | OS-aware default, toggled via header button |
| **Auto-Refresh** | Data refreshes every 60 seconds automatically |
| **Lazy Loading** | All pages are lazy-loaded with React.lazy + Suspense |
| **Memoization** | useMemo + useCallback throughout |
| **Error Boundary** | Catches and displays unexpected runtime errors |
| **Error Handling** | API failures fall back to realistic demo data |
| **Responsive** | Works on mobile, tablet, and desktop |


## 🔑 API Details

The app uses the **OpenAQ v3 API** (free, open data):
- Endpoint: `https://api.openaq.org/v3`
- No key required for basic usage (rate-limited)
- Free API key available at [openaq.org](https://openaq.org/)

**Fallback**: If the API is unavailable or rate-limited, the app automatically generates realistic mock data so the dashboard always renders.


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
