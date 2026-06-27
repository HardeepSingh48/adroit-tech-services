import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { apiRequest } from '@/lib/api';
import { AppJob } from '@/types/app.types';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2, Briefcase, Star, Trash2, MapPin, Building2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminJobs: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [jobs, setJobs] = useState<AppJob[]>([]);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      const res = await apiRequest<AppJob[]>('/admin/jobs');
      if (res.success && res.data) {
        setJobs(res.data);
      }
    } catch (err: unknown) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleFeatured = async (id: string) => {
    setActionId(id);
    try {
      const res = await apiRequest(`/admin/jobs/${id}/feature`, {
        method: 'PATCH',
      });
      if (res.success) {
        toast({
          title: 'Featured Status Updated',
          description: 'Job featured status toggled.',
        });
        fetchJobs();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not toggle featured.';
      toast({ title: 'Action Failed', description: msg, variant: 'destructive' });
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this job listing?')) return;

    setActionId(id);
    try {
      const res = await apiRequest(`/admin/jobs/${id}`, {
        method: 'DELETE',
      });
      if (res.success) {
        toast({
          title: 'Job Deleted',
          description: 'Job listing removed permanently.',
        });
        fetchJobs();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not delete job.';
      toast({ title: 'Action Failed', description: msg, variant: 'destructive' });
    } finally {
      setActionId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Job Openings Control</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage, feature, or remove job listings submitted across all employers.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-card rounded-2xl p-12 text-center shadow-card border border-border max-w-lg mx-auto my-8">
            <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg font-bold text-foreground mb-1">No Job Listings</h3>
            <p className="text-muted-foreground text-sm">There are currently no active job postings on the platform.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => {
              const isFeatured = job.isFeatured || job.featured;
              return (
                <div
                  key={job.id}
                  className="bg-card rounded-2xl p-6 shadow-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-display text-xl font-bold text-foreground">{job.title}</h3>
                      {isFeatured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          Featured Opening
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-primary" />
                        {job.employer?.companyName || 'Corporate Employer'}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {job.city || job.location || 'Delhi NCR'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5 text-primary" />
                        {job.type}
                      </span>
                      {job.createdAt && (
                        <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto pt-4 md:pt-0 border-t md:border-t-0 border-border">
                    <Link to={`/jobs/${job.id}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>

                    <Button
                      variant={isFeatured ? 'secondary' : 'cta'}
                      size="sm"
                      disabled={actionId === job.id}
                      onClick={() => handleToggleFeatured(job.id)}
                    >
                      {actionId === job.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Star className={`h-4 w-4 mr-1 ${isFeatured ? 'fill-current' : ''}`} />
                          {isFeatured ? 'Unfeature' : 'Feature'}
                        </>
                      )}
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={actionId === job.id}
                      onClick={() => handleDelete(job.id)}
                    >
                      {actionId === job.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminJobs;
