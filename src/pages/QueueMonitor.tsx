import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateAttractions, generateQueueHistory, Attraction } from '@/lib/mockData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown } from 'lucide-react';

export default function QueueMonitor() {
  const { lang, t } = useLanguage();
  const [attractions, setAttractions] = useState<Attraction[]>(generateAttractions());
  const [selectedId, setSelectedId] = useState('coaster');
  const [sortKey, setSortKey] = useState<'waitTimeMinutes' | 'currentQueue'>('waitTimeMinutes');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setAttractions(generateAttractions()), 10000);
    return () => clearInterval(interval);
  }, []);

  const sorted = [...attractions].sort((a, b) => sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]);
  const queueData = generateQueueHistory(selectedId);
  const chartConfig = {
    actual: { label: lang === 'zh' ? '实际' : 'Actual', color: 'hsl(210, 100%, 55%)' },
    predicted: { label: lang === 'zh' ? '预测' : 'Predicted', color: 'hsl(160, 70%, 45%)' },
  };

  const toggleSort = (key: 'waitTimeMinutes' | 'currentQueue') => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">{t('queue.title')}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Table */}
        <Card className="glass-panel">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">{lang === 'zh' ? '项目' : 'Attraction'}</TableHead>
                  <TableHead className="text-xs cursor-pointer" onClick={() => toggleSort('currentQueue')}>
                    <span className="flex items-center gap-1">{t('attractions.queue')} <ArrowUpDown className="w-3 h-3" /></span>
                  </TableHead>
                  <TableHead className="text-xs cursor-pointer" onClick={() => toggleSort('waitTimeMinutes')}>
                    <span className="flex items-center gap-1">{t('queue.current')} <ArrowUpDown className="w-3 h-3" /></span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map(a => (
                  <TableRow
                    key={a.id}
                    className={`cursor-pointer text-xs ${selectedId === a.id ? 'bg-primary/10' : ''}`}
                    onClick={() => setSelectedId(a.id)}
                  >
                    <TableCell className="font-medium">
                      <span className="mr-1.5">{a.icon}</span>
                      {a.name[lang]}
                    </TableCell>
                    <TableCell className="font-mono">{a.currentQueue}</TableCell>
                    <TableCell className="font-mono">{a.waitTimeMinutes} {t('queue.minutes')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              {attractions.find(a => a.id === selectedId)?.icon} {attractions.find(a => a.id === selectedId)?.name[lang]} — {t('queue.trend')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={queueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="actual" stroke="var(--color-actual)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="predicted" stroke="var(--color-predicted)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
