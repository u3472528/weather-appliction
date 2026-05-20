// ─────────────────────────────────────────────────────────────
//  WeatherApp / src / utils / weatherApi.ts
// ─────────────────────────────────────────────────────────────

import { Ionicons } from '@expo/vector-icons';

// 🔑 Replace with your OpenWeatherMap API key
export const OWM_API_KEY = 'ab23d4d69597c6426abfd528726d8d29';

const BASE = 'https://api.openweathermap.org/data/2.5';
const GEO = 'https://api.openweathermap.org/geo/1.0';

const params = (extra: Record<string, string | number>) =>
  new URLSearchParams({
    appid: OWM_API_KEY,
    units: 'metric',
    ...extra,
  }).toString();

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface WeatherData {
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];

  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };

  wind: {
    speed: number;
  };

  sys: {
    sunrise: number;
    sunset: number;
  };

  timezone: number;
  name: string;

  dt: number;
}

export interface ForecastItem {
  dt: number;

  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };

  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
}

export interface ForecastData {
  list: ForecastItem[];
}

export interface GeocodeResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

// ─────────────────────────────────────────────────────────────
// Current Weather
// ─────────────────────────────────────────────────────────────

export async function fetchCurrentWeather(
  lat: number,
  lon: number
): Promise<WeatherData> {
  const res = await fetch(`${BASE}/weather?${params({ lat, lon })}`
  );

  if (!res.ok) {
    throw new Error(`Weather fetch failed: ${res.status}`);
  }

  return res.json();
}

// ─────────────────────────────────────────────────────────────
// Forecast
// ─────────────────────────────────────────────────────────────

export async function fetchForecast(
  lat: number,
  lon: number
): Promise<ForecastData> {
  const res = await fetch(`${BASE}/forecast?${params({ lat, lon })}`);

  if (!res.ok) {
    throw new Error(`Forecast fetch failed: ${res.status}`);
  }

  return res.json();
}

// ─────────────────────────────────────────────────────────────
// Geocoding
// ─────────────────────────────────────────────────────────────

export async function geocodeCity(cityName: string): Promise<GeocodeResult[]> {
  const res = await fetch(`${GEO}/direct?q=${encodeURIComponent(cityName)}&limit=5&appid=${OWM_API_KEY}`);

  if (!res.ok) {
    throw new Error(`Geocode failed: ${res.status}`);
  }

  return res.json();
}

// ─────────────────────────────────────────────────────────────
// Reverse Geocoding
// ─────────────────────────────────────────────────────────────

export async function reverseGeocode(lat: number,lon: number): Promise<GeocodeResult | null> {
  const res = await fetch(`${GEO}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OWM_API_KEY}`);

  if (!res.ok) {
    throw new Error(
      `Reverse geocode failed: ${res.status}`
    );
  }

  const data = await res.json();

  return data[0] ?? null;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

type IoniconName = keyof typeof Ionicons.glyphMap;

/** Map OWM icon code → Ionicons name */
export function owmIconToIonicon(iconCode: string): IoniconName {
  const map: Record<string, IoniconName> = {
    '01d': 'sunny-outline',
    '01n': 'moon-outline',
    '02d': 'partly-sunny-outline',
    '02n': 'cloudy-night-outline',
    '03d': 'cloud-outline',
    '03n': 'cloud-outline',
    '04d': 'cloudy-outline',
    '04n': 'cloudy-outline',
    '09d': 'rainy-outline',
    '09n': 'rainy-outline',
    '10d': 'rainy-outline',
    '10n': 'rainy-outline',
    '11d': 'thunderstorm-outline',
    '11n': 'thunderstorm-outline',
    '13d': 'snow-outline',
    '13n': 'snow-outline',
    '50d': 'water-outline',
    '50n': 'water-outline',
  };

  return map[iconCode] ?? 'partly-sunny-outline';
}

/** Pick gradient colors by weather condition */
export function conditionToGradient(
  conditionId: number,
  isDay = true
): string[] {
  if (conditionId >= 200 && conditionId < 300) {
    return ['#1a1a2e', '#16213e', '#0f3460'];
  }

  if (conditionId >= 300 && conditionId < 600) {
    return ['#373b44', '#4286f4', '#6ca0dc'];
  }

  if (conditionId >= 600 && conditionId < 700) {
    return ['#e0eafc', '#cfdef3', '#a8bfda'];
  }

  if (conditionId >= 700 && conditionId < 800) {
    return ['#b8b8b8', '#8e9eab', '#6b7a8d'];
  }

  if (conditionId === 800) {
    return isDay
      ? ['#0f2027', '#203a43', '#2c5364']
      : ['#0d0d1a', '#1a1a3e', '#2d2b55'];
  }

  return ['#1c3d5a', '#2980b9', '#6dd5fa'];
}

/** Unix timestamp → "14:00" */
export function formatTime(
  unix: number,
  offsetSec = 0
): string {
  const d = new Date(
    (unix + offsetSec) * 1000
  );

  return d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** Unix timestamp → "Mon" */
export function formatDay(unix: number,offsetSec = 0): string {
  const d = new Date(
    (unix + offsetSec) * 1000
  );

  return d.toLocaleDateString([], {weekday: 'short',});
}

/** Convert m/s → km/h */
export const msToKmh = (ms: number): number => Math.round(ms * 3.6);