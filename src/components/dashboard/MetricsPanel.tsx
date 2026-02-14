import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Attraction } from '@/lib/mockData';
import { Users, TrendingUp, Clock } from 'lucide-react';

interface MetricsPanelProps {
  totalVisitors: number;
  peakToday: number;
  crowdStress: number;
  attractions: Attraction[];
}

export function MetricsPanel({ totalVisitors, peakToday, crowdStress, attractions }: MetricsPanelProps) {
  const { lang, t } = useLanguage();
  
  const sorted = [...attractions].sort((a, b) => b.waitTimeMinutes - a.waitTimeMinutes);
  const top5 = sorted.slice(0, 5);
  
  const stressColor = crowdStress < 40 ? 'text-success' : crowdStress < 70 ? 'text-warning' : 'text-danger';
  const stressBg = crowdStress < 40 ? 'bg-success/10' : crowdStress < 70 ? 'bg-warning/10' : 'bg-danger/10';
  const stressRing = crowdStress < 40 ? 'stroke-success' : crowdStress < 70 ? 'stroke-warning' : 'stroke-danger';

  return (
    <div className="space-y-3">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="glass-panel">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-[10px] text-muted-foreground">{t('dashboard.totalVisitors')}</span>
            </div>
            <div className="font-mono text-2xl font-bold">{totalVisitors.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-[10px] text-muted-foreground">{t('dashboard.peakToday')}</span>
            </div>
            <div className="font-mono text-2xl font-bold">{peakToday.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Crowd Stress Index */}
      <Card className={`glass-panel ${stressBg}`}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-muted-foreground mb-1">{t('dashboard.crowdStress')}</div>
              <div className={`font-mono text-3xl font-bold ${stressColor}`}>{crowdStress}</div>
              <div className="text-[10px] text-muted-foreground">/100</div>
            </div>
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" strokeWidth="4" className="stroke-muted" />
              <circle
                cx="32" cy="32" r="28" fill="none" strokeWidth="4"
                className={stressRing}
                strokeLinecap="round"
                strokeDasharray={`${crowdStress * 1.76} 176`}
                transform="rotate(-90 32 32)"
              />
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Wait Time Ranking */}
      <Card className="glass-panel">
        <CardHeader className="pb-1 pt-3 px-3">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {t('dashboard.waitRanking')}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="space-y-1.5">
            {top5.map((a, i) => (
              <div key={a.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-3">{i + 1}</span>
                  <span>{a.icon}</span>
                  <span className="truncate max-w-[120px]">{a.name[lang]}</span>
                </div>
                <span className="font-mono font-semibold">{a.waitTimeMinutes} {t('queue.minutes')}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
