// lib/weather-utils.ts

// 1. Move Interfaces here
export interface WeatherSnapshot {
  timeLabel: string;
  rawTime: string;
  temp: number;
  condition: string;
  windSpeed: number;
  windDirection: number;
  isDay: boolean;
}

export interface DetailedWeather extends WeatherSnapshot {
  locationName: string;
  sunriseTime: string;
  sunsetTime: string;
  pressure: number;
  humidity: number;
  visibility: number;
  uvIndex: number;
  cloudCover: number;
}

// 2. Move Logic Helpers here
export function getLifestyleTips(w: DetailedWeather) {
  return [
    {
      label: 'Car Washing',
      value: w.condition === 'RAIN' || w.condition === 'STORM' ? 'Not Suitable' : 'Suitable',
      icon: 'car',
      color: w.condition === 'RAIN' || w.condition === 'STORM' ? 'text-red-400' : 'text-green-400'
    },
    {
      label: 'Outdoor Exercise',
      value: w.uvIndex > 7 ? 'Avoid (High UV)' : (w.temp > 30 ? 'Heat Warning' : 'Great conditions'),
      icon: 'activity',
      color: w.uvIndex > 7 || w.temp > 30 ? 'text-orange-400' : 'text-green-400'
    },
    {
      label: 'Mosquitoes',
      value: w.humidity > 70 && w.temp > 20 ? 'High Activity' : 'Low Activity',
      icon: 'bug',
      color: w.humidity > 70 && w.temp > 20 ? 'text-red-400' : 'text-green-400'
    },
  ];
}

// 3. Move Code Map here
export const CODE_MAP: Record<number, string> = {
  1000: 'CLEAR', 1100: 'CLEAR',
  1101: 'CLOUDY', 1102: 'CLOUDY', 1001: 'CLOUDY',
  2000: 'FOG', 2100: 'FOG',
  4000: 'RAIN', 4001: 'RAIN', 4200: 'RAIN', 4201: 'STORM',
  5000: 'SNOW', 5001: 'SNOW', 5100: 'SNOW', 5101: 'SNOW',
  8000: 'STORM',
};