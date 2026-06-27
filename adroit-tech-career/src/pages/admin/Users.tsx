import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { apiRequest } from '@/lib/api';
import { AppUser } from '@/types/app.types';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2, Users, ShieldCheck, UserCheck, UserX, Mail, Phone, Calendar } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await apiRequest<{ data?: AppUser[]; items?: AppUser[] }>('/admin/users');
      if (res.success && res.data) {
        // backend pagination helper returns data directly or in array
        const list = Array.isArray(res.data) ? res.data : (res.data as unknown as { items: AppUser[] }).items || [];
        setUsers(list);
      }
    } catch (err: unknown) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: AppUser) => {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setActionId(user.id);
    try {
      const res = await apiRequest(`/admin/users/${user.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.success) {
        toast({
          title: 'User Status Updated',
          description: `User account has been set to ${newStatus}.`,
        });
        fetchUsers();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status.';
      toast({ title: 'Update Failed', description: msg, variant: 'destructive' });
    } finally {
      setActionId(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-destructive/10 text-destructive border border-destructive/20">ADMIN</span>;
      case 'EMPLOYER':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">EMPLOYER</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-secondary text-secondary-foreground border border-border">JOB SEEKER</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-600">Active</span>;
      case 'SUSPENDED':
      case 'DEACTIVATED':
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-destructive/10 text-destructive">Suspended</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-600">{status}</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Platform User Directory</h1>
          <p className="text-sm text-muted-foreground mt-1">Audit user accounts across Job Seekers, Employers, and Admin roles.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="bg-card rounded-2xl p-12 text-center shadow-card border border-border max-w-lg mx-auto my-8">
            <Users className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg font-bold text-foreground mb-1">No Users Registered</h3>
            <p className="text-muted-foreground text-sm">No user accounts found in the database.</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                    <th className="p-4">User Identity</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Registered</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => {
                    const displayName = u.jobSeekerProfile?.fullName || u.employerProfile?.companyName || u.email || 'User';
                    return (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-foreground">{displayName}</div>
                          <div className="text-xs text-muted-foreground font-mono">ID: {u.id.substring(0, 8)}...</div>
                        </td>
                        <td className="p-4 space-y-1">
                          {u.email && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Mail className="h-3.5 w-3.5 text-primary" />
                              {u.email}
                            </div>
                          )}
                          {u.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Phone className="h-3.5 w-3.5 text-primary" />
                              {u.phone}
                            </div>
                          )}
                        </td>
                        <td className="p-4">{getRoleBadge(u.role)}</td>
                        <td className="p-4">{getStatusBadge(u.status)}</td>
                        <td className="p-4 text-xs text-muted-foreground">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-4 text-right">
                          {u.role !== 'ADMIN' && (
                            <Button
                              variant={u.status === 'ACTIVE' ? 'outline' : 'cta'}
                              size="sm"
                              disabled={actionId === u.id}
                              onClick={() => handleToggleStatus(u)}
                            >
                              {actionId === u.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : u.status === 'ACTIVE' ? (
                                <>
                                  <UserX className="h-3.5 w-3.5 mr-1 text-destructive" />
                                  Suspend
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-3.5 w-3.5 mr-1" />
                                  Activate
                                </>
                              )}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
