import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserLayout from '@/components/user/UserLayout';
import { apiRequest } from '@/lib/api';
import { AppApplication } from '@/types/app.types';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2, FileText, Calendar, Building2, Briefcase, XCircle, ChevronRight } from 'lucide-react';

export const UserApplications: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [applications, setApplications] = useState<AppApplication[]>([]);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      const res = await apiRequest<AppApplication[]>('/job-seekers/applications');
      if (res.success && res.data) {
        setApplications(res.data);
      }
    } catch (err: unknown) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (id: string) => {
    setActionId(id);
    try {
      const res = await apiRequest(`/job-seekers/applications/${id}/withdraw`, {
        method: 'POST',
      });
      if (res.success) {
        toast({
          title: 'Application Withdrawn',
          description: 'Your application has been withdrawn.',
        });
        fetchApplications();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not withdraw application.';
      toast({
        title: 'Action Failed',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setActionId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPLIED':
      case 'PENDING':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">Applied</span>;
      case 'SHORTLISTED':
      case 'IN_REVIEW':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">Shortlisted</span>;
      case 'HIRED':
      case 'ACCEPTED':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Hired</span>;
      case 'REJECTED':
      case 'WITHDRAWN':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">{status}</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">{status}</span>;
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">My Job Applications</h1>
          <p className="text-sm text-muted-foreground mt-1">Track the status of all positions you have applied for.</p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-card rounded-2xl p-12 text-center shadow-card border border-border max-w-lg mx-auto my-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground mb-2">No Applications Found</h3>
            <p className="text-muted-foreground text-sm mb-6">You haven't submitted any job applications yet.</p>
            <Link to="/jobs">
              <Button variant="cta">Explore Openings</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-card rounded-2xl p-6 shadow-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-primary/30"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {app.job?.title || 'Security Role'}
                    </h3>
                    {getStatusBadge(app.status)}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4 text-primary" />
                      {app.job?.employer?.companyName || 'Adroit Partner Employer'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      Applied: {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto pt-2 md:pt-0">
                  {app.jobId && (
                    <Link to={`/jobs/${app.jobId}`}>
                      <Button variant="outline" size="sm">
                        View Job Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  )}

                  {app.status !== 'WITHDRAWN' && app.status !== 'REJECTED' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      disabled={actionId === app.id}
                      onClick={() => handleWithdraw(app.id)}
                    >
                      {actionId === app.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 mr-1" />
                          Withdraw
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
    </UserLayout>
  );
};

export default UserApplications;
