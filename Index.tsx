import { useState, useMemo } from "react";
import { Droplets, Gauge, CloudRain, Wind, Thermometer, Activity, Radio, MapPin, Loader2, Wifi } from "lucide-react";
import RiskGauge from "@/components/RiskGauge";
import WeatherAlerts from "@/components/WeatherAlerts";
import CanalStatusTable from "@/components/CanalStatusTable";
import WaterLevelChart from "@/components/WaterLevelChart";
import StatCard from "@/components/StatCard";
import RegionSelector from "@/components/RegionSelector";
import RiskBreakdown from "@/components/RiskBreakdown";
import { regions } from "@/data/regions";
import { computeRisk, generateAlerts, parseWaterRiseRate, classifyCanalStatus } from "@/lib/riskEngine";
import { useLiveWeather } from "@/hooks/useLiveWeather";

const Index = () => {
  const [selectedRegionId, setSelectedRegionId] = useState("mumbai");
  const region = regions.find((r) => r.id === selectedRegionId) ?? regions[0];
  const lastUpdated = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  // === LIVE WEATHER (Open-Meteo) — overrides static stats when available ===
  const { data: live, loading: liveLoading, error: liveError } = useLiveWeather(region.coordinates);

  // Merge live weather over static region stats (live takes priority)
  const effectiveStats = useMemo(() => ({
    rainfall: live?.rainfall ?? region.stats.rainfall,
    windSpeed: live?.windSpeed ?? region.stats.windSpeed,
    temperature: live?.temperature ?? region.stats.temperature,
  }), [live, region]);

  // === COMPUTED RISK & ALERTS (engine-driven, not hardcoded) ===
  const waterRiseRate = parseWaterRiseRate(region.stats.waterLevelTrend);
  const computedCanals = region.canals.map((c) => ({
    ...c,
    status: classifyCanalStatus(c.capacity),
  }));
  const risk = useMemo(() => computeRisk({
    rainfall: effectiveStats.rainfall,
    waterRiseRate,
    windSpeed: effectiveStats.windSpeed,
    temperature: effectiveStats.temperature,
    canals: region.canals,
  }), [region, effectiveStats, waterRiseRate]);
  const alerts = useMemo(() => generateAlerts({
    rainfall: effectiveStats.rainfall,
    waterRiseRate,
    windSpeed: effectiveStats.windSpeed,
    temperature: effectiveStats.temperature,
    canals: region.canals,
  }, region.city), [region, effectiveStats, waterRiseRate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Droplets className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-none">FloodWatch</h1>
              <p className="text-[11px] text-muted-foreground tracking-wide uppercase">Urban Canal Monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <RegionSelector selectedRegion={region} onRegionChange={setSelectedRegionId} />
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-risk-low" />
              </span>
              <span className="text-xs font-medium text-muted-foreground">Live — {lastUpdated}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Location Banner */}
        <div className="flex items-center gap-3 opacity-0 animate-fade-up" style={{ animationDelay: "50ms" }}>
          <MapPin className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <h2 className="text-lg font-bold">{region.city}, {region.state}</h2>
            <p className="text-sm text-muted-foreground">{region.canals.length} waterways monitored · {region.coverageArea} km² coverage</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            {liveLoading ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" /><span className="text-muted-foreground">Fetching live weather…</span></>
            ) : liveError ? (
              <span className="text-muted-foreground">Live unavailable · using static data</span>
            ) : (
              <><Wifi className="w-3.5 h-3.5 text-risk-low" /><span className="font-medium text-risk-low">Live weather · Open-Meteo</span></>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={CloudRain} label="Rainfall (24h)" value={effectiveStats.rainfall.toFixed(1)} unit="mm" trend={{ value: live ? "Live" : region.stats.rainfallTrend, positive: false }} delay={100} />
          <StatCard icon={Gauge} label="Avg Water Level" value={region.stats.waterLevel.toFixed(2)} unit="m" trend={{ value: region.stats.waterLevelTrend, positive: false }} delay={160} />
          <StatCard icon={Wind} label="Wind Speed" value={effectiveStats.windSpeed.toFixed(0)} unit="km/h" trend={live ? { value: "Live", positive: false } : undefined} delay={220} />
          <StatCard icon={Thermometer} label="Temperature" value={effectiveStats.temperature.toFixed(1)} unit="°C" trend={{ value: live ? "Live" : region.stats.tempTrend, positive: region.stats.tempTrend === "Dropping" }} delay={280} />
        </section>

        {/* Risk Overview + Alerts */}
        <section className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 bg-card rounded-xl border shadow-sm p-6 opacity-0 animate-fade-up" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-semibold">Flood Risk Assessment</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <RiskGauge level={risk.overall.level} value={risk.overall.value} label="Overall Risk" />
              {risk.zones.map((zone) => (
                <RiskGauge key={zone.label} level={zone.level} value={zone.value} label={zone.label} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {/* Risk Breakdown — shows HOW scores are computed */}
            <div className="bg-card rounded-xl border shadow-sm p-6 opacity-0 animate-fade-up" style={{ animationDelay: "340ms" }}>
              <RiskBreakdown breakdown={risk.breakdown} />
            </div>

            {/* Weather Alerts — auto-generated from thresholds */}
            <div className="bg-card rounded-xl border shadow-sm p-6 opacity-0 animate-fade-up" style={{ animationDelay: "380ms" }}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-risk-severe" />
                  <h2 className="font-semibold">Weather Alerts</h2>
                </div>
                <span className="text-xs font-medium bg-risk-severe/10 text-risk-severe px-2 py-0.5 rounded-full">{alerts.length} Active</span>
              </div>
              <WeatherAlerts alerts={alerts} />
            </div>
          </div>
        </section>

        {/* Water Level Chart */}
        <section className="bg-card rounded-xl border shadow-sm p-6 opacity-0 animate-fade-up" style={{ animationDelay: "460ms" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold">Water Level Trend — {region.canals[0]?.name ?? "Primary Canal"}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Observed levels & 10-hour forecast</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-water rounded" /> Observed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-water-accent rounded border-dashed" style={{ borderTop: "2px dashed hsl(173,58%,39%)", height: 0 }} /> Forecast
              </span>
            </div>
          </div>
          <WaterLevelChart />
        </section>

        {/* Canal Status */}
        <section className="bg-card rounded-xl border shadow-sm p-6 opacity-0 animate-fade-up" style={{ animationDelay: "540ms" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold">Canal Status Monitor</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Real-time levels across all monitored waterways</p>
            </div>
            <span className="text-xs text-muted-foreground font-mono">Auto-refresh 30s</span>
          </div>
          <CanalStatusTable canals={computedCanals} />
        </section>

        {/* Info Cards */}
        <section className="grid sm:grid-cols-3 gap-4 opacity-0 animate-fade-up" style={{ animationDelay: "620ms" }}>
          <div className="bg-card rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold text-sm mb-2">Emergency Contacts</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>Flood Hotline: <span className="font-mono font-medium text-foreground">1-800-FLOOD</span></li>
              <li>NDRF Control: <span className="font-mono font-medium text-foreground">011-24363260</span></li>
              <li>Emergency Services: <span className="font-mono font-medium text-foreground">112</span></li>
            </ul>
          </div>
          <div className="bg-card rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold text-sm mb-2">Preparedness Tips</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
              <li>Know your evacuation route</li>
              <li>Keep sandbags accessible</li>
              <li>Move valuables above flood level</li>
              <li>Monitor official alerts regularly</li>
            </ul>
          </div>
          <div className="bg-card rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold text-sm mb-2">Sensor Network — {region.city}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between"><span>Active sensors</span><span className="font-mono text-foreground">{region.sensorCount} / {region.totalSensors}</span></div>
              <div className="flex justify-between"><span>Update frequency</span><span className="font-mono text-foreground">30s</span></div>
              <div className="flex justify-between"><span>Data accuracy</span><span className="font-mono text-foreground">±0.02m</span></div>
              <div className="flex justify-between"><span>Coverage area</span><span className="font-mono text-foreground">{region.coverageArea} km²</span></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© 2026 FloodWatch — Urban Canal Monitoring System</span>
          <span>Data sources: IMD, CWC, NDMA, State Flood Control Rooms</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
