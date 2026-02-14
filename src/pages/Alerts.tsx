import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateAlerts, Alert } from '@/lib/mockData';
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

const typeIcons = {
  critical: AlertTriangle,
  warning: AlertCircle,
  info: Info,
};

const typeStyles = {
  critical: 'border-l-danger bg-danger/5',
  warning: 'border-l-warning bg-warning/5',
  info: 'border-l-primary bg-primary/5',
};

export default function Alerts() {
  const { lang, t } = useLanguage();
  const [alerts, setAlerts] = useState<Alert[]>(generateAlerts());

  useEffect(() => {
    const interval = setInterval(() => setAlerts(generateAlerts()), 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">{t('alerts.title')}</h1>
        <div className="flex gap-2 text-xs">
          <Badge variant="destructive" className="text-[10px]">
            {alerts.filter(a => a.type === 'critical' && !a.resolved).length} {t('alerts.critical')}
          </Badge>
          <Badge className="bg-warning text-warning-foreground text-[10px]">
            {alerts.filter(a => a.type === 'warning' && !a.resolved).length} {t('alerts.warning')}
          </Badge>
        </div>
      </div>
      <div className="space-y-2">
        {alerts.map(alert => {
          const Icon = typeIcons[alert.type];
          return (
            <Card key={alert.id} className={`glass-panel border-l-4 ${typeStyles[alert.type]} ${alert.resolved ? 'opacity-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${alert.type === 'critical' ? 'text-danger' : alert.type === 'warning' ? 'text-warning' : 'text-primary'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{alert.title[lang]}</span>
                      {alert.resolved && <CheckCircle2 className="w-3.5 h-3.5 text-success" />}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{alert.description[lang]}</p>
                    <div className="text-xs bg-muted/50 rounded-md p-2">
                      <span className="text-muted-foreground">{t('alerts.suggestion')}:</span>{' '}
                      {alert.suggestion[lang]}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {alert.timestamp.toLocaleTimeString(lang === 'zh' ? 'zh-CN' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
