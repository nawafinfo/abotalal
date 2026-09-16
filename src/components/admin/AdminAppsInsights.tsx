import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Star, MessageSquare, TrendingUp, Send, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useAppsStats, useAppReviews } from '@/hooks/useAppDetails';
import { useApps } from '@/hooks/useApps';

const AdminAppsInsights: React.FC = () => {
  const { stats, isLoading } = useAppsStats();
  const { reviews, replyToReview, toggleVisibility, deleteReview } = useAppReviews();
  const { apps } = useApps();
  const [replying, setReplying] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const appName = (id: string) => apps.find(a => a.id === id)?.name || '—';

  const cards = [
    { label: 'إجمالي التحميلات', value: stats?.totalDownloads ?? 0, icon: Download, color: 'text-emerald-500' },
    { label: 'تحميلات آخر 7 أيام', value: stats?.weekDownloads ?? 0, icon: TrendingUp, color: 'text-blue-500' },
    { label: 'التعليقات', value: stats?.totalReviews ?? 0, icon: MessageSquare, color: 'text-violet-500' },
    { label: 'متوسط التقييم', value: stats?.avgRating ?? '0', icon: Star, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(c => (
          <Card key={c.label}>
            <CardContent className="p-4">
              <c.icon className={`w-5 h-5 ${c.color} mb-2`} />
              <p className="text-xl font-bold text-foreground">{isLoading ? '—' : c.value}</p>
              <p className="text-xs text-muted-foreground">{c.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-bold mb-2">أداء التطبيقات</h3>
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">التطبيق</TableHead>
                <TableHead className="text-right">التحميلات</TableHead>
                <TableHead className="text-right">التعليقات</TableHead>
                <TableHead className="text-right">التقييم</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(stats?.perApp || []).map(a => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell>{a.downloads}</TableCell>
                  <TableCell>{a.reviews}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {Number(a.rating).toFixed(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {!stats?.perApp?.length && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-6">لا توجد بيانات بعد</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold mb-2">
          مراقبة التعليقات {stats?.pendingReplies ? <Badge variant="secondary">{stats.pendingReplies} بانتظار الرد</Badge> : null}
        </h3>
        <div className="space-y-2">
          {reviews.length === 0 && <p className="text-center text-xs text-muted-foreground py-6">لا توجد تعليقات</p>}
          {reviews.map(r => (
            <div key={r.id} className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold">
                    {r.user_name} <span className="text-muted-foreground font-normal">• {appName(r.app_id)}</span>
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className={`w-3 h-3 ${i <= r.rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/40'}`} />
                    ))}
                    <span className="text-[10px] text-muted-foreground mr-1">
                      {new Date(r.created_at).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" aria-label="إظهار/إخفاء" onClick={() => toggleVisibility.mutate({ id: r.id, is_visible: !r.is_visible })}>
                    {r.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" aria-label="حذف" onClick={() => deleteReview.mutate(r.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {r.comment && <p className="text-xs text-muted-foreground mt-2">{r.comment}</p>}
              {r.admin_reply && (
                <div className="mt-2 rounded-lg bg-primary/5 border-r-2 border-primary p-2">
                  <p className="text-[10px] font-bold text-primary">ردك</p>
                  <p className="text-[11px] text-muted-foreground">{r.admin_reply}</p>
                </div>
              )}
              {replying === r.id ? (
                <div className="flex gap-2 mt-2">
                  <Input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="اكتب الرد..." className="h-8 text-xs" />
                  <Button
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      replyToReview.mutate({ id: r.id, reply: replyText });
                      setReplyText('');
                      setReplying(null);
                    }}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="outline" className="h-7 text-[11px] mt-2" onClick={() => { setReplying(r.id); setReplyText(r.admin_reply || ''); }}>
                  {r.admin_reply ? 'تعديل الرد' : 'الرد على التعليق'}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAppsInsights;
