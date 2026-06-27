import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EmployerLayout from "@/components/employer/EmployerLayout";
import StatsCard from "@/components/employer/StatsCard";
import ApplicationCard from "@/components/employer/ApplicationCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/api";
import { AppJob, AppApplication } from "@/types/app.types";
import {
  Briefcase,
  Users,
  CheckCircle,
  Trophy,
  Plus,
  ArrowRight,
  Eye,
} from "lucide-react";

interface StatsData {
  activeJobs: number;
  totalApplications: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    hiredThisMonth: 0,
  });
  const [recentApplications, setRecentApplications] = useState<AppApplication[]>([]);
  const [activeJobs, setActiveJobs] = useState<AppJob[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, jobsRes, appsRes] = await Promise.all([
          apiRequest<StatsData>('/employers/dashboard/stats').catch(() => null),
          apiRequest<AppJob[]>('/employers/jobs').catch(() => null),
          apiRequest<AppApplication[]>('/employers/applications').catch(() => null),
        ]);

        if (statsRes?.success && statsRes.data) {
          setStats({
            activeJobs: statsRes.data.activeJobs || 0,
            totalApplications: statsRes.data.totalApplications || 0,
            shortlisted: 0,
            hiredThisMonth: 0,
          });
        }

        if (jobsRes?.success && jobsRes.data) {
          setActiveJobs(jobsRes.data.slice(0, 3));
        }

        if (appsRes?.success && appsRes.data) {
          setRecentApplications(appsRes.data.slice(0, 4));
        }
      } catch {
        // ignore
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <EmployerLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Welcome back!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your job listings.
            </p>
          </div>
          <Link to="/employer/post-job">
            <Button variant="cta" size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Active Jobs"
            value={stats.activeJobs}
            icon={Briefcase}
          />
          <StatsCard
            title="Total Applications"
            value={stats.totalApplications}
            icon={Users}
          />
          <StatsCard
            title="Shortlisted"
            value={stats.shortlisted}
            icon={CheckCircle}
          />
          <StatsCard
            title="Hired This Month"
            value={stats.hiredThisMonth}
            icon={Trophy}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <div className="bg-card rounded-xl border-2 border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-foreground">
                Recent Applications
              </h2>
              <Link to="/employer/applications">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            {recentApplications.length > 0 ? (
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={{
                      id: application.id,
                      candidateName: application.jobSeeker?.fullName || 'Candidate',
                      candidateEmail: application.jobSeeker?.user?.email || '',
                      candidatePhone: application.jobSeeker?.user?.phone || '',
                      status: application.status.toLowerCase(),
                      appliedDate: new Date(application.createdAt).toLocaleDateString(),
                    }}
                    jobTitle={application.job?.title}
                    onView={() => {}}
                    onShortlist={() => {}}
                    onReject={() => {}}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground py-4 text-center">No recent applications found.</p>
            )}
          </div>

          {/* Active Jobs */}
          <div className="bg-card rounded-xl border-2 border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-foreground">
                My Posted Jobs
              </h2>
              <Link to="/employer/jobs">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            {activeJobs.length > 0 ? (
              <div className="space-y-4">
                {activeJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-lg border border-border hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display font-bold text-foreground">
                          {job.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {job.city} • {job.type}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        {job.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {job.applicationCount || 0} applications
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Link to={`/jobs/${job.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Listing
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground py-4 text-center">No active jobs posted yet.</p>
            )}
          </div>
        </div>
      </div>
    </EmployerLayout>
  );
};

export default Dashboard;
