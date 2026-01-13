# ☁️ Living Weather

### A Real-Time Atmospheric Simulation Engine

![Project Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Performance](https://img.shields.io/badge/Lighthouse-100-green)

**Living Weather** is not just a dashboard; it is a **physics-based weather experience**. By leveraging GPU acceleration, real-time API data, and a "Time Travel" interface, it turns cold meteorological numbers into an immersive, visceral simulation of the current atmosphere.

---

## 🚀 Key Features

### 🌪️ GPU-Accelerated Physics Engine
- **Custom Particle System:** Rain, snow, and wind are simulated in real-time on an HTML5 Canvas, driven by actual wind speed and direction data.
- **Device-Aware Performance:** Automatically detects mobile devices to throttle particle counts (400 vs 50) and frame rates (60fps vs 30fps), ensuring buttery smooth performance on any hardware.
- **Battery Saver:** The engine intelligently "sleeps" when the user scrolls away or switches tabs to conserve resources.

### ⏳ Time Travel Interface
- **Scrollytelling Forecast:** Don't just read the future; scroll through it. As you move down the page, the entire UI adapts to show the weather for that specific hour in the future.
- **Dynamic Gradients:** The background atmosphere shifts dynamically based on time of day (sunrise/sunset) and weather conditions (storm/clear/snow).

### 🛡️ Bulletproof Data Layer
- **Resilient API Handling:** Built-in retry logic for rate limits (429) and graceful fallbacks for missing data.
- **Smart Geocoding:** Intelligently handles both city names ("Paris") and raw coordinates, ensuring the user always finds their location.
- **Next.js 16 Suspense:** Critical UI components are wrapped in Suspense boundaries to prevent the entire app from blocking during data fetches.

### 🎨 Glassmorphism UI
- **Modern Aesthetic:** A translucent, frosted-glass interface that sits effectively on top of the dynamic background.
- **Astro Graph:** A custom SVG visualization of the sun's trajectory calculated precisely from sunrise/sunset timestamps.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16.1](https://nextjs.org/) (App Router, Server Actions)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/) + HTML5 Canvas API
- **Data Source:** [Tomorrow.io API](https://www.tomorrow.io/) (Weather) + Google Maps (Geocoding)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## ⚡ Getting Started

### Prerequisites

You will need API keys for:
1.  **Tomorrow.io** (Weather Data)
2.  **Google Maps** (Places & Geocoding)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/priyanshuk6395/weather.git](https://github.com/priyanshuk6395/weather.git)
    cd weather
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory:
    ```bash
    TOMORROW_API_KEY=your_tomorrow_io_key
    NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open:** Visit `http://localhost:3000` in your browser.

---

## 📱 Mobile Optimization

This project achieves a **90+ Performance Score** on mobile by:
- **Lazy Loading:** Heavy components like the `WeatherCanvas` and `AtmosphericNoise` are code-split and only loaded after the main content paints.
- **Texture Compression:** Noise textures are generated via SVG filters instead of heavy image files.
- **Touch-Optimized:** All interactive elements have proper touch targets (44px+).

---

## 📂 Project Structure

```bash
├── app/
│   ├── page.tsx            # Main Server Component (Data Fetching)
│   ├── layout.tsx          # Root Layout & SEO Metadata
│   ├── global-error.tsx    # "Nuclear" Error Boundary
│   └── not-found.tsx       # 404 Page
├── components/
│   ├── weather-canvas.tsx  # The Physics Engine
│   ├── time-travel-layout.tsx # Scrollytelling Logic
│   ├── search-box.tsx      # Google Places Autocomplete
│   ├── detail-grid.tsx      
│   ├── atmospheric-noise.tsx
│   └── astro-graph.tsx
└── lib/
    ├── weather-service.ts  # Robust API Fetcher
    └── weather-utils.tsx 
