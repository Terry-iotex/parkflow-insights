import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { generateHourlyVisitors, generateZoneDistribution } from '@/lib/mockData';

export default function CrowdAnalytics() {
  const { lang, t } = useLanguage();
  const hourlyData = generateHourlyVisitors();
  const zoneData = generateZoneDistribution();

  const hourlyConfig = {
    today: { label: lang === 'zh' ? '今日' : 'Today', color: 'hsl(210, 100%, 55%)' },
    average: { label: lang === 'zh' ? '历史平均' : 'Average', color: 'hsl(var(--muted-foreground))' },
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">{t('crowd.title')}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Peak Comparison */}
        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('crowd.peakCompare')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={hourlyConfig} className="h-[280px]">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="average" fill="var(--color-average)" radius={[2, 2, 0, 0]} opacity={0.4} />
                <Bar dataKey="today" fill="var(--color-today)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Zone Distribution */}
        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('crowd.distribution')}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="w-full h-[280px] flex items-center justify-center">
              <PieChart width={280} height={280}>
                <Pie
                  data={zoneData}
                  cx={140}
                  cy={130}
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  nameKey={lang === 'zh' ? 'name' : 'nameEn'}
                  label={({ name, nameEn, value }) => `${lang === 'zh' ? name : nameEn} ${value}%`}
                  labelLine={false}
                >
                  {zoneData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
