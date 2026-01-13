'use server';

import { DetailedWeather, CODE_MAP } from './weather-utils';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function getWeatherForecast(location = 'new delhi', displayName?: string): Promise<DetailedWeather[] | null> {
  const apiKey = process.env.TOMORROW_API_KEY;
  if (!apiKey) return null;

  const cleanLocation = encodeURIComponent(location);

  const fields = [
    "temperature", "weatherCode", "windSpeed", "windDirection",
    "pressureSurfaceLevel", "humidity", "visibility", "uvIndex",
    "sunriseTime", "sunsetTime", "cloudCover"
  ].join(",");

  const url = `https://api.tomorrow.io/v4/weather/forecast?location=${cleanLocation}&timesteps=1h,1d&units=metric&apikey=${apiKey}&fields=${fields}`;

  try {
    let res = await fetch(url, { next: { revalidate: 3600 } });

    if (res.status === 429) {
      await sleep(1500); 
      res = await fetch(url, { next: { revalidate: 3600 } });
    }

    if (!res.ok) {
      const errText = await res.text();
      console.error(`API Error ${res.status} for ${location}:`, errText);
      return null;
    }

    const data = await res.json();
    const hourlyData = data.timelines.hourly;
    const dailyData = data.timelines.daily;
    const todayValues = dailyData[0]?.values || {}; 
    const { sunriseTime, sunsetTime } = todayValues;

    let finalName: string = displayName || data.location?.name || decodeURIComponent(location);

    if (/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(finalName)) {
        finalName = "Current Location";
    }

    return hourlyData.slice(0, 8).map((item: any) => {
      const v = item.values;
      const time = new Date(item.time);
      
      return {
        locationName: finalName,
        timeLabel: time.toLocaleTimeString('en-US', { hour: 'numeric' }),
        rawTime: item.time,
        temp: Math.round(v.temperature),
        condition: CODE_MAP[v.weatherCode] || 'CLEAR',
        windSpeed: Math.round(v.windSpeed * 3.6),
        windDirection: v.windDirection,
        isDay: time.getHours() > 6 && time.getHours() < 20,
        sunriseTime: sunriseTime || new Date().toISOString(),
        sunsetTime: sunsetTime || new Date().toISOString(),
        pressure: Math.round(v.pressureSurfaceLevel),
        humidity: Math.round(v.humidity),
        visibility: Math.round(v.visibility),
        uvIndex: v.uvIndex || 0,
        cloudCover: v.cloudCover || 0
      };
    });

  } catch (error) {
    console.error("❌ Weather Service Error:", error);
    return null;
  }
}