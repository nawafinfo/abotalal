import React from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, ShieldCheck, User, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUsers } from '@/hooks/useUsers';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const roleLabels: Record<string, string> = {
  admin: 'مسؤول',
  moderator: 'مشرف',
  user: 'مستخدم',
};

const roleColors: Record<string, string> = {
  admin: 'bg-destructive/20 text-destructive',
  moderator: 'bg-primary/20 text-primary',
  user: 'bg-secondary text-secondary-foreground',
};

const AdminUsersTable: React.FC = () => {
  const { users, isLoading, setUserRole, removeUserRole } = useUsers();
  const { toast } = useToast();

  const handleRoleChange = async (userId: string, role: string) => {
    const { error } = await setUserRole(userId, role);
    if (!error) {
      toast({ title: 'تم التحديث', description: `تم تغيير الصلاحية إلى ${roleLabels[role]}` });
    } else {
      toast({ title: 'خطأ', description: 'فشل في تغيير الصلاحية', variant: 'destructive' });
    }
  };

  const handleRemoveRole = async (userId: string) => {
    const { error } = await removeUserRole(userId);
    if (!error) {
      toast({ title: 'تم التحديث', description: 'تم إزالة الصلاحية' });
    } else {
      toast({ title: 'خطأ', description: 'فشل في إزالة الصلاحية', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">لا يوجد مستخدمون حالياً</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">إجمالي المستخدمين: {users.length}</p>
      </div>

      {users.map((userProfile, index) => (
        <motion.div key={userProfile.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={userProfile.avatar_url || undefined} />
                    <AvatarFallback>{userProfile.name?.charAt(0) || 'م'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground truncate">{userProfile.name}</h3>
                      <Badge className={roleColors[userProfile.role || 'user']}>
                        {roleLabels[userProfile.role || 'user']}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{userProfile.email}</p>
                    <p className="text-xs text-muted-foreground">
                      انضم {formatDistanceToNow(new Date(userProfile.created_at), { addSuffix: true, locale: ar })}
                    </p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleRoleChange(userProfile.user_id, 'admin')}>
                      <ShieldCheck className="w-4 h-4 ml-2" />تعيين مسؤول
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange(userProfile.user_id, 'moderator')}>
                      <Shield className="w-4 h-4 ml-2" />تعيين مشرف
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRemoveRole(userProfile.user_id)}>
                      <User className="w-4 h-4 ml-2" />مستخدم عادي
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminUsersTable;
