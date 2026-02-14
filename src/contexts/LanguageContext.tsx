import React, { createContext, useContext, useState, useCallback } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Nav
  'nav.dashboard': { zh: '运营总览', en: 'Dashboard' },
  'nav.attractions': { zh: '项目管理', en: 'Attractions' },
  'nav.crowd': { zh: '人流分析', en: 'Crowd Analytics' },
  'nav.queue': { zh: '排队监控', en: 'Queue Monitor' },
  'nav.alerts': { zh: '预警中心', en: 'Alerts' },
  'nav.reports': { zh: '报表中心', en: 'Reports' },
  
  // Global status
  'status.totalVisitors': { zh: '当前游客', en: 'Visitors' },
  'status.crowdStress': { zh: '拥挤指数', en: 'Crowd Stress' },
  'status.activeAlerts': { zh: '活跃告警', en: 'Active Alerts' },
  
  // Dashboard
  'dashboard.title': { zh: '运营指挥中心', en: 'Operation Control Center' },
  'dashboard.parkMap': { zh: '园区地图', en: 'Park Map' },
  'dashboard.realtime': { zh: '实时指标', en: 'Real-time Metrics' },
  'dashboard.totalVisitors': { zh: '当前总游客', en: 'Total Visitors' },
  'dashboard.peakToday': { zh: '今日峰值', en: "Today's Peak" },
  'dashboard.topCrowded': { zh: '拥堵项目 TOP 5', en: 'Top 5 Crowded' },
  'dashboard.waitRanking': { zh: '等待时间排行', en: 'Wait Time Ranking' },
  'dashboard.crowdStress': { zh: '拥挤压力指数', en: 'Crowd Stress Index' },
  'dashboard.suggestions': { zh: '运营建议', en: 'Operational Suggestions' },
  
  // Attractions
  'attractions.title': { zh: '游乐项目管理', en: 'Attraction Management' },
  'attractions.status': { zh: '运营状态', en: 'Status' },
  'attractions.queue': { zh: '排队人数', en: 'Queue Length' },
  'attractions.wait': { zh: '预计等待', en: 'Est. Wait' },
  'attractions.capacity': { zh: '承载量', en: 'Capacity' },
  'attractions.operating': { zh: '运营中', en: 'Operating' },
  'attractions.maintenance': { zh: '维护中', en: 'Maintenance' },
  'attractions.closed': { zh: '已关闭', en: 'Closed' },
  
  // Queue Monitor
  'queue.title': { zh: '排队实时监控', en: 'Queue Monitor' },
  'queue.current': { zh: '当前等待', en: 'Current Wait' },
  'queue.predicted': { zh: '预测等待', en: 'Predicted Wait' },
  'queue.trend': { zh: '趋势', en: 'Trend' },
  'queue.speed': { zh: '排队速度', en: 'Queue Speed' },
  'queue.minutes': { zh: '分钟', en: 'min' },
  'queue.persons': { zh: '人', en: 'ppl' },
  
  // Crowd Analytics
  'crowd.title': { zh: '人流分析', en: 'Crowd Analytics' },
  'crowd.heatmap': { zh: '热力图', en: 'Heatmap' },
  'crowd.flow': { zh: '流动路径', en: 'Flow Paths' },
  'crowd.dwell': { zh: '停留时间', en: 'Dwell Time' },
  'crowd.distribution': { zh: '游客分布', en: 'Distribution' },
  'crowd.peakCompare': { zh: '高峰对比', en: 'Peak Comparison' },
  
  // Alerts
  'alerts.title': { zh: '预警中心', en: 'Alert Center' },
  'alerts.critical': { zh: '严重', en: 'Critical' },
  'alerts.warning': { zh: '警告', en: 'Warning' },
  'alerts.info': { zh: '提示', en: 'Info' },
  'alerts.suggestion': { zh: 'AI 建议', en: 'AI Suggestion' },
  
  // Reports
  'reports.title': { zh: '运营报表', en: 'Operation Reports' },
  'reports.daily': { zh: '每日报告', en: 'Daily Report' },
  'reports.satisfaction': { zh: '满意度', en: 'Satisfaction' },
  'reports.efficiency': { zh: '运营效率', en: 'Efficiency' },

  // Common
  'common.people': { zh: '人', en: 'people' },
  'common.min': { zh: '分钟', en: 'min' },
  'common.live': { zh: '实时', en: 'LIVE' },
  'common.ai': { zh: 'AI 分析', en: 'AI Analysis' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('zh');

  const toggleLang = useCallback(() => {
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  }, []);

  const t = useCallback((key: string): string => {
    return translations[key]?.[lang] ?? key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
