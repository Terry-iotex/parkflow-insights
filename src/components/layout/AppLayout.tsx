import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { generateTotalVisitors, generateCrowdStressIndex, generateAlerts } from '@/lib/mockData';

export function AppLayout() {
  const [totalVisitors, setTotalVisitors] = useState(generateTotalVisitors());
  const [crowdStress, setCrowdStress] = useState(generateCrowdStressIndex());
  const [activeAlerts, setActiveAlerts] = useState(0);
  const [inflowPerMin, setInflowPerMin] = useState(0);
  const [outflowPerMin, setOutflowPerMin] = useState(0);

  useEffect(() => {
    const tick = () => {
      setTotalVisitors(generateTotalVisitors());
      setCrowdStress(generateCrowdStressIndex());
      setActiveAlerts(generateAlerts().filter(a => !a.resolved).length);
      setInflowPerMin(Math.round(2 + Math.random() * 5));
      setOutflowPerMin(Math.round(1 + Math.random() * 3));
    };
    tick();
    const interval = setInterval(tick, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background dark flex flex-col">
      <TopNav
        totalVisitors={totalVisitors}
        crowdStress={crowdStress}
        activeAlerts={activeAlerts}
        inflowPerMin={inflowPerMin}
        outflowPerMin={outflowPerMin}
      />
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <Outlet context={{ totalVisitors, crowdStress, activeAlerts, inflowPerMin, outflowPerMin }} />
      </main>
      <Footer />
    </div>
  );
}
