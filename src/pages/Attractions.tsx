import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { generateAttractions, getZoneNames, Attraction } from '@/lib/mockData';
import { Plus, Search, Pencil, Video, Radio, ExternalLink } from 'lucide-react';

const STREAM_URL = 'https://www.youtube.com/watch?v=m15UeZ_WtHk';

export default function Attractions() {
  const { lang, t } = useLanguage();
  const [attractions, setAttractions] = useState<Attraction[]>(generateAttractions());
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [videoDialogId, setVideoDialogId] = useState<string | null>(null);
  const zoneNames = getZoneNames();

  useEffect(() => {
    const interval = setInterval(() => setAttractions(generateAttractions()), 10000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    return attractions.filter(a => {
      const matchSearch = search === '' || 
        a.name.zh.includes(search) || 
        a.name.en.toLowerCase().includes(search.toLowerCase());
      const matchZone = zoneFilter === 'all' || a.zone === zoneFilter;
      return matchSearch && matchZone;
    });
  }, [attractions, search, zoneFilter]);

  const zones = Object.entries(zoneNames);
  const videoAttraction = attractions.find(a => a.id === videoDialogId);
  const editAttraction = attractions.find(a => a.id === editingId);

  return (
    <div className="space-y-6">
      {/* Header with add buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">{t('attractions.title')}</h1>
          <p className="text-xs text-muted-foreground">
            {lang === 'zh'
              ? '配置试点项目 (2-3 个游乐设施) 及其 Trio 视频流。这是扩展的控制面板。'
              : 'Configure pilots (2–3 rides) and their Trio streams. This is the control surface for scaling.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            {lang === 'zh' ? '新增园区' : 'Add Park'}
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            {lang === 'zh' ? '新增区域' : 'Add Zone'}
          </Button>
          <Button size="sm" className="text-xs h-8 gap-1.5 bg-primary hover:bg-primary/90">
            <Plus className="w-3.5 h-3.5" />
            {lang === 'zh' ? '新增项目' : 'Add Ride'}
          </Button>
        </div>
      </div>

      {/* Search + Filter bar */}
      <Card className="glass-panel">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px_auto] gap-4 items-end">
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">
                {lang === 'zh' ? '搜索' : 'Search'}
              </Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder={lang === 'zh' ? '搜索...' : 'Search...'}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">
                {lang === 'zh' ? '筛选' : 'Filter'}
              </Label>
              <Select value={zoneFilter} onValueChange={setZoneFilter}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All zones</SelectItem>
                  {zones.map(([id, name]) => (
                    <SelectItem key={id} value={id}>
                      {name[lang]} / {name[lang === 'zh' ? 'en' : 'zh']}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-right">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Count</Label>
              <div className="font-mono text-2xl font-bold">{filtered.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attraction cards - 2 columns like reference */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(a => (
          <Card key={a.id} className="glass-panel hover:shadow-xl transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Radio className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{a.name.en} / {a.name.zh}</h3>
                    <p className="text-[11px] text-muted-foreground">
                      {lang === 'zh' ? '区域' : 'Zone'}: {a.zoneName[lang]} / {a.zoneName[lang === 'zh' ? 'en' : 'zh']} · {lang === 'zh' ? '状态' : 'Status'}: {' '}
                      <span className="text-success">{lang === 'zh' ? '启用' : 'Active'}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Dialog open={editingId === a.id} onOpenChange={open => setEditingId(open ? a.id : null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs h-8 gap-1">
                        <Pencil className="w-3 h-3" />
                        {lang === 'zh' ? '编辑' : 'Edit'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>{lang === 'zh' ? '编辑项目' : 'Edit Attraction'} — {a.name[lang]}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs">{lang === 'zh' ? '中文名称' : 'Chinese Name'}</Label>
                            <Input defaultValue={a.name.zh} className="mt-1 text-xs" />
                          </div>
                          <div>
                            <Label className="text-xs">{lang === 'zh' ? '英文名称' : 'English Name'}</Label>
                            <Input defaultValue={a.name.en} className="mt-1 text-xs" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">{lang === 'zh' ? '直播流地址' : 'Stream URL'}</Label>
                          <Input defaultValue={a.streamUrl} className="mt-1 text-xs font-mono" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs">{lang === 'zh' ? '摄像头用途' : 'Camera Purpose'}</Label>
                            <Select defaultValue={a.cameraPurpose}>
                              <SelectTrigger className="mt-1 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="queue">Queue</SelectItem>
                                <SelectItem value="crowd">Crowd</SelectItem>
                                <SelectItem value="safety">Safety</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs">{lang === 'zh' ? '所属区域' : 'Zone'}</Label>
                            <Select defaultValue={a.zone}>
                              <SelectTrigger className="mt-1 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {zones.map(([id, name]) => (
                                  <SelectItem key={id} value={id}>{name[lang]}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                          {lang === 'zh' ? '取消' : 'Cancel'}
                        </Button>
                        <Button size="sm" onClick={() => setEditingId(null)}>
                          {lang === 'zh' ? '保存' : 'Save'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Stream info */}
              <div className="bg-muted/30 rounded-lg p-3 border border-border/30 space-y-2">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                    {lang === 'zh' ? '直播流地址' : 'Live Stream URL'}
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-primary truncate flex-1">{a.streamUrl}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 shrink-0"
                      onClick={() => setVideoDialogId(a.id)}
                    >
                      <Video className="w-3.5 h-3.5 text-primary" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="text-muted-foreground">
                    {lang === 'zh' ? '摄像头用途' : 'Camera purpose'}: <span className="text-foreground font-medium">{a.cameraPurpose}</span>
                  </span>
                  <span className="text-muted-foreground">
                    {lang === 'zh' ? '排队' : 'Queue'}: <span className="font-mono font-bold text-foreground">{a.currentQueue}</span>
                  </span>
                  <span className="text-muted-foreground">
                    {lang === 'zh' ? '等待' : 'Wait'}: <span className="font-mono font-bold text-foreground">{a.waitTimeMinutes}m</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Video preview dialog */}
      <Dialog open={!!videoDialogId} onOpenChange={open => !open && setVideoDialogId(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="w-4 h-4 text-primary" />
              {videoAttraction?.name[lang]} — {lang === 'zh' ? '直播流预览' : 'Live Stream Preview'}
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video rounded-lg overflow-hidden bg-black">
            {videoDialogId && (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/m15UeZ_WtHk?autoplay=1`}
                title="Live Stream"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="border-0"
              />
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
              LIVE
              <span>·</span>
              <span>Powered by <span className="text-primary font-semibold">Trio Vision Intelligence</span></span>
            </div>
            <a
              href={STREAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              {lang === 'zh' ? '在 YouTube 中打开' : 'Open in YouTube'}
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
