import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateSuggestions } from '@/lib/mockData';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SuggestionsPanel() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const suggestions = generateSuggestions();
  const topSuggestion = suggestions.find(s => s.priority === 'high') || suggestions[0];

  return (
    <Card className="glass-panel bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold mb-0.5">Ops cue</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {topSuggestion.text[lang]}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 text-xs h-8 border-primary/30 hover:bg-primary/10"
          onClick={() => navigate('/alerts')}
        >
          {lang === 'zh' ? '查看详情' : 'Details'}
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
