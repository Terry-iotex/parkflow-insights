import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ParkMap } from '@/components/dashboard/ParkMap';
import { MetricsPanel } from '@/components/dashboard/MetricsPanel';
import { SuggestionsPanel } from '@/components/dashboard/SuggestionsPanel';
import { StatusBar } from '@/components/layout/StatusBar';
import { AlertsPreview } from '@/components/dashboard/AlertsPreview';
import { generateAttractions, generateTotalVisitors, generateCrowdStressIndex } from '@/lib/mockData';

interface OutletCtx {
  totalVisitors: number;
  crowdStress: number;
  activeAlerts: number;
  inflowPerMin: number;
  outflowPerMin: number;
}

const Dashboard = () => {
  const { t } = useLanguage();
  const ctx = useOutletContext<OutletCtx>();
  const [attractions, setAttractions] = useState(generateAttractions());
  const [peakToday, setPeakToday] = useState(0);

  useEffect(() => {
    const tick = () => {
      const newAttractions = generateAttractions();
      setAttractions(newAttractions);
      setPeakToday(prev => Math.max(prev, ctx.totalVisitors));
    };
    tick();
    const interval = setInterval(tick, 10000);
    return () => clearInterval(interval);
  }, [ctx.totalVisitors]);

  return (
    <div className="space-y-6">
      {/* Page header + Status pills */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-xs text-muted-foreground">Live operational snapshot</p>
        </div>
        <StatusBar
          totalVisitors={ctx.totalVisitors}
          crowdStress={ctx.crowdStress}
          inflowPerMin={ctx.inflowPerMin}
          outflowPerMin={ctx.outflowPerMin}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ParkMap attractions={attractions} />
        </div>
        <div>
          <MetricsPanel
            totalVisitors={ctx.totalVisitors}
            peakToday={peakToday}
            crowdStress={ctx.crowdStress}
            attractions={attractions}
          />
        </div>
      </div>

      {/* Suggestions */}
      <SuggestionsPanel />

      {/* Alerts Preview */}
      <AlertsPreview />
    </div>
  );
};

export default Dashboard;
