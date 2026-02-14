import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { generateTotalVisitors, generateCrowdStressIndex, generateAlerts } from '@/lib/mockData';

export function AppLayout() {
  const [totalVisitors, setTotalVisitors] = useState(generateTotalVisitors());
  const [crowdStress, setCrowdStress] = useState(generateCrowdStressIndex());
  const [activeAlerts, setActiveAlerts] = useState(0);

  useEffect(() => {
    const tick = () => {
      setTotalVisitors(generateTotalVisitors());
      setCrowdStress(generateCrowdStressIndex());
      setActiveAlerts(generateAlerts().filter(a => !a.resolved).length);
    };
    tick();
    const interval = setInterval(tick, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background dark">
      <TopNav totalVisitors={totalVisitors} crowdStress={crowdStress} activeAlerts={activeAlerts} />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
