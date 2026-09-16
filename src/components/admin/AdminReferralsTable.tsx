import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Plus, Minus, Users, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminPoints } from '@/hooks/useReferrals';
import { useUsers } from '@/hooks/useUsers';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const AdminReferralsTable: React.FC = () => {
  const { allPoints, allReferrals, isLoading, adjustPoints } = useAdminPoints();
  const { users } = useUsers();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [pointsAmount, setPointsAmount] = useState('');
  const [reason, setReason] = useState('');

  const handleAdjust = async (isAdd: boolean) => {
    if (!selectedUserId || !pointsAmount) return;
    const amount = isAdd ? Math.abs(parseInt(pointsAmount)) : -Math.abs(parseInt(pointsAmount));
    await adjustPoints(selectedUserId, amount, reason || (isAdd ? 'إضافة نقاط يدوية' : 'خصم نقاط يدوي'));
    toast({ title: 'تم', description: isAdd ? 'تم إضافة النقاط' : 'تم خصم النقاط' });
    setIsDialogOpen(false);
    setPointsAmount('');
    setReason('');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  const totalPoints = allPoints.reduce((sum, p) => sum + p.points, 0);
  const totalReferrals = allReferrals.length;
  const successfulReferrals = allReferrals.filter(r => r.status === 'completed').length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="p-3 text-center"><Star className="w-5 h-5 mx-auto text-primary mb-1" /><p className="text-lg font-bold text-foreground">{totalPoints}</p><p className="text-xs text-muted-foreground">إجمالي النقاط</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><Users className="w-5 h-5 mx-auto text-primary mb-1" /><p className="text-lg font-bold text-foreground">{totalReferrals}</p><p className="text-xs text-muted-foreground">إجمالي الإحالات</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><TrendingUp className="w-5 h-5 mx-auto text-emerald-500 mb-1" /><p className="text-lg font-bold text-foreground">{successfulReferrals}</p><p className="text-xs text-muted-foreground">إحالات ناجحة</p></CardContent></Card>
      </div>

      {/* Adjust Points Button */}
      <Button onClick={() => setIsDialogOpen(true)} className="w-full"><Gift className="w-4 h-4 ml-2" />إدارة نقاط المستخدمين</Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>إدارة النقاط</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">المستخدم</label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger><SelectValue placeholder="اختر مستخدم" /></SelectTrigger>
                <SelectContent>
                  {users.map(u => (
                    <SelectItem key={u.user_id} value={u.user_id}>{u.name} - {u.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">عدد النقاط</label>
              <Input type="number" value={pointsAmount} onChange={e => setPointsAmount(e.target.value)} placeholder="مثال: 50" />
            </div>
            <div>
              <label className="text-sm font-medium">السبب</label>
              <Input value={reason} onChange={e => setReason(e.target.value)} placeholder="سبب التعديل" />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleAdjust(true)} className="flex-1 bg-emerald-600 hover:bg-emerald-700"><Plus className="w-4 h-4 ml-1" />إضافة</Button>
              <Button onClick={() => handleAdjust(false)} variant="destructive" className="flex-1"><Minus className="w-4 h-4 ml-1" />خصم</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Points Leaderboard */}
      <h3 className="font-bold text-foreground">ترتيب النقاط</h3>
      {allPoints.length === 0 ? (
        <Card><CardContent className="py-8 text-center"><Gift className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-40" /><p className="text-muted-foreground">لا توجد نقاط بعد</p></CardContent></Card>
      ) : (
        allPoints.map((pt, i) => (
          <motion.div key={pt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{i + 1}</div>
                <Avatar className="w-8 h-8"><AvatarFallback>{pt.profile?.name?.charAt(0) || '?'}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{pt.profile?.name || 'مستخدم'}</p>
                  <p className="text-xs text-muted-foreground truncate">{pt.profile?.email}</p>
                </div>
                <Badge className="bg-primary/10 text-primary font-bold">{pt.points} نقطة</Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}

      {/* Recent Referrals */}
      {allReferrals.length > 0 && (
        <>
          <h3 className="font-bold text-foreground mt-6">أحدث الإحالات</h3>
          {allReferrals.slice(0, 10).map((ref, i) => (
            <Card key={ref.id}>
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">إحالة #{ref.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(ref.created_at), { addSuffix: true, locale: ar })}</p>
                </div>
                <Badge variant={ref.status === 'completed' ? 'default' : 'secondary'}>
                  {ref.status === 'completed' ? 'مكتمل' : 'قيد الانتظار'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default AdminReferralsTable;
