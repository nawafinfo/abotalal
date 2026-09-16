import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Send, Star, Check, Link2, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useReferrals } from '@/hooks/useReferrals';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const ReferralSection: React.FC = () => {
  const { referrals, userPoints, pointsHistory, referralLink, sendReferral, copyReferralLink } = useReferrals();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyReferralLink();
    if (ok) {
      setCopied(true);
      toast({ title: 'تم النسخ', description: 'تم نسخ رابط الإحالة' });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendReferral = async () => {
    if (!email.trim()) return;
    const { error } = await sendReferral(email.trim());
    if (!error) {
      toast({ title: 'تم الإرسال', description: 'تم إرسال دعوة الإحالة' });
      setEmail('');
    } else {
      toast({ title: 'خطأ', description: error, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Points Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-l from-primary/20 via-accent/10 to-primary/5 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{userPoints?.points || 0}</p>
                  <p className="text-sm text-muted-foreground">نقاطك الحالية</p>
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary">
                إجمالي: {userPoints?.total_earned || 0}
              </Badge>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Referral Link */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">رابط الإحالة</h3>
            </div>
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="text-xs font-mono bg-secondary" dir="ltr" />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Send Invite */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">دعوة صديق</h3>
            </div>
            <div className="flex gap-2">
              <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="البريد الإلكتروني لصديقك" dir="ltr" type="email" />
              <Button onClick={handleSendReferral} disabled={!email.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">ستحصل على نقاط عند تسجيل صديقك عبر رابط الإحالة</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Referrals List */}
      {referrals.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="font-bold text-foreground mb-2 flex items-center gap-2"><Gift className="w-4 h-4 text-primary" />إحالاتك ({referrals.length})</h3>
          {referrals.map(ref => (
            <Card key={ref.id} className="mb-2">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">{ref.referred_email_masked ?? '—'}</p>
                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(ref.created_at), { addSuffix: true, locale: ar })}</p>
                </div>
                <Badge variant={ref.status === 'completed' ? 'default' : 'secondary'}>
                  {ref.status === 'completed' ? `+${ref.points_awarded} نقطة` : 'قيد الانتظار'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Points History */}
      {pointsHistory.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h3 className="font-bold text-foreground mb-2 flex items-center gap-2"><History className="w-4 h-4 text-primary" />سجل النقاط</h3>
          {pointsHistory.map(h => (
            <Card key={h.id} className="mb-2">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">{h.reason}</p>
                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(h.created_at), { addSuffix: true, locale: ar })}</p>
                </div>
                <Badge className={h.amount > 0 ? 'bg-emerald-500/20 text-emerald-600' : 'bg-destructive/20 text-destructive'}>
                  {h.amount > 0 ? '+' : ''}{h.amount}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ReferralSection;
