import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FileText, Smile, Gauge } from 'lucide-react';

const weeklyData = [
  { day: 'Mon', visitors: 8500, satisfaction: 82, efficiency: 78 },
  { day: 'Tue', visitors: 7200, satisfaction: 85, efficiency: 82 },
  { day: 'Wed', visitors: 9100, satisfaction: 79, efficiency: 75 },
  { day: 'Thu', visitors: 10200, satisfaction: 76, efficiency: 71 },
  { day: 'Fri', visitors: 12500, satisfaction: 72, efficiency: 68 },
  { day: 'Sat', visitors: 15800, satisfaction: 68, efficiency: 62 },
  { day: 'Sun', visitors: 14200, satisfaction: 71, efficiency: 65 },
];

export default function Reports() {
  const { lang, t } = useLanguage();

  const chartConfig = {
    visitors: { label: lang === 'zh' ? '游客数' : 'Visitors', color: 'hsl(210, 100%, 55%)' },
    satisfaction: { label: lang === 'zh' ? '满意度' : 'Satisfaction', color: 'hsl(160, 70%, 45%)' },
    efficiency: { label: lang === 'zh' ? '效率' : 'Efficiency', color: 'hsl(38, 92%, 50%)' },
  };

  const avgSatisfaction = Math.round(weeklyData.reduce((s, d) => s + d.satisfaction, 0) / weeklyData.length);
  const avgEfficiency = Math.round(weeklyData.reduce((s, d) => s + d.efficiency, 0) / weeklyData.length);
  const totalVisitors = weeklyData.reduce((s, d) => s + d.visitors, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">{t('reports.title')}</h1>
        <p className="text-xs text-muted-foreground">{lang === 'zh' ? '运营数据汇总与效率分析报告' : 'Operational data summary and efficiency analysis reports'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-panel hover:shadow-lg transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{lang === 'zh' ? '本周总游客' : 'Weekly Visitors'}</div>
              <div className="font-mono text-2xl font-bold">{totalVisitors.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel hover:shadow-lg transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <Smile className="w-6 h-6 text-success" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('reports.satisfaction')}</div>
              <div className="font-mono text-2xl font-bold">{avgSatisfaction}%</div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel hover:shadow-lg transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Gauge className="w-6 h-6 text-warning" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('reports.efficiency')}</div>
              <div className="font-mono text-2xl font-bold">{avgEfficiency}%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{lang === 'zh' ? '周趋势' : 'Weekly Trends'}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[320px]">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line yAxisId="left" type="monotone" dataKey="visitors" stroke="var(--color-visitors)" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="var(--color-satisfaction)" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="var(--color-efficiency)" strokeWidth={2} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
