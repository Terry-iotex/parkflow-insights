import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateAttractions, Attraction } from '@/lib/mockData';

const statusColors = {
  operating: 'bg-success/20 text-success border-success/30',
  maintenance: 'bg-warning/20 text-warning border-warning/30',
  closed: 'bg-muted text-muted-foreground border-border',
};

const crowdColors = {
  low: 'border-l-success',
  medium: 'border-l-warning',
  high: 'border-l-danger',
  critical: 'border-l-danger',
};

export default function Attractions() {
  const { lang, t } = useLanguage();
  const [attractions, setAttractions] = useState<Attraction[]>(generateAttractions());

  useEffect(() => {
    const interval = setInterval(() => setAttractions(generateAttractions()), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">{t('attractions.title')}</h1>
        <p className="text-xs text-muted-foreground">{lang === 'zh' ? '所有游乐项目实时状态与运营数据' : 'Real-time status and operational data for all attractions'}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {attractions.map(a => (
          <Card key={a.id} className={`glass-panel border-l-4 ${crowdColors[a.crowdLevel]} hover:shadow-xl transition-shadow`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{a.icon}</span>
                  <span className="font-semibold text-sm">{a.name[lang]}</span>
                </div>
                <Badge variant="outline" className={`text-[10px] ${statusColors[a.status]}`}>
                  {t(`attractions.${a.status}`)}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-y-3 text-xs">
                <div>
                  <div className="text-muted-foreground text-[10px] uppercase tracking-wider">{t('attractions.queue')}</div>
                  <div className="font-mono font-bold text-lg">{a.currentQueue}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-[10px] uppercase tracking-wider">{t('attractions.wait')}</div>
                  <div className="font-mono font-bold text-lg">{a.waitTimeMinutes} <span className="text-xs font-normal text-muted-foreground">{t('queue.minutes')}</span></div>
                </div>
                <div>
                  <div className="text-muted-foreground text-[10px] uppercase tracking-wider">{t('attractions.capacity')}</div>
                  <div className="font-mono">{a.capacity}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-[10px] uppercase tracking-wider">{t('dashboard.peakToday')}</div>
                  <div className="font-mono">{a.maxWaitToday} {t('queue.minutes')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
