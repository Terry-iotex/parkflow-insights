import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Attraction } from '@/lib/mockData';
import { TrendingUp, Clock, AlertTriangle } from 'lucide-react';

interface MetricsPanelProps {
  totalVisitors: number;
  peakToday: number;
  crowdStress: number;
  attractions: Attraction[];
}

export function MetricsPanel({ totalVisitors, peakToday, crowdStress, attractions }: MetricsPanelProps) {
  const { lang, t } = useLanguage();

  const sorted = [...attractions].sort((a, b) => b.waitTimeMinutes - a.waitTimeMinutes);
  const top3 = sorted.slice(0, 3);

  const stressColor = crowdStress < 40 ? 'text-success' : crowdStress < 70 ? 'text-warning' : 'text-danger';
  const stressBg = crowdStress < 40 ? 'bg-success/10' : crowdStress < 70 ? 'bg-warning/10' : 'bg-danger/10';
  const stressRing = crowdStress < 40 ? 'stroke-success' : crowdStress < 70 ? 'stroke-warning' : 'stroke-danger';
  const crowdLabel = crowdStress < 40 ? 'GREEN' : crowdStress < 70 ? 'YELLOW' : 'RED';

  return (
    <div className="space-y-4">
      {/* Peak Today */}
      <Card className="glass-panel">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">{t('dashboard.peakToday')}</div>
              <div className="font-mono text-3xl font-bold">{peakToday.toLocaleString()}</div>
              <p className="text-[10px] text-muted-foreground mt-1">
                MVP note: peak is shown as current total until daily aggregation is implemented.
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Congestion TOP + Wait Ranking side by side */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="glass-panel">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-[11px] font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-warning" />
              {lang === 'zh' ? '拥堵项目 TOP' : 'Top Congested'}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="space-y-2 mt-1">
              {top3.map(a => {
                const levelColor = a.crowdLevel === 'critical' || a.crowdLevel === 'high' ? 'text-danger' : a.crowdLevel === 'medium' ? 'text-warning' : 'text-success';
                const levelBg = a.crowdLevel === 'critical' || a.crowdLevel === 'high' ? 'bg-danger/10 border-danger/20' : a.crowdLevel === 'medium' ? 'bg-warning/10 border-warning/20' : 'bg-success/10 border-success/20';
                return (
                  <div key={a.id} className="text-[11px]">
                    <div className="font-medium truncate">{a.name[lang]}</div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-muted-foreground">{lang === 'zh' ? '排队长度' : 'Queue'}: {a.currentQueue}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${levelBg} ${levelColor}`}>
                        {a.crowdLevel === 'critical' || a.crowdLevel === 'high' ? 'RED' : a.crowdLevel === 'medium' ? 'YELLOW' : 'GREEN'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-[11px] font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              {lang === 'zh' ? '等待时间排行' : 'Wait Ranking'}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="space-y-1.5 mt-1">
              {top3.map((a, i) => (
                <div key={a.id} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground font-mono w-3">{i + 1}</span>
                    <span className="truncate max-w-[80px]">{a.name[lang]}</span>
                  </div>
                  <span className="font-mono font-semibold text-primary">{a.waitTimeMinutes}m</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
