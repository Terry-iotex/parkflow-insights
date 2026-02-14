import { useLanguage } from '@/contexts/LanguageContext';
import { NavLink } from '@/components/NavLink';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Compass, BarChart3, Clock, AlertTriangle, FileText, Globe, Users, Activity, Bell, Eye } from 'lucide-react';

interface TopNavProps {
  totalVisitors: number;
  crowdStress: number;
  activeAlerts: number;
  inflowPerMin?: number;
  outflowPerMin?: number;
}

export function TopNav({ totalVisitors, crowdStress, activeAlerts, inflowPerMin = 0, outflowPerMin = 0 }: TopNavProps) {
  const { lang, toggleLang, t } = useLanguage();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'nav.dashboard' },
    { to: '/attractions', icon: Compass, label: 'nav.attractions' },
    { to: '/crowd', icon: BarChart3, label: 'nav.crowd' },
    { to: '/queue', icon: Clock, label: 'nav.queue' },
    { to: '/alerts', icon: AlertTriangle, label: 'nav.alerts' },
    { to: '/reports', icon: FileText, label: 'nav.reports' },
  ];

  const stressColor = crowdStress < 40 ? 'text-success' : crowdStress < 70 ? 'text-warning' : 'text-danger';

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-xl">
      {/* Top bar: Branding + Status + Language */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-border/30">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Eye className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight leading-tight">
              {lang === 'zh' ? '游乐园实时运营指挥系统' : 'Park Operation Control System'}
            </h1>
            <p className="text-[10px] text-muted-foreground leading-tight">
              Reduce queues · Detect congestion early · Optimize flow · Lower risk
            </p>
          </div>
        </div>

        {/* Center: Park selector placeholder */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-lg border border-border/50 bg-muted/30">
          <span className="text-xs">🌐</span>
          <span className="text-xs font-medium">
            {lang === 'zh' ? 'WonderLand Ops Demo / 游乐园运营演示' : 'WonderLand Ops Demo'}
          </span>
        </div>

        {/* Right: Language toggle */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground hidden sm:inline">LANG</span>
          <div className="flex items-center rounded-md border border-border/50 overflow-hidden">
            <button
              onClick={() => lang === 'en' && toggleLang()}
              className={`px-2.5 py-1 text-xs font-medium transition-colors ${lang === 'zh' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              中文
            </button>
            <button
              onClick={() => lang === 'zh' && toggleLang()}
              className={`px-2.5 py-1 text-xs font-medium transition-colors ${lang === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center justify-between px-6 h-11">
        <nav className="flex items-center gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all whitespace-nowrap"
              activeClassName="text-primary bg-primary/10 shadow-sm"
            >
              <item.icon className="w-4 h-4" />
              <span>{t(item.label)}</span>
            </NavLink>
          ))}
        </nav>

        {/* Live indicator */}
        <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-primary/40 text-primary gap-1.5 animate-pulse-glow">
          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
          {t('common.live')}
        </Badge>
      </div>
    </header>
  );
}
