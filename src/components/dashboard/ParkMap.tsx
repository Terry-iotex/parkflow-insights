import { useLanguage } from '@/contexts/LanguageContext';
import { Attraction } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface ParkMapProps {
  attractions: Attraction[];
}

const crowdColors = {
  low: 'hsl(160, 70%, 45%)',
  medium: 'hsl(38, 92%, 50%)',
  high: 'hsl(15, 80%, 50%)',
  critical: 'hsl(0, 72%, 51%)',
};

const crowdBg = {
  low: 'rgba(45, 180, 120, 0.15)',
  medium: 'rgba(240, 165, 0, 0.15)',
  high: 'rgba(230, 80, 40, 0.15)',
  critical: 'rgba(220, 40, 40, 0.2)',
};

export function ParkMap({ attractions }: ParkMapProps) {
  const { lang, t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const selectedAttraction = attractions.find(a => a.id === selected);

  return (
    <Card className="glass-panel h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          🗺️ {t('dashboard.parkMap')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="relative w-full aspect-[4/3] bg-muted/30 rounded-lg overflow-hidden border border-border/30">
          {/* Background park paths */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Park boundary */}
            <ellipse cx="50" cy="50" rx="46" ry="44" fill="none" stroke="hsl(var(--border))" strokeWidth="0.3" strokeDasharray="1,1" />
            {/* Paths */}
            <path d="M50,5 L50,95" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="0.3" />
            <path d="M10,50 L90,50" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="0.3" />
            <path d="M20,20 Q50,40 80,20" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="0.3" fill="none" />
            <path d="M20,80 Q50,60 80,80" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="0.3" fill="none" />
            
            {/* Zone heat circles */}
            {attractions.map(a => (
              <circle
                key={`heat-${a.id}`}
                cx={a.position.x}
                cy={a.position.y}
                r="10"
                fill={crowdBg[a.crowdLevel]}
                className="transition-all duration-1000"
              />
            ))}
          </svg>

          {/* Attraction markers */}
          {attractions.map(a => (
            <button
              key={a.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 z-10 ${selected === a.id ? 'scale-125' : ''}`}
              style={{ left: `${a.position.x}%`, top: `${a.position.y}%` }}
              onClick={() => setSelected(selected === a.id ? null : a.id)}
            >
              <div className="flex flex-col items-center gap-0.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 shadow-md"
                  style={{
                    borderColor: crowdColors[a.crowdLevel],
                    backgroundColor: `${crowdColors[a.crowdLevel]}22`,
                  }}
                >
                  {a.icon}
                </div>
                <span className="text-[8px] font-medium bg-background/80 px-1 rounded whitespace-nowrap">
                  {a.waitTimeMinutes}{lang === 'zh' ? '分' : 'm'}
                </span>
              </div>
            </button>
          ))}

          {/* Selected detail popup */}
          {selectedAttraction && (
            <div className="absolute bottom-2 left-2 right-2 glass-panel rounded-lg p-3 z-20 animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{selectedAttraction.icon}</span>
                  <span className="font-semibold text-sm">{selectedAttraction.name[lang]}</span>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px]"
                  style={{ borderColor: crowdColors[selectedAttraction.crowdLevel], color: crowdColors[selectedAttraction.crowdLevel] }}
                >
                  {selectedAttraction.crowdLevel.toUpperCase()}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-muted-foreground">{t('attractions.queue')}</div>
                  <div className="font-mono font-bold">{selectedAttraction.currentQueue} {t('queue.persons')}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">{t('attractions.wait')}</div>
                  <div className="font-mono font-bold">{selectedAttraction.waitTimeMinutes} {t('queue.minutes')}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">{t('dashboard.peakToday')}</div>
                  <div className="font-mono font-bold">{selectedAttraction.maxWaitToday} {t('queue.minutes')}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground justify-center">
          {(['low', 'medium', 'high', 'critical'] as const).map(level => (
            <div key={level} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: crowdColors[level] }} />
              {level}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
