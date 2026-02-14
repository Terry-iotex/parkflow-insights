import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">{t('crowd.title')}</h1>
        <p className="text-xs text-muted-foreground">{lang === 'zh' ? '园区人流密度分析与趋势预测' : 'Park crowd density analysis and trend forecasting'}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('crowd.peakCompare')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={hourlyConfig} className="h-[300px]">
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

        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('crowd.distribution')}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="w-full h-[300px] flex items-center justify-center">
              <PieChart width={300} height={300}>
                <Pie
                  data={zoneData}
                  cx={150}
                  cy={140}
                  innerRadius={65}
                  outerRadius={105}
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
