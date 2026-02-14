import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ParkMap } from '@/components/dashboard/ParkMap';
import { MetricsPanel } from '@/components/dashboard/MetricsPanel';
import { SuggestionsPanel } from '@/components/dashboard/SuggestionsPanel';
import { generateAttractions, generateTotalVisitors, generateCrowdStressIndex } from '@/lib/mockData';

const Dashboard = () => {
  const { t } = useLanguage();
  const [attractions, setAttractions] = useState(generateAttractions());
  const [totalVisitors, setTotalVisitors] = useState(generateTotalVisitors());
  const [crowdStress, setCrowdStress] = useState(generateCrowdStressIndex());
  const [peakToday, setPeakToday] = useState(0);

  useEffect(() => {
    const tick = () => {
      const newAttractions = generateAttractions();
      const newVisitors = generateTotalVisitors();
      const newStress = generateCrowdStressIndex();
      setAttractions(newAttractions);
      setTotalVisitors(newVisitors);
      setCrowdStress(newStress);
      setPeakToday(prev => Math.max(prev, newVisitors));
    };
    tick();
    const interval = setInterval(tick, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">{t('dashboard.title')}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ParkMap attractions={attractions} />
        </div>
        <div>
          <MetricsPanel
            totalVisitors={totalVisitors}
            peakToday={peakToday}
            crowdStress={crowdStress}
            attractions={attractions}
          />
        </div>
      </div>
      <SuggestionsPanel />
    </div>
  );
};

export default Dashboard;
