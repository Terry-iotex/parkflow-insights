import { useLanguage } from '@/contexts/LanguageContext';

interface StatusBarProps {
  totalVisitors: number;
  crowdStress: number;
  inflowPerMin: number;
  outflowPerMin: number;
}

export function StatusBar({ totalVisitors, crowdStress, inflowPerMin, outflowPerMin }: StatusBarProps) {
  const { lang } = useLanguage();

  const stressColor = crowdStress < 40 ? 'text-success' : crowdStress < 70 ? 'text-warning' : 'text-danger';
  const stressBg = crowdStress < 40 ? 'bg-success/10 border-success/20' : crowdStress < 70 ? 'bg-warning/10 border-warning/20' : 'bg-danger/10 border-danger/20';

  const pills = [
    {
      label: lang === 'zh' ? '当前人数' : 'Visitors',
      value: totalVisitors.toLocaleString(),
      className: 'bg-primary/10 border-primary/20 text-primary',
    },
    {
      label: lang === 'zh' ? '进场/分钟' : 'In/min',
      value: inflowPerMin.toString(),
      className: 'bg-accent/10 border-accent/20 text-accent',
    },
    {
      label: lang === 'zh' ? '出场/分钟' : 'Out/min',
      value: outflowPerMin.toString(),
      className: 'bg-muted border-border text-foreground',
    },
    {
      label: lang === 'zh' ? '拥挤指数' : 'Crowd Index',
      value: crowdStress.toString(),
      className: `${stressBg} ${stressColor}`,
    },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {pills.map((pill, i) => (
        <div
          key={i}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${pill.className}`}
        >
          <span className="opacity-70">{pill.label}</span>
          <span className="font-mono font-bold">{pill.value}</span>
        </div>
      ))}
    </div>
  );
}
