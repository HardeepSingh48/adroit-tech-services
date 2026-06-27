import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserLayout from '@/components/user/UserLayout';
import { apiRequest } from '@/lib/api';
import { AppJob } from '@/types/app.types';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2, Bookmark, MapPin, Briefcase, Trash2, ExternalLink } from 'lucide-react';

interface SavedJobItem {
  id: string;
  jobId: string;
  createdAt: string;
  job: AppJob;
}

export const UserSavedJobs: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [savedJobs, setSavedJobs] = useState<SavedJobItem[]>([]);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchSavedJobs = async () => {
    try {
      const res = await apiRequest<SavedJobItem[]>('/job-seekers/saved-jobs');
      if (res.success && res.data) {
        setSavedJobs(res.data);
      }
    } catch (err: unknown) {
      console.error('Error fetching saved jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleUnsave = async (jobId: string) => {
    setActionId(jobId);
    try {
      const res = await apiRequest(`/job-seekers/saved-jobs/${jobId}`, {
        method: 'DELETE',
      });
      if (res.success) {
        toast({
          title: 'Job Removed',
          description: 'Job removed from your saved list.',
        });
        fetchSavedJobs();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not unsave job.';
      toast({
        title: 'Action Failed',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setActionId(null);
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
          <h1 className="font-display text-2xl font-bold text-foreground">Saved Jobs</h1>
          <p className="text-sm text-muted-foreground mt-1">Your bookmarked positions for quick access.</p>
        </div>

        {savedJobs.length === 0 ? (
          <div className="bg-card rounded-2xl p-12 text-center shadow-card border border-border max-w-lg mx-auto my-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground mb-2">No Saved Jobs</h3>
            <p className="text-muted-foreground text-sm mb-6">You haven't bookmarked any security openings yet.</p>
            <Link to="/jobs">
              <Button variant="cta">Browse Job Directory</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedJobs.map((item) => (
              <div
                key={item.id || item.jobId}
                className="bg-card rounded-2xl p-6 shadow-card border border-border flex flex-col justify-between space-y-4 hover:border-primary/30 transition-all"
              >
                <div className="space-y-2">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {item.job?.title || 'Security Guard Position'}
                  </h3>
                  <p className="text-sm font-medium text-primary">
                    {item.job?.employer?.companyName || 'Adroit Tech Partner'}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {item.job?.city || item.job?.location || 'Delhi NCR'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5 text-primary" />
                      {item.job?.type || 'Full Time'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Link to={`/jobs/${item.jobId}`} className="flex-1">
                    <Button variant="cta" size="sm" className="w-full">
                      View Position
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive/20 hover:bg-destructive/10"
                    disabled={actionId === item.jobId}
                    onClick={() => handleUnsave(item.jobId)}
                  >
                    {actionId === item.jobId ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserSavedJobs;
