export interface RegionData {
  id: string;
  city: string;
  state: string;
  coordinates: string;
  canals: {
    name: string;
    zone: string;
    waterLevel: number;
    capacity: number;
    flowRate: number;
    status: "normal" | "elevated" | "critical";
  }[];
  stats: {
    rainfall: number;
    rainfallTrend: string;
    waterLevel: number;
    waterLevelTrend: string;
    windSpeed: number;
    temperature: number;
    tempTrend: string;
  };
  risk: {
    overall: { level: "low" | "moderate" | "high" | "severe" | "extreme"; value: number };
    zones: { label: string; level: "low" | "moderate" | "high" | "severe" | "extreme"; value: number }[];
  };
  alerts: {
    id: string;
    type: "rain" | "storm" | "heat" | "wind" | "flood";
    severity: "warning" | "watch" | "advisory";
    title: string;
    description: string;
    time: string;
  }[];
  sensorCount: number;
  totalSensors: number;
  coverageArea: number;
}

export const regions: RegionData[] = [
  {
    id: "mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    coordinates: "19.07°N, 72.87°E",
    canals: [
      { name: "Mithi River Canal", zone: "Zone A", waterLevel: 4.7, capacity: 87, flowRate: 3.2, status: "critical" },
      { name: "Mahim Creek", zone: "Zone B", waterLevel: 3.9, capacity: 71, flowRate: 2.1, status: "elevated" },
      { name: "Poisar Nallah", zone: "Zone C", waterLevel: 2.8, capacity: 48, flowRate: 1.4, status: "normal" },
      { name: "Dahisar Nallah", zone: "Zone A", waterLevel: 4.1, capacity: 78, flowRate: 2.8, status: "elevated" },
      { name: "Oshiwara River", zone: "Zone D", waterLevel: 4.9, capacity: 91, flowRate: 3.6, status: "critical" },
      { name: "Vakola Nallah", zone: "Zone B", waterLevel: 3.2, capacity: 62, flowRate: 1.8, status: "normal" },
    ],
    stats: { rainfall: 52.4, rainfallTrend: "+18mm vs avg", waterLevel: 4.12, waterLevelTrend: "+0.8m in 6h", windSpeed: 38, temperature: 29.1, tempTrend: "Rising" },
    risk: {
      overall: { level: "severe", value: 82 },
      zones: [
        { label: "Mithi Basin", level: "severe", value: 87 },
        { label: "Western Suburb", level: "high", value: 71 },
        { label: "Harbour Line", level: "moderate", value: 48 },
      ],
    },
    alerts: [
      { id: "1", type: "rain", severity: "warning", title: "Heavy Rainfall Warning", description: "Expected 65mm in next 6 hours. Mithi River overflow risk critical.", time: "5 min ago" },
      { id: "2", type: "flood", severity: "watch", title: "Flood Watch — Mithi River", description: "Water levels at 87% capacity. Low-lying areas of Kurla & Sion at risk.", time: "12 min ago" },
      { id: "3", type: "storm", severity: "warning", title: "Cyclonic Storm Alert", description: "Depression over Arabian Sea intensifying. Landfall expected within 48h.", time: "1 hr ago" },
      { id: "4", type: "wind", severity: "advisory", title: "High Wind Advisory", description: "Coastal gusts up to 75 km/h. Marine Drive & seafront areas affected.", time: "2 hrs ago" },
    ],
    sensorCount: 68,
    totalSensors: 74,
    coverageArea: 28.6,
  },
  {
    id: "chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    coordinates: "13.08°N, 80.27°E",
    canals: [
      { name: "Buckingham Canal", zone: "Zone A", waterLevel: 3.8, capacity: 73, flowRate: 2.4, status: "elevated" },
      { name: "Adyar River", zone: "Zone B", waterLevel: 4.3, capacity: 82, flowRate: 3.0, status: "critical" },
      { name: "Cooum River", zone: "Zone C", waterLevel: 3.1, capacity: 56, flowRate: 1.7, status: "normal" },
      { name: "Otteri Nullah", zone: "Zone A", waterLevel: 4.6, capacity: 88, flowRate: 3.4, status: "critical" },
      { name: "Virugambakkam Canal", zone: "Zone D", waterLevel: 2.9, capacity: 51, flowRate: 1.5, status: "normal" },
      { name: "Mambalam Canal", zone: "Zone B", waterLevel: 3.7, capacity: 68, flowRate: 2.0, status: "elevated" },
    ],
    stats: { rainfall: 44.8, rainfallTrend: "+14mm vs avg", waterLevel: 3.73, waterLevelTrend: "+0.5m in 6h", windSpeed: 32, temperature: 31.5, tempTrend: "Stable" },
    risk: {
      overall: { level: "high", value: 72 },
      zones: [
        { label: "Adyar Basin", level: "severe", value: 82 },
        { label: "North Chennai", level: "high", value: 68 },
        { label: "T. Nagar Area", level: "moderate", value: 51 },
      ],
    },
    alerts: [
      { id: "1", type: "rain", severity: "warning", title: "NE Monsoon Rainfall Warning", description: "Intense spells expected. 50mm+ in next 8 hours across the city.", time: "8 min ago" },
      { id: "2", type: "flood", severity: "watch", title: "Flood Watch — Adyar River", description: "Water levels approaching danger mark. Saidapet bridge on alert.", time: "25 min ago" },
      { id: "3", type: "heat", severity: "advisory", title: "Heat Advisory", description: "Humidity index above 42°C. Stay hydrated and avoid direct sun.", time: "3 hrs ago" },
    ],
    sensorCount: 52,
    totalSensors: 58,
    coverageArea: 18.4,
  },
  {
    id: "kolkata",
    city: "Kolkata",
    state: "West Bengal",
    coordinates: "22.57°N, 88.36°E",
    canals: [
      { name: "Tolly's Nullah", zone: "Zone A", waterLevel: 3.5, capacity: 66, flowRate: 2.0, status: "elevated" },
      { name: "Circular Canal", zone: "Zone B", waterLevel: 2.6, capacity: 44, flowRate: 1.2, status: "normal" },
      { name: "Bagjola Canal", zone: "Zone C", waterLevel: 4.2, capacity: 80, flowRate: 2.9, status: "critical" },
      { name: "Keshtopur Canal", zone: "Zone A", waterLevel: 3.8, capacity: 72, flowRate: 2.3, status: "elevated" },
      { name: "Churial Canal", zone: "Zone D", waterLevel: 2.4, capacity: 40, flowRate: 1.0, status: "normal" },
      { name: "Belgachhia Canal", zone: "Zone B", waterLevel: 3.3, capacity: 60, flowRate: 1.9, status: "normal" },
    ],
    stats: { rainfall: 34.6, rainfallTrend: "+8mm vs avg", waterLevel: 3.30, waterLevelTrend: "+0.3m in 6h", windSpeed: 28, temperature: 33.2, tempTrend: "Dropping" },
    risk: {
      overall: { level: "high", value: 65 },
      zones: [
        { label: "Bagjola Basin", level: "severe", value: 80 },
        { label: "South Kolkata", level: "high", value: 66 },
        { label: "Salt Lake Area", level: "moderate", value: 44 },
      ],
    },
    alerts: [
      { id: "1", type: "rain", severity: "watch", title: "Rainfall Watch", description: "Moderate to heavy rainfall expected through the evening. 30mm forecast.", time: "15 min ago" },
      { id: "2", type: "flood", severity: "advisory", title: "Waterlogging Advisory", description: "Low-lying areas in Behala & Jadavpur may experience waterlogging.", time: "45 min ago" },
    ],
    sensorCount: 41,
    totalSensors: 46,
    coverageArea: 14.2,
  },
  {
    id: "delhi",
    city: "New Delhi",
    state: "Delhi NCR",
    coordinates: "28.61°N, 77.21°E",
    canals: [
      { name: "Najafgarh Drain", zone: "Zone A", waterLevel: 4.8, capacity: 89, flowRate: 3.5, status: "critical" },
      { name: "Supplementary Drain", zone: "Zone B", waterLevel: 3.6, capacity: 67, flowRate: 2.1, status: "elevated" },
      { name: "Barapullah Nallah", zone: "Zone C", waterLevel: 4.0, capacity: 76, flowRate: 2.6, status: "elevated" },
      { name: "Kushak Nallah", zone: "Zone A", waterLevel: 2.7, capacity: 46, flowRate: 1.3, status: "normal" },
      { name: "Maharani Bagh Drain", zone: "Zone D", waterLevel: 3.4, capacity: 63, flowRate: 1.9, status: "normal" },
      { name: "Sarita Vihar Canal", zone: "Zone B", waterLevel: 4.5, capacity: 85, flowRate: 3.1, status: "critical" },
    ],
    stats: { rainfall: 61.3, rainfallTrend: "+22mm vs avg", waterLevel: 3.83, waterLevelTrend: "+0.9m in 6h", windSpeed: 45, temperature: 27.8, tempTrend: "Dropping" },
    risk: {
      overall: { level: "severe", value: 79 },
      zones: [
        { label: "Yamuna Floodplain", level: "extreme", value: 92 },
        { label: "South Delhi", level: "high", value: 67 },
        { label: "Dwarka Zone", level: "moderate", value: 46 },
      ],
    },
    alerts: [
      { id: "1", type: "flood", severity: "warning", title: "Yamuna Flood Warning", description: "Water level at Yamuna crossed 206.5m. Old Railway Bridge area on high alert.", time: "3 min ago" },
      { id: "2", type: "rain", severity: "warning", title: "Extreme Rainfall Alert", description: "IMD issues red alert. 80mm+ expected in next 12 hours across NCR.", time: "20 min ago" },
      { id: "3", type: "wind", severity: "advisory", title: "Gusty Wind Advisory", description: "Wind gusts up to 55 km/h with thunderstorms. Loose structures at risk.", time: "1 hr ago" },
      { id: "4", type: "storm", severity: "watch", title: "Thunderstorm Watch", description: "Multiple cells developing over NCR. Hail possible in isolated pockets.", time: "2 hrs ago" },
    ],
    sensorCount: 73,
    totalSensors: 80,
    coverageArea: 32.1,
  },
  {
    id: "bangalore",
    city: "Bengaluru",
    state: "Karnataka",
    coordinates: "12.97°N, 77.59°E",
    canals: [
      { name: "Vrishabhavathi Valley", zone: "Zone A", waterLevel: 3.4, capacity: 64, flowRate: 1.9, status: "normal" },
      { name: "Koramangala Canal", zone: "Zone B", waterLevel: 4.1, capacity: 79, flowRate: 2.7, status: "elevated" },
      { name: "Challaghatta Canal", zone: "Zone C", waterLevel: 2.5, capacity: 42, flowRate: 1.1, status: "normal" },
      { name: "Hebbal Valley", zone: "Zone A", waterLevel: 3.9, capacity: 74, flowRate: 2.4, status: "elevated" },
      { name: "Bellandur Canal", zone: "Zone D", waterLevel: 4.4, capacity: 84, flowRate: 3.0, status: "critical" },
      { name: "Rajakaluve Drain", zone: "Zone B", waterLevel: 3.0, capacity: 54, flowRate: 1.6, status: "normal" },
    ],
    stats: { rainfall: 28.5, rainfallTrend: "+6mm vs avg", waterLevel: 3.55, waterLevelTrend: "+0.4m in 6h", windSpeed: 22, temperature: 24.6, tempTrend: "Stable" },
    risk: {
      overall: { level: "moderate", value: 55 },
      zones: [
        { label: "Bellandur Lake", level: "high", value: 74 },
        { label: "Mahadevapura", level: "moderate", value: 55 },
        { label: "Whitefield Area", level: "low", value: 38 },
      ],
    },
    alerts: [
      { id: "1", type: "rain", severity: "watch", title: "Rainfall Watch", description: "Moderate showers expected. 25mm over next 6 hours in eastern zones.", time: "30 min ago" },
      { id: "2", type: "flood", severity: "advisory", title: "Urban Flood Advisory", description: "Waterlogging possible near Silk Board, Bellandur, and ORR underpasses.", time: "1 hr ago" },
    ],
    sensorCount: 38,
    totalSensors: 42,
    coverageArea: 15.8,
  },
  {
    id: "hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    coordinates: "17.38°N, 78.48°E",
    canals: [
      { name: "Musi River Canal", zone: "Zone A", waterLevel: 4.3, capacity: 81, flowRate: 2.8, status: "critical" },
      { name: "Hussain Sagar Drain", zone: "Zone B", waterLevel: 3.2, capacity: 58, flowRate: 1.7, status: "normal" },
      { name: "Nakkavagu Canal", zone: "Zone C", waterLevel: 3.7, capacity: 69, flowRate: 2.2, status: "elevated" },
      { name: "Kukatpally Nallah", zone: "Zone A", waterLevel: 4.0, capacity: 77, flowRate: 2.5, status: "elevated" },
      { name: "Banjara Nallah", zone: "Zone D", waterLevel: 2.6, capacity: 43, flowRate: 1.1, status: "normal" },
      { name: "Balkapur Nallah", zone: "Zone B", waterLevel: 4.6, capacity: 86, flowRate: 3.3, status: "critical" },
    ],
    stats: { rainfall: 41.7, rainfallTrend: "+11mm vs avg", waterLevel: 3.73, waterLevelTrend: "+0.6m in 6h", windSpeed: 35, temperature: 28.4, tempTrend: "Dropping" },
    risk: {
      overall: { level: "high", value: 69 },
      zones: [
        { label: "Musi Basin", level: "severe", value: 81 },
        { label: "Cyberabad", level: "high", value: 69 },
        { label: "Secunderabad", level: "moderate", value: 50 },
      ],
    },
    alerts: [
      { id: "1", type: "rain", severity: "warning", title: "Heavy Rain Warning", description: "45mm+ rainfall expected. Musi River basin at high overflow risk.", time: "10 min ago" },
      { id: "2", type: "flood", severity: "watch", title: "Flash Flood Watch", description: "Rapid water rise in Balkapur Nallah. Falaknuma area on alert.", time: "35 min ago" },
      { id: "3", type: "wind", severity: "advisory", title: "Wind Advisory", description: "Gusty winds 40 km/h expected with evening thunderstorms.", time: "2 hrs ago" },
    ],
    sensorCount: 45,
    totalSensors: 50,
    coverageArea: 20.3,
  },
];
