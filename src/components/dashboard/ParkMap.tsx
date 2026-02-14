import { useLanguage } from '@/contexts/LanguageContext';
import { Attraction, generateZones } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import parkMapImage from '@/assets/park-map.jpg';

interface ParkMapProps {
  attractions: Attraction[];
}

const crowdColors = {
  low: 'hsl(160, 70%, 45%)',
  medium: 'hsl(38, 92%, 50%)',
  high: 'hsl(15, 80%, 50%)',
  critical: 'hsl(0, 72%, 51%)',
};

const crowdLabels = {
  low: 'GREEN',
  medium: 'YELLOW',
  high: 'RED',
  critical: 'RED',
};

export function ParkMap({ attractions }: ParkMapProps) {
  const { lang, t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const selectedAttraction = attractions.find(a => a.id === selected);
  const zones = generateZones();

  return (
    <Card className="glass-panel h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            🗺️ {t('dashboard.parkMap')} · {lang === 'zh' ? '热力图' : 'Heatmap'}
          </CardTitle>
          <div className="flex items-center gap-2">
            {(['low', 'medium', 'high'] as const).map(level => (
              <div key={level} className="flex items-center gap-1 text-[10px]">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: crowdColors[level] }} />
                <span className="text-muted-foreground">{crowdLabels[level]}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-border/30">
          {/* Park map background image */}
          <img
            src={parkMapImage}
            alt="Park Map"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/30" />

          {/* Zone labels */}
          {zones.slice(0, 3).map((zone, i) => {
            const positions = [
              { x: 50, y: 85 }, // entrance
              { x: 20, y: 30 }, // thrill
              { x: 75, y: 55 }, // family
            ];
            const pos = positions[i] || { x: 50, y: 50 };
            return (
              <div
                key={zone.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center z-10"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <div className="text-[10px] font-bold text-foreground/80 bg-background/50 px-2 py-0.5 rounded backdrop-blur-sm">
                  {zone.name[lang]}
                </div>
              </div>
            );
          })}

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
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm border-2 shadow-lg backdrop-blur-sm"
                  style={{
                    borderColor: crowdColors[a.crowdLevel],
                    backgroundColor: `${crowdColors[a.crowdLevel]}33`,
                  }}
                >
                  {a.icon}
                </div>
                <span className="text-[8px] font-medium bg-background/80 px-1.5 py-0.5 rounded-full whitespace-nowrap font-mono shadow-sm">
                  {a.waitTimeMinutes}{lang === 'zh' ? '分' : 'm'}
                </span>
              </div>
            </button>
          ))}

          {/* Hint */}
          <div className="absolute top-2 left-2 text-[9px] text-muted-foreground/70 bg-background/40 px-2 py-1 rounded backdrop-blur-sm">
            {lang === 'zh' ? '提示：点击项目可查看详情' : 'Tip: Click a ride to see details'}
          </div>

          {/* Selected detail popup */}
          {selectedAttraction && (
            <div className="absolute bottom-2 left-2 right-2 glass-panel rounded-lg p-3 z-20 animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{selectedAttraction.icon}</span>
                  <div>
                    <span className="font-semibold text-sm block">{selectedAttraction.name[lang]}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {lang === 'zh' ? '当前人数' : 'Current'}: {selectedAttraction.currentQueue} · {lang === 'zh' ? '拥挤指数' : 'Crowd'}: {Math.round(selectedAttraction.currentQueue / (selectedAttraction.throughputPerHour / 60 * 8) * 100)}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px]"
                  style={{ borderColor: crowdColors[selectedAttraction.crowdLevel], color: crowdColors[selectedAttraction.crowdLevel] }}
                >
                  {crowdLabels[selectedAttraction.crowdLevel]}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-muted-foreground text-[10px]">{t('attractions.queue')}</div>
                  <div className="font-mono font-bold">{selectedAttraction.currentQueue} {t('queue.persons')}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-[10px]">{t('attractions.wait')}</div>
                  <div className="font-mono font-bold">{selectedAttraction.waitTimeMinutes} {t('queue.minutes')}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-[10px]">{t('dashboard.peakToday')}</div>
                  <div className="font-mono font-bold">{selectedAttraction.maxWaitToday} {t('queue.minutes')}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Zone cards */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          {zones.slice(0, 3).map(zone => {
            const color = crowdColors[zone.crowdLevel];
            return (
              <div key={zone.id} className="rounded-lg border border-border/30 bg-muted/20 p-2.5">
                <div className="text-[11px] font-semibold mb-1">{zone.name[lang]}</div>
                <div className="text-[10px] text-muted-foreground">
                  {lang === 'zh' ? '当前人数' : 'Current'}: {zone.currentVisitors} · {lang === 'zh' ? '拥挤指数' : 'Index'}: {Math.round(zone.currentVisitors / zone.capacity * 100)}
                </div>
                <Badge
                  variant="outline"
                  className="text-[9px] mt-1 px-1.5 py-0"
                  style={{ borderColor: color, color }}
                >
                  {crowdLabels[zone.crowdLevel]}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
