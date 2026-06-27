import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { apiRequest } from '@/lib/api';
import { AppEmployerProfile } from '@/types/app.types';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2, Building2, CheckCircle2, XCircle, Mail, Phone, MapPin, ShieldAlert } from 'lucide-react';

export const AdminEmployers: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [employers, setEmployers] = useState<AppEmployerProfile[]>([]);
  const [actionId, setActionId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  const fetchEmployers = async () => {
    try {
      const endpoint = filter === 'ALL' ? '/admin/employers' : `/admin/employers?status=${filter}`;
      const res = await apiRequest<AppEmployerProfile[]>(endpoint);
      if (res.success && res.data) {
        setEmployers(res.data);
      }
    } catch (err: unknown) {
      console.error('Error fetching employers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, [filter]);

  const handleApprove = async (id: string) => {
    setActionId(id);
    try {
      const res = await apiRequest(`/admin/employers/${id}/approve`, {
        method: 'PATCH',
      });
      if (res.success) {
        toast({
          title: 'Employer Approved',
          description: 'Employer account has been approved and activated.',
        });
        fetchEmployers();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not approve employer.';
      toast({ title: 'Action Failed', description: msg, variant: 'destructive' });
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt('Enter reason for rejecting this employer:');
    if (!reason) return;

    setActionId(id);
    try {
      const res = await apiRequest(`/admin/employers/${id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      });
      if (res.success) {
        toast({
          title: 'Employer Rejected',
          description: 'Employer application has been rejected.',
        });
        fetchEmployers();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not reject employer.';
      toast({ title: 'Action Failed', description: msg, variant: 'destructive' });
    } finally {
      setActionId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Approved</span>;
      case 'PENDING':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">Pending Approval</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">Rejected</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">{status}</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Employer Verification & Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Approve pending employer accounts and view registered corporate profiles.</p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 bg-card p-1.5 rounded-xl border border-border self-start sm:self-auto">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === status
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : employers.length === 0 ? (
          <div className="bg-card rounded-2xl p-12 text-center shadow-card border border-border max-w-lg mx-auto my-8">
            <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg font-bold text-foreground mb-1">No Employers Found</h3>
            <p className="text-muted-foreground text-sm">No employer records match the selected filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {employers.map((emp) => (
              <div
                key={emp.id}
                className="bg-card rounded-2xl p-6 shadow-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-display text-xl font-bold text-foreground">{emp.companyName}</h3>
                    {getStatusBadge(emp.status)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-6 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      {emp.user?.email || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      {emp.user?.phone || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {emp.city || 'Delhi NCR'} ({emp.industry})
                    </span>
                    {emp.gstNumber && (
                      <span className="font-mono bg-muted px-2 py-0.5 rounded text-[11px]">
                        GST: {emp.gstNumber}
                      </span>
                    )}
                    {emp.panNumber && (
                      <span className="font-mono bg-muted px-2 py-0.5 rounded text-[11px]">
                        PAN: {emp.panNumber}
                      </span>
                    )}
                  </div>

                  {emp.rejectionReason && (
                    <p className="text-xs text-destructive bg-destructive/10 p-2 rounded-lg border border-destructive/20 mt-2">
                      <strong>Rejection Reason:</strong> {emp.rejectionReason}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto pt-4 md:pt-0 border-t md:border-t-0 border-border">
                  {emp.status !== 'APPROVED' && (
                    <Button
                      variant="cta"
                      size="sm"
                      disabled={actionId === emp.id}
                      onClick={() => handleApprove(emp.id)}
                    >
                      {actionId === emp.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-1.5" />
                          Approve
                        </>
                      )}
                    </Button>
                  )}

                  {emp.status !== 'REJECTED' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={actionId === emp.id}
                      onClick={() => handleReject(emp.id)}
                    >
                      {actionId === emp.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 mr-1.5" />
                          Reject
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEmployers;
