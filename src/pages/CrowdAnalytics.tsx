import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, ResponsiveContainer } from 'recharts';
import { generateHourlyVisitors, generateZoneDistribution } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Users, AlertTriangle, Brain, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export default function CrowdAnalytics() {
  const { lang, t } = useLanguage();
  const hourlyData = generateHourlyVisitors();
  const zoneData = generateZoneDistribution();

  const hourlyConfig = {
    today: { label: lang === 'zh' ? '今日' : 'Today', color: 'hsl(210, 100%, 55%)' },
    average: { label: lang === 'zh' ? '历史平均' : 'Average', color: 'hsl(var(--muted-foreground))' },
  };

  const flowConfig = {
    inflow: { label: lang === 'zh' ? '入园' : 'Inflow', color: 'hsl(160, 70%, 45%)' },
    outflow: { label: lang === 'zh' ? '出园' : 'Outflow', color: 'hsl(0, 72%, 51%)' },
  };

  // Simulated flow data
  const flowData = Array.from({ length: 14 }, (_, i) => {
    const hour = 8 + i;
    const base = hour >= 11 && hour <= 15 ? 800 : 400;
    return {
      hour: `${hour}:00`,
      inflow: Math.round(base * (0.8 + Math.random() * 0.4)),
      outflow: Math.round(base * 0.6 * (0.7 + Math.random() * 0.5)),
    };
  });

  // Simulated density heatmap data by hour and zone
  const densityData = [
    { zone: lang === 'zh' ? '冒险区' : 'Adventure', peak: 92, current: 78, trend: 'up' as const },
    { zone: lang === 'zh' ? '亲子区' : 'Kids', peak: 85, current: 65, trend: 'down' as const },
    { zone: lang === 'zh' ? '观光区' : 'Scenic', peak: 60, current: 42, trend: 'down' as const },
    { zone: lang === 'zh' ? '美食区' : 'Food', peak: 88, current: 81, trend: 'up' as const },
    { zone: lang === 'zh' ? '入口区' : 'Entry', peak: 45, current: 30, trend: 'down' as const },
  ];

  // Weekly trend data
  const weeklyTrend = [
    { day: lang === 'zh' ? '周一' : 'Mon', visitors: 8200 },
    { day: lang === 'zh' ? '周二' : 'Tue', visitors: 7800 },
    { day: lang === 'zh' ? '周三' : 'Wed', visitors: 9500 },
    { day: lang === 'zh' ? '周四' : 'Thu', visitors: 10100 },
    { day: lang === 'zh' ? '周五' : 'Fri', visitors: 12800 },
    { day: lang === 'zh' ? '周六' : 'Sat', visitors: 15600 },
    { day: lang === 'zh' ? '周日' : 'Sun', visitors: 14200 },
  ];

  const weeklyConfig = {
    visitors: { label: lang === 'zh' ? '游客数' : 'Visitors', color: 'hsl(210, 100%, 55%)' },
  };

  const totalToday = hourlyData.reduce((s, d) => s + d.today, 0);
  const totalAvg = hourlyData.reduce((s, d) => s + d.average, 0);
  const diffPercent = ((totalToday - totalAvg) / totalAvg * 100).toFixed(1);
  const isUp = totalToday >= totalAvg;

  const peakHour = hourlyData.reduce((max, d) => d.today > max.today ? d : max, hourlyData[0]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">{t('crowd.title')}</h1>
        <p className="text-xs text-muted-foreground">{lang === 'zh' ? '园区人流密度分析与趋势预测' : 'Park crowd density analysis and trend forecasting'}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{lang === 'zh' ? '今日总客流' : 'Total Today'}</span>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="font-mono text-2xl font-bold">{totalToday.toLocaleString()}</div>
            <div className={`flex items-center gap-1 text-[11px] mt-1 ${isUp ? 'text-success' : 'text-danger'}`}>
              {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {diffPercent}% {lang === 'zh' ? '较均值' : 'vs avg'}
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{lang === 'zh' ? '峰值时段' : 'Peak Hour'}</span>
              <Activity className="w-4 h-4 text-warning" />
            </div>
            <div className="font-mono text-2xl font-bold">{peakHour.hour}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{peakHour.today.toLocaleString()} {lang === 'zh' ? '人' : 'visitors'}</div>
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{lang === 'zh' ? '拥堵区域' : 'Congested Zones'}</span>
              <AlertTriangle className="w-4 h-4 text-danger" />
            </div>
            <div className="font-mono text-2xl font-bold">{densityData.filter(d => d.current > 75).length}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{lang === 'zh' ? '密度 >75% 的区域' : 'Zones >75% density'}</div>
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{lang === 'zh' ? '平均密度' : 'Avg Density'}</span>
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <div className="font-mono text-2xl font-bold">{Math.round(densityData.reduce((s, d) => s + d.current, 0) / densityData.length)}%</div>
            <div className="text-[11px] text-muted-foreground mt-1">{lang === 'zh' ? '全园区均值' : 'Park-wide average'}</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Card */}
      <Card className="glass-panel border-primary/20">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">{lang === 'zh' ? 'AI 人流分析洞察' : 'AI Crowd Analysis Insights'}</h3>
                <Badge variant="outline" className="text-[10px] h-5 border-primary/30 text-primary">AI</Badge>
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed space-y-1.5">
                <p>
                  {lang === 'zh'
                    ? `📊 今日客流量较历史均值${isUp ? '高' : '低'} ${Math.abs(Number(diffPercent))}%，峰值出现在 ${peakHour.hour}，建议在 11:00-14:00 时段加强疏导。`
                    : `📊 Today's traffic is ${Math.abs(Number(diffPercent))}% ${isUp ? 'above' : 'below'} average. Peak at ${peakHour.hour}, recommend enhanced crowd management during 11:00-14:00.`}
                </p>
                <p>
                  {lang === 'zh'
                    ? `🔴 冒险区和美食区密度偏高（分别为 ${densityData[0].current}% 和 ${densityData[3].current}%），建议通过 APP 推送引导游客前往观光区（当前仅 ${densityData[2].current}%）。`
                    : `🔴 Adventure Zone and Food Court show high density (${densityData[0].current}% and ${densityData[3].current}% respectively). Recommend pushing in-app alerts to guide visitors to Scenic Zone (currently ${densityData[2].current}%).`}
                </p>
                <p>
                  {lang === 'zh'
                    ? '📈 预测下午 15:00-17:00 将出现第二波客流高峰，建议提前调配人力资源。'
                    : '📈 Second traffic peak predicted between 15:00-17:00. Suggest pre-allocating staff resources accordingly.'}
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
              <CardTitle className="text-sm">{t('crowd.peakCompare')}</CardTitle>
              <Badge variant="outline" className="text-[10px] h-5">{lang === 'zh' ? '实时' : 'Real-time'}</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">{lang === 'zh' ? '今日实际客流与历史平均值对比，识别异常波动' : 'Compare actual vs historical average to identify anomalies'}</p>
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

        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">{t('crowd.distribution')}</CardTitle>
              <Badge variant="outline" className="text-[10px] h-5">{lang === 'zh' ? '当前' : 'Current'}</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">{lang === 'zh' ? '各区域游客占比分布，辅助资源调度决策' : 'Visitor distribution by zone for resource allocation'}</p>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="w-full h-[280px] flex items-center justify-center">
              <PieChart width={300} height={280}>
                <Pie
                  data={zoneData}
                  cx={150}
                  cy={130}
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

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Inflow/Outflow */}
        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">{lang === 'zh' ? '入园/出园趋势' : 'Inflow / Outflow Trend'}</CardTitle>
              <Badge variant="outline" className="text-[10px] h-5">{lang === 'zh' ? '按时段' : 'Hourly'}</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">{lang === 'zh' ? '入园与出园流量对比，监测净滞留人数变化' : 'Compare inflow vs outflow to monitor net retention'}</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={flowConfig} className="h-[280px]">
              <AreaChart data={flowData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="inflow" fill="var(--color-inflow)" fillOpacity={0.2} stroke="var(--color-inflow)" strokeWidth={2} />
                <Area type="monotone" dataKey="outflow" fill="var(--color-outflow)" fillOpacity={0.2} stroke="var(--color-outflow)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">{lang === 'zh' ? '本周客流趋势' : 'Weekly Visitor Trend'}</CardTitle>
              <Badge variant="outline" className="text-[10px] h-5">{lang === 'zh' ? '7 天' : '7 Days'}</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">{lang === 'zh' ? '近 7 天客流量波动趋势，预测周末压力' : 'Track 7-day trends to predict weekend pressure'}</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={weeklyConfig} className="h-[280px]">
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="visitors" stroke="var(--color-visitors)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Zone Density Table */}
      <Card className="glass-panel">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">{lang === 'zh' ? '分区密度监控' : 'Zone Density Monitor'}</CardTitle>
            <Badge variant="outline" className="text-[10px] h-5">{lang === 'zh' ? '实时' : 'Live'}</Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">{lang === 'zh' ? '各区域当前密度与峰值对比，红色区域需重点关注' : 'Current vs peak density per zone. Red zones require attention.'}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {densityData.map((zone) => (
              <div key={zone.zone} className="flex items-center gap-4">
                <span className="text-xs font-medium w-20 shrink-0">{zone.zone}</span>
                <div className="flex-1">
                  <Progress value={zone.current} className="h-2.5" />
                </div>
                <span className={`font-mono text-xs font-bold w-10 text-right ${zone.current > 80 ? 'text-danger' : zone.current > 60 ? 'text-warning' : 'text-success'}`}>
                  {zone.current}%
                </span>
                <span className="text-[10px] text-muted-foreground w-16">
                  {lang === 'zh' ? '峰值' : 'Peak'} {zone.peak}%
                </span>
                <div className={`flex items-center gap-0.5 text-[11px] w-8 ${zone.trend === 'up' ? 'text-danger' : 'text-success'}`}>
                  {zone.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
