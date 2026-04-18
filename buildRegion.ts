import type { RegionData } from "@/data/regions";
import { formatCoordinates, type GeocodeResult } from "@/utils/weatherApi";

/**
 * Build a synthetic RegionData for a city found via geocoding search.
 * Static fields (canals, sensors) use neutral defaults — live weather will
 * override rainfall/temperature/wind via the useLiveWeather hook.
 */
export function buildRegionFromGeocode(g: GeocodeResult): RegionData {
  const id = `geo-${g.id}`;
  return {
    id,
    city: g.name,
    state: g.admin1 ?? g.country,
    coordinates: formatCoordinates(g.latitude, g.longitude),
    canals: [
      { name: `${g.name} Main Channel`, zone: "Zone A", waterLevel: 2.5, capacity: 45, flowRate: 1.2, status: "normal" },
      { name: `${g.name} Secondary Drain`, zone: "Zone B", waterLevel: 2.0, capacity: 38, flowRate: 0.9, status: "normal" },
      { name: `${g.name} Storm Outfall`, zone: "Zone C", waterLevel: 1.8, capacity: 32, flowRate: 0.7, status: "normal" },
    ],
    stats: {
      rainfall: 0,
      rainfallTrend: "Live data",
      waterLevel: 2.1,
      waterLevelTrend: "+0.0m in 6h",
      windSpeed: 0,
      temperature: 0,
      tempTrend: "Stable",
    },
    risk: {
      overall: { level: "low", value: 20 },
      zones: [
        { label: "Central", level: "low", value: 20 },
        { label: "Outskirts", level: "low", value: 15 },
        { label: "Riverside", level: "low", value: 25 },
      ],
    },
    alerts: [],
    sensorCount: 12,
    totalSensors: 12,
    coverageArea: 50,
  };
}
