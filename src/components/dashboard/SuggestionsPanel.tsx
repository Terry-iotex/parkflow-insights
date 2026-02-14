import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateSuggestions } from '@/lib/mockData';
import { Lightbulb } from 'lucide-react';

export function SuggestionsPanel() {
  const { lang, t } = useLanguage();
  const suggestions = generateSuggestions();

  const priorityColors = {
    high: 'border-danger/30 bg-danger/5',
    medium: 'border-warning/30 bg-warning/5',
    low: 'border-primary/30 bg-primary/5',
  };

  return (
    <Card className="glass-panel">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-warning" />
          {t('dashboard.suggestions')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {suggestions.map((s, i) => (
            <div key={i} className={`rounded-lg border p-3 text-xs ${priorityColors[s.priority]}`}>
              <span className="mr-2">{s.icon}</span>
              {s.text[lang]}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
