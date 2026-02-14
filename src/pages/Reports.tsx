import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Smile, Gauge, Brain, TrendingUp, TrendingDown, Star, Users, Clock, ShieldCheck } from 'lucide-react';

const weeklyData = [
  { day: 'Mon', visitors: 8500, satisfaction: 82, efficiency: 78 },
  { day: 'Tue', visitors: 7200, satisfaction: 85, efficiency: 82 },
  { day: 'Wed', visitors: 9100, satisfaction: 79, efficiency: 75 },
  { day: 'Thu', visitors: 10200, satisfaction: 76, efficiency: 71 },
  { day: 'Fri', visitors: 12500, satisfaction: 72, efficiency: 68 },
  { day: 'Sat', visitors: 15800, satisfaction: 68, efficiency: 62 },
  { day: 'Sun', visitors: 14200, satisfaction: 71, efficiency: 65 },
];

const ridePerformance = [
  { name: 'Sky Coaster', throughput: 92, downtime: 3, satisfaction: 88 },
  { name: 'Carousel', throughput: 85, downtime: 1, satisfaction: 91 },
  { name: 'Starlight Wheel', throughput: 78, downtime: 5, satisfaction: 85 },
  { name: 'River Rapids', throughput: 88, downtime: 2, satisfaction: 82 },
  { name: 'Haunted Castle', throughput: 72, downtime: 8, satisfaction: 79 },
  { name: 'Spinning Teacups', throughput: 95, downtime: 0, satisfaction: 93 },
];

const radarData = [
  { metric: '客流管理', value: 82 },
  { metric: '设备运行', value: 78 },
  { metric: '游客体验', value: 75 },
  { metric: '安全指标', value: 92 },
  { metric: '员工效率', value: 70 },
  { metric: '收入指标', value: 85 },
];

const radarDataEn = [
  { metric: 'Crowd Mgmt', value: 82 },
  { metric: 'Equipment', value: 78 },
  { metric: 'Experience', value: 75 },
  { metric: 'Safety', value: 92 },
  { metric: 'Staff Eff.', value: 70 },
  { metric: 'Revenue', value: 85 },
];

export default function Reports() {
  const { lang, t } = useLanguage();

  const chartConfig = {
    visitors: { label: lang === 'zh' ? '游客数' : 'Visitors', color: 'hsl(210, 100%, 55%)' },
    satisfaction: { label: lang === 'zh' ? '满意度' : 'Satisfaction', color: 'hsl(160, 70%, 45%)' },
    efficiency: { label: lang === 'zh' ? '效率' : 'Efficiency', color: 'hsl(38, 92%, 50%)' },
  };

  const rideConfig = {
    throughput: { label: lang === 'zh' ? '运行效率' : 'Throughput', color: 'hsl(210, 100%, 55%)' },
    satisfaction: { label: lang === 'zh' ? '满意度' : 'Satisfaction', color: 'hsl(160, 70%, 45%)' },
  };

  const avgSatisfaction = Math.round(weeklyData.reduce((s, d) => s + d.satisfaction, 0) / weeklyData.length);
  const avgEfficiency = Math.round(weeklyData.reduce((s, d) => s + d.efficiency, 0) / weeklyData.length);
  const totalVisitors = weeklyData.reduce((s, d) => s + d.visitors, 0);
  const peakDay = weeklyData.reduce((max, d) => d.visitors > max.visitors ? d : max, weeklyData[0]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">{t('reports.title')}</h1>
        <p className="text-xs text-muted-foreground">{lang === 'zh' ? '运营数据汇总与效率分析报告' : 'Operational data summary and efficiency analysis reports'}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-panel hover:shadow-lg transition-shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{lang === 'zh' ? '本周总游客' : 'Weekly Total'}</div>
              <div className="font-mono text-xl font-bold">{totalVisitors.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel hover:shadow-lg transition-shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Smile className="w-5 h-5 text-success" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('reports.satisfaction')}</div>
              <div className="font-mono text-xl font-bold">{avgSatisfaction}%</div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel hover:shadow-lg transition-shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Gauge className="w-5 h-5 text-warning" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('reports.efficiency')}</div>
              <div className="font-mono text-xl font-bold">{avgEfficiency}%</div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel hover:shadow-lg transition-shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{lang === 'zh' ? '峰值日' : 'Peak Day'}</div>
              <div className="font-mono text-xl font-bold">{peakDay.day}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Report Summary */}
      <Card className="glass-panel border-primary/20">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">{lang === 'zh' ? 'AI 运营报告摘要' : 'AI Operations Report Summary'}</h3>
                <Badge variant="outline" className="text-[10px] h-5 border-primary/30 text-primary">AI</Badge>
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed space-y-1.5">
                <p>
                  {lang === 'zh'
                    ? `📊 本周累计接待游客 ${totalVisitors.toLocaleString()} 人，峰值出现在${peakDay.day}（${peakDay.visitors.toLocaleString()}人），周末客流量较工作日增加约 68%。`
                    : `📊 Total weekly visitors: ${totalVisitors.toLocaleString()}. Peak on ${peakDay.day} (${peakDay.visitors.toLocaleString()}). Weekend traffic is ~68% higher than weekdays.`}
                </p>
                <p>
                  {lang === 'zh'
                    ? `⚠️ 满意度在周六降至最低（68%），主要受排队时间过长影响。建议在高峰日增加快速通道和工作人员。运营效率周六最低（62%），与设备维护窗口时间冲突有关。`
                    : `⚠️ Satisfaction dropped to 68% on Saturday, mainly due to long wait times. Suggest adding fast lanes and staff on peak days. Operational efficiency lowest on Saturday (62%), correlated with maintenance window conflicts.`}
                </p>
                <p>
                  {lang === 'zh'
                    ? '✅ 安全指标表现优秀（92分），建议继续保持现有安全管理流程。旋转茶杯满意度最高（93%），可作为服务标杆推广经验。'
                    : '✅ Safety metrics performing excellently (92 pts). Recommend maintaining current safety management. Spinning Teacups has highest satisfaction (93%), model its practices for other rides.'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">{lang === 'zh' ? '周趋势' : 'Weekly Trends'}</CardTitle>
              <Badge variant="outline" className="text-[10px] h-5">{lang === 'zh' ? '多维度' : 'Multi-axis'}</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">{lang === 'zh' ? '游客数、满意度与效率三维趋势对比' : 'Visitors, satisfaction & efficiency trend comparison'}</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line yAxisId="left" type="monotone" dataKey="visitors" stroke="var(--color-visitors)" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="var(--color-satisfaction)" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="var(--color-efficiency)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">{lang === 'zh' ? '运营能力雷达图' : 'Operations Capability Radar'}</CardTitle>
              <Badge variant="outline" className="text-[10px] h-5">{lang === 'zh' ? '综合' : 'Overall'}</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">{lang === 'zh' ? '六大运营维度综合评估' : 'Comprehensive assessment across 6 operational dimensions'}</p>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={lang === 'zh' ? radarData : radarDataEn} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <PolarRadiusAxis tick={{ fontSize: 9 }} domain={[0, 100]} />
                  <Radar name="Score" dataKey="value" stroke="hsl(210, 100%, 55%)" fill="hsl(210, 100%, 55%)" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ride Performance */}
      <Card className="glass-panel">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">{lang === 'zh' ? '项目运营绩效' : 'Ride Performance Metrics'}</CardTitle>
            <Badge variant="outline" className="text-[10px] h-5">{lang === 'zh' ? '本周' : 'This Week'}</Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">{lang === 'zh' ? '各游乐项目运行效率、停机率和满意度评分' : 'Throughput, downtime percentage, and satisfaction score per ride'}</p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={rideConfig} className="h-[280px]">
            <BarChart data={ridePerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={110} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="throughput" fill="var(--color-throughput)" radius={[0, 4, 4, 0]} barSize={14} />
              <Bar dataKey="satisfaction" fill="var(--color-satisfaction)" radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Detailed Ride Table */}
      <Card className="glass-panel">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">{lang === 'zh' ? '项目详细数据' : 'Detailed Ride Data'}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ridePerformance.map((ride) => (
              <div key={ride.name} className="flex items-center gap-4 py-2 border-b border-border/20 last:border-0">
                <span className="text-xs font-medium w-28 shrink-0">{ride.name}</span>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-16">{lang === 'zh' ? '运行效率' : 'Efficiency'}</span>
                    <Progress value={ride.throughput} className="h-1.5 flex-1" />
                    <span className="font-mono text-[11px] w-8 text-right">{ride.throughput}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-16">{lang === 'zh' ? '满意度' : 'Satisf.'}</span>
                    <Progress value={ride.satisfaction} className="h-1.5 flex-1" />
                    <span className="font-mono text-[11px] w-8 text-right">{ride.satisfaction}%</span>
                  </div>
                </div>
                <div className="text-center shrink-0">
                  <div className="text-[10px] text-muted-foreground">{lang === 'zh' ? '停机' : 'Down'}</div>
                  <div className={`font-mono text-xs font-bold ${ride.downtime > 5 ? 'text-danger' : ride.downtime > 2 ? 'text-warning' : 'text-success'}`}>{ride.downtime}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
