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
  low: 'border-success/40',
  medium: 'border-warning/40',
  high: 'border-danger/40',
  critical: 'border-danger',
};

export default function Attractions() {
  const { lang, t } = useLanguage();
  const [attractions, setAttractions] = useState<Attraction[]>(generateAttractions());

  useEffect(() => {
    const interval = setInterval(() => setAttractions(generateAttractions()), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">{t('attractions.title')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {attractions.map(a => (
          <Card key={a.id} className={`glass-panel border-l-4 ${crowdColors[a.crowdLevel]}`}>
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
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div>
                  <div className="text-muted-foreground">{t('attractions.queue')}</div>
                  <div className="font-mono font-bold text-base">{a.currentQueue}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">{t('attractions.wait')}</div>
                  <div className="font-mono font-bold text-base">{a.waitTimeMinutes} {t('queue.minutes')}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">{t('attractions.capacity')}</div>
                  <div className="font-mono">{a.capacity}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">{t('dashboard.peakToday')}</div>
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
