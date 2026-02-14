import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateAlerts } from '@/lib/mockData';
import { Bell, AlertTriangle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AlertsPreview() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const alerts = generateAlerts().filter(a => !a.resolved).slice(0, 3);

  const typeColors = {
    critical: { border: 'border-l-danger', icon: 'text-danger', badge: 'bg-danger/20 text-danger border-danger/30' },
    warning: { border: 'border-l-warning', icon: 'text-warning', badge: 'bg-warning/20 text-warning border-warning/30' },
    info: { border: 'border-l-primary', icon: 'text-primary', badge: 'bg-primary/20 text-primary border-primary/30' },
  };

  const overallStatus = alerts.some(a => a.type === 'critical') ? 'RED' : alerts.some(a => a.type === 'warning') ? 'YELLOW' : 'GREEN';
  const statusColor = overallStatus === 'RED' ? 'text-danger' : overallStatus === 'YELLOW' ? 'text-warning' : 'text-success';
  const statusBg = overallStatus === 'RED' ? 'bg-danger/20 border-danger/30' : overallStatus === 'YELLOW' ? 'bg-warning/20 border-warning/30' : 'bg-success/20 border-success/30';

  return (
    <Card className="glass-panel">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Bell className="w-4 h-4 text-warning" />
            {lang === 'zh' ? '当前警报' : 'Current Alerts'}
          </CardTitle>
          <Badge variant="outline" className={`text-[10px] px-2 ${statusBg} ${statusColor}`}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1 ${overallStatus === 'RED' ? 'bg-danger' : overallStatus === 'YELLOW' ? 'bg-warning' : 'bg-success'}`} />
            {overallStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">No active alerts. Keep steady.</p>
        ) : (
          alerts.map(alert => {
            const colors = typeColors[alert.type];
            const Icon = alert.type === 'critical' ? AlertTriangle : AlertCircle;
            return (
              <div key={alert.id} className={`rounded-lg border-l-4 ${colors.border} bg-muted/30 p-3`}>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${colors.badge} shrink-0 mt-0.5`}>
                    {alert.type === 'critical' ? 'RED' : alert.type === 'warning' ? 'YELLOW' : 'BLUE'}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold mb-0.5">{alert.title[lang]}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{alert.suggestion[lang]}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
