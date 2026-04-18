/**
 * Weather API utility — uses Open-Meteo (free, no API key required).
 * Docs: https://open-meteo.com/en/docs
 *
 * Returns the metrics our risk engine consumes:
 *  - rainfall (mm in last 24h)
 *  - temperature (°C)
 *  - windSpeed (km/h)
 */

export interface LiveWeather {
  rainfall: number;     // mm, last 24h cumulative
  temperature: number;  // °C, current
  windSpeed: number;    // km/h, current
  fetchedAt: string;    // ISO timestamp
}

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number;
    wind_speed_10m?: number;
  };
  daily?: {
    precipitation_sum?: number[];
  };
}

/** Fetch live weather for a coordinate pair using Open-Meteo. */
export async function getWeather(latitude: number, longitude: number): Promise<LiveWeather> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,wind_speed_10m` +
    `&daily=precipitation_sum` +
    `&wind_speed_unit=kmh&timezone=auto&forecast_days=1`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather API failed: ${res.status}`);
  const data: OpenMeteoResponse = await res.json();

  return {
    rainfall: data.daily?.precipitation_sum?.[0] ?? 0,
    temperature: data.current?.temperature_2m ?? 0,
    windSpeed: data.current?.wind_speed_10m ?? 0,
    fetchedAt: new Date().toISOString(),
  };
}

/** Parse a "19.07°N, 72.87°E" coordinate string into [lat, lon]. */
export function parseCoordinates(coords: string): [number, number] {
  const match = coords.match(/([\d.]+)°([NS]),\s*([\d.]+)°([EW])/);
  if (!match) return [0, 0];
  const lat = parseFloat(match[1]) * (match[2] === "S" ? -1 : 1);
  const lon = parseFloat(match[3]) * (match[4] === "W" ? -1 : 1);
  return [lat, lon];
}

/** Format [lat, lon] back into "19.07°N, 72.87°E" string. */
export function formatCoordinates(lat: number, lon: number): string {
  const latStr = `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? "N" : "S"}`;
  const lonStr = `${Math.abs(lon).toFixed(2)}°${lon >= 0 ? "E" : "W"}`;
  return `${latStr}, ${lonStr}`;
}

export interface GeocodeResult {
  id: number;
  name: string;
  country: string;
  admin1?: string; // state/region
  latitude: number;
  longitude: number;
}

interface GeocodeResponse {
  results?: Array<{
    id: number;
    name: string;
    country: string;
    admin1?: string;
    latitude: number;
    longitude: number;
  }>;
}

/** Search for cities worldwide via Open-Meteo geocoding. */
export async function searchCities(query: string, count = 8): Promise<GeocodeResult[]> {
  if (!query.trim()) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=${count}&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const data: GeocodeResponse = await res.json();
  return (data.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}
