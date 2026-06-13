import { Link } from "react-router-dom";
import EmployerLayout from "@/components/employer/EmployerLayout";
import StatsCard from "@/components/employer/StatsCard";
import ApplicationCard from "@/components/employer/ApplicationCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockApplications } from "@/data/employers";
import { jobs } from "@/data/jobs";
import {
  Briefcase,
  Users,
  CheckCircle,
  Trophy,
  Plus,
  ArrowRight,
  Eye,
  Edit,
  XCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const stats = {
    activeJobs: 8,
    totalApplications: mockApplications.length,
    shortlisted: mockApplications.filter((a) => a.status === "shortlisted").length,
    hiredThisMonth: mockApplications.filter((a) => a.status === "hired").length,
  };

  const recentApplications = mockApplications.slice(0, 4);
  const activeJobs = jobs.slice(0, 3);

  const handleShortlist = (id: string) => {
    toast({
      title: "Candidate Shortlisted",
      description: "The candidate has been moved to shortlisted.",
    });
  };

  const handleReject = (id: string) => {
    toast({
      title: "Application Rejected",
      description: "The application has been rejected.",
    });
  };

  return (
    <EmployerLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Welcome back, ABC Securities!
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
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Total Applications"
            value={stats.totalApplications}
            icon={Users}
            trend={{ value: 25, isPositive: true }}
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
            trend={{ value: 8, isPositive: true }}
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
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  jobTitle={jobs.find((j) => j.id === application.jobId)?.title}
                  onView={() => {}}
                  onShortlist={() => handleShortlist(application.id)}
                  onReject={() => handleReject(application.id)}
                />
              ))}
            </div>
          </div>

          {/* Active Jobs */}
          <div className="bg-card rounded-xl border-2 border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-foreground">
                Active Jobs
              </h2>
              <Link to="/employer/jobs">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
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
                        {job.location} • {job.type}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {Math.floor(Math.random() * 20) + 5} applications
                    </span>
                    <span>Posted: {job.postedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Link to={`/jobs/${job.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <XCircle className="h-4 w-4 mr-1" />
                      Close
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </EmployerLayout>
  );
};

export default Dashboard;
