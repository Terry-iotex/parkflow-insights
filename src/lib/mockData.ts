// Simulated Park Data Engine
// Generates realistic amusement park operational data with time-based patterns

export interface Attraction {
  id: string;
  name: { zh: string; en: string };
  icon: string;
  zone: string;
  capacity: number;
  status: 'operating' | 'maintenance' | 'closed';
  currentQueue: number;
  waitTimeMinutes: number;
  maxWaitToday: number;
  throughputPerHour: number;
  position: { x: number; y: number }; // SVG map position (%)
  crowdLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface ZoneData {
  id: string;
  name: { zh: string; en: string };
  currentVisitors: number;
  capacity: number;
  crowdLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  suggestion: { zh: string; en: string };
  timestamp: Date;
  zone: string;
  resolved: boolean;
}

export interface QueueHistory {
  time: string;
  actual: number;
  predicted: number;
}

// Time-based multiplier (simulates daily pattern)
function getTimeMultiplier(): number {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const t = hour + minute / 60;
  
  // Morning ramp: 8-12, Peak: 12-15, Afternoon: 15-18, Evening drop: 18-21
  if (t < 8) return 0.1;
  if (t < 10) return 0.3 + (t - 8) * 0.15;
  if (t < 12) return 0.6 + (t - 10) * 0.2;
  if (t < 14) return 1.0; // Peak
  if (t < 16) return 0.95 - (t - 14) * 0.05;
  if (t < 18) return 0.85 - (t - 16) * 0.1;
  if (t < 20) return 0.65 - (t - 18) * 0.15;
  if (t < 22) return 0.35 - (t - 20) * 0.1;
  return 0.1;
}

// Add noise to a value
function noise(base: number, variance: number): number {
  return Math.max(0, Math.round(base + (Math.random() - 0.5) * 2 * variance));
}

function getCrowdLevel(ratio: number): 'low' | 'medium' | 'high' | 'critical' {
  if (ratio < 0.4) return 'low';
  if (ratio < 0.65) return 'medium';
  if (ratio < 0.85) return 'high';
  return 'critical';
}

const BASE_ATTRACTIONS: Omit<Attraction, 'currentQueue' | 'waitTimeMinutes' | 'maxWaitToday' | 'crowdLevel'>[] = [
  { id: 'coaster', name: { zh: '雷霆过山车', en: 'Thunder Coaster' }, icon: '🎢', zone: 'thrill', capacity: 24, status: 'operating', throughputPerHour: 720, position: { x: 25, y: 20 } },
  { id: 'carousel', name: { zh: '梦幻旋转木马', en: 'Dream Carousel' }, icon: '🎠', zone: 'family', capacity: 48, status: 'operating', throughputPerHour: 960, position: { x: 60, y: 65 } },
  { id: 'ferris', name: { zh: '星空摩天轮', en: 'Starlight Ferris Wheel' }, icon: '🎡', zone: 'scenic', capacity: 120, status: 'operating', throughputPerHour: 480, position: { x: 78, y: 30 } },
  { id: 'splash', name: { zh: '激流勇进', en: 'Splash Adventure' }, icon: '🌊', zone: 'thrill', capacity: 20, status: 'operating', throughputPerHour: 600, position: { x: 15, y: 55 } },
  { id: 'haunted', name: { zh: '幽灵古堡', en: 'Haunted Castle' }, icon: '🏰', zone: 'thrill', capacity: 30, status: 'operating', throughputPerHour: 540, position: { x: 40, y: 35 } },
  { id: 'teacup', name: { zh: '疯狂茶杯', en: 'Spinning Teacups' }, icon: '🍵', zone: 'family', capacity: 36, status: 'operating', throughputPerHour: 720, position: { x: 50, y: 80 } },
  { id: 'pirate', name: { zh: '海盗船', en: 'Pirate Ship' }, icon: '🏴‍☠️', zone: 'thrill', capacity: 40, status: 'operating', throughputPerHour: 800, position: { x: 35, y: 70 } },
  { id: 'bumper', name: { zh: '碰碰车', en: 'Bumper Cars' }, icon: '🚗', zone: 'family', capacity: 20, status: 'operating', throughputPerHour: 400, position: { x: 70, y: 50 } },
];

export function generateAttractions(): Attraction[] {
  const mult = getTimeMultiplier();
  
  return BASE_ATTRACTIONS.map(a => {
    const baseQueue = a.throughputPerHour / 60 * (3 + Math.random() * 5);
    const currentQueue = noise(baseQueue * mult, baseQueue * 0.2);
    const waitTime = Math.round(currentQueue / (a.throughputPerHour / 60));
    const maxWait = Math.round(waitTime * (1.2 + Math.random() * 0.3));
    const crowdLevel = getCrowdLevel(currentQueue / (a.throughputPerHour / 60 * 8));
    
    return {
      ...a,
      currentQueue,
      waitTimeMinutes: waitTime,
      maxWaitToday: maxWait,
      crowdLevel,
    };
  });
}

export function generateZones(): ZoneData[] {
  const mult = getTimeMultiplier();
  const zones = [
    { id: 'thrill', name: { zh: '刺激区', en: 'Thrill Zone' }, capacity: 3000 },
    { id: 'family', name: { zh: '亲子区', en: 'Family Zone' }, capacity: 4000 },
    { id: 'scenic', name: { zh: '观光区', en: 'Scenic Zone' }, capacity: 2500 },
    { id: 'food', name: { zh: '美食广场', en: 'Food Court' }, capacity: 2000 },
    { id: 'entrance', name: { zh: '入口大道', en: 'Main Entrance' }, capacity: 3000 },
  ];
  
  return zones.map(z => {
    const visitors = noise(z.capacity * mult * 0.7, z.capacity * 0.15);
    return {
      ...z,
      currentVisitors: visitors,
      crowdLevel: getCrowdLevel(visitors / z.capacity),
    };
  });
}

export function generateTotalVisitors(): number {
  return noise(12000 * getTimeMultiplier(), 800);
}

export function generateCrowdStressIndex(): number {
  const mult = getTimeMultiplier();
  return Math.min(100, Math.max(0, noise(mult * 75, 12)));
}

export function generateQueueHistory(attractionId: string): QueueHistory[] {
  const points: QueueHistory[] = [];
  const now = new Date();
  
  for (let i = -12; i <= 6; i++) {
    const time = new Date(now.getTime() + i * 5 * 60000);
    const hour = time.getHours() + time.getMinutes() / 60;
    let base = 20;
    if (hour >= 10 && hour <= 14) base = 45;
    else if (hour >= 14 && hour <= 18) base = 35;
    
    points.push({
      time: `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`,
      actual: i <= 0 ? noise(base, 8) : 0,
      predicted: noise(base, 5),
    });
  }
  return points;
}

export function generateAlerts(): Alert[] {
  const templates: Omit<Alert, 'id' | 'timestamp' | 'resolved'>[] = [
    {
      type: 'critical',
      title: { zh: '过山车排队超限', en: 'Coaster Queue Exceeded' },
      description: { zh: '雷霆过山车排队人数已达 280 人，等待时间超过 45 分钟', en: 'Thunder Coaster queue reached 280 people, wait time exceeding 45 min' },
      suggestion: { zh: '🚨 建议开放临时快速通道，分流排队游客', en: '🚨 Suggest opening temporary fast lane to divert queuing visitors' },
      zone: 'thrill',
    },
    {
      type: 'warning',
      title: { zh: '美食广场拥堵', en: 'Food Court Congestion' },
      description: { zh: '美食广场区域人数达到容量 85%，人流密度持续上升', en: 'Food court area at 85% capacity, crowd density rising' },
      suggestion: { zh: '📢 建议 APP 推送分流提示，引导游客前往东侧餐饮区', en: '📢 Suggest pushing diversion notice via app to guide visitors to east dining area' },
      zone: 'food',
    },
    {
      type: 'warning',
      title: { zh: '旋转木马人手不足', en: 'Carousel Understaffed' },
      description: { zh: '梦幻旋转木马区域游客增多，当前工作人员仅 2 名', en: 'Dream Carousel area visitor count increasing, only 2 staff present' },
      suggestion: { zh: '👷 建议增加 2 名工作人员到旋转木马区域', en: '👷 Suggest adding 2 staff members to carousel area' },
      zone: 'family',
    },
    {
      type: 'info',
      title: { zh: '摩天轮运营延长建议', en: 'Ferris Wheel Extended Hours' },
      description: { zh: '傍晚时段摩天轮需求旺盛，当前排队稳定在 30 分钟', en: 'Evening demand for Ferris Wheel is high, queue stable at 30 min' },
      suggestion: { zh: '⏰ 建议延长摩天轮开放时间至 21:00', en: '⏰ Suggest extending Ferris Wheel hours until 21:00' },
      zone: 'scenic',
    },
    {
      type: 'info',
      title: { zh: '冷区活动引流', en: 'Cold Zone Activity' },
      description: { zh: '观光区东侧游客稀少，利用率不足 20%', en: 'East scenic zone has few visitors, utilization below 20%' },
      suggestion: { zh: '🎪 建议在该区域开展限时互动活动吸引游客', en: '🎪 Suggest launching limited-time interactive events in this area' },
      zone: 'scenic',
    },
  ];
  
  const now = new Date();
  return templates.map((t, i) => ({
    ...t,
    id: `alert-${i}`,
    timestamp: new Date(now.getTime() - i * 8 * 60000),
    resolved: i > 3,
  }));
}

export function generateSuggestions(): Array<{ icon: string; text: { zh: string; en: string }; priority: 'high' | 'medium' | 'low' }> {
  return [
    { icon: '🚨', text: { zh: '过山车排队已超45分钟，建议开放临时通道', en: 'Coaster wait exceeds 45min, suggest opening temp lane' }, priority: 'high' },
    { icon: '📢', text: { zh: '建议 APP 推送分流提示引导游客前往冷区', en: 'Push diversion alerts to guide visitors to cold zones' }, priority: 'high' },
    { icon: '👷', text: { zh: '建议增加2名工作人员到旋转木马区域', en: 'Add 2 staff to carousel area' }, priority: 'medium' },
    { icon: '⏰', text: { zh: '建议延长摩天轮开放时间至21:00', en: 'Extend Ferris Wheel hours to 21:00' }, priority: 'low' },
  ];
}

// Crowd Analytics data
export function generateHourlyVisitors(): Array<{ hour: string; today: number; average: number }> {
  const data = [];
  for (let h = 8; h <= 21; h++) {
    const hourStr = `${h}:00`;
    const avg = h >= 11 && h <= 15 ? noise(10000, 1000) : noise(5000, 800);
    const today = noise(avg * (0.9 + Math.random() * 0.3), 500);
    data.push({ hour: hourStr, today, average: avg });
  }
  return data;
}

export function generateZoneDistribution(): Array<{ name: string; nameEn: string; value: number; color: string }> {
  return [
    { name: '刺激区', nameEn: 'Thrill', value: 35, color: 'hsl(0, 72%, 51%)' },
    { name: '亲子区', nameEn: 'Family', value: 28, color: 'hsl(210, 100%, 55%)' },
    { name: '观光区', nameEn: 'Scenic', value: 15, color: 'hsl(160, 70%, 45%)' },
    { name: '美食区', nameEn: 'Food', value: 15, color: 'hsl(38, 92%, 50%)' },
    { name: '入口区', nameEn: 'Entrance', value: 7, color: 'hsl(270, 60%, 55%)' },
  ];
}
