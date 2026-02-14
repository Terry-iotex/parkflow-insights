import { useLanguage } from '@/contexts/LanguageContext';
import { NavLink } from '@/components/NavLink';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Compass, BarChart3, Clock, AlertTriangle, FileText, Globe, Users, Activity, Bell } from 'lucide-react';

interface TopNavProps {
  totalVisitors: number;
  crowdStress: number;
  activeAlerts: number;
}

export function TopNav({ totalVisitors, crowdStress, activeAlerts }: TopNavProps) {
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
    <header className="sticky top-0 z-50 glass-panel border-b">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-6">
          <span className="text-lg">🎢</span>
          <span className="font-bold text-sm tracking-tight hidden sm:inline">
            {lang === 'zh' ? '游乐园指挥中心' : 'Park Control'}
          </span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary animate-pulse-glow">
            {t('common.live')}
          </Badge>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-0.5 overflow-x-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors whitespace-nowrap"
              activeClassName="text-primary bg-primary/10"
            >
              <item.icon className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{t(item.label)}</span>
            </NavLink>
          ))}
        </nav>

        {/* Status Bar + Language Toggle */}
        <div className="flex items-center gap-3 ml-4">
          <div className="hidden md:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span className="font-mono font-semibold">{totalVisitors.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className={`w-3.5 h-3.5 ${stressColor}`} />
              <span className={`font-mono font-semibold ${stressColor}`}>{crowdStress}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-warning" />
              <span className="font-mono font-semibold">{activeAlerts}</span>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={toggleLang} className="text-xs h-7 px-2">
            <Globe className="w-3.5 h-3.5 mr-1" />
            {lang === 'zh' ? 'EN' : '中'}
          </Button>
        </div>
      </div>
    </header>
  );
}
