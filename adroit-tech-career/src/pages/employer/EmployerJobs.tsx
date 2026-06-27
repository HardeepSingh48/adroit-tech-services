import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EmployerLayout from "@/components/employer/EmployerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { AppJob } from "@/types/app.types";
import {
  Search,
  Plus,
  Eye,
  XCircle,
  Users,
  MapPin,
  IndianRupee,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EmployerJobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [myJobs, setMyJobs] = useState<AppJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await apiRequest<AppJob[]>('/employers/jobs');
      if (res.success && res.data) {
        setMyJobs(res.data);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = myJobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.city || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || (job.status || '').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleCloseJob = async (id: string) => {
    try {
      await apiRequest(`/jobs/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'CLOSED' }),
      });
      toast({
        title: "Job Closed",
        description: "The job listing status has been changed to CLOSED.",
      });
      fetchJobs();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not close job.";
      toast({
        title: "Update Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800 border-green-200",
    CLOSED: "bg-muted text-muted-foreground border-border",
    DRAFT: "bg-amber-100 text-amber-800 border-amber-200",
  };

  return (
    <EmployerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Your Jobs
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage all your job listings
            </p>
          </div>
          <Link to="/employer/post-job">
            <Button variant="cta" size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border-2 border-border p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "active", "closed", "draft"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    statusFilter === status
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-card rounded-xl border-2 border-border hover:border-primary/30 transition-all p-5"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display text-xl font-bold text-foreground">
                            {job.title}
                          </h3>
                          <Badge className={statusColors[job.status || 'ACTIVE'] || statusColors.ACTIVE}>
                            {job.status}
                          </Badge>
                          {job.isFeatured && (
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />
                            ₹{job.salaryMin?.toLocaleString()} - ₹{job.salaryMax?.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {job.applicationCount || 0} applications
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/jobs/${job.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link to={`/employer/applications?job=${job.id}`}>
                      <Button variant="cta" size="sm">
                        <Users className="h-4 w-4 mr-1" />
                        Applications
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover">
                        {job.status === "ACTIVE" && (
                          <DropdownMenuItem
                            onClick={() => handleCloseJob(job.id)}
                            className="text-destructive"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Close Job
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-card rounded-xl border-2 border-border p-12 text-center">
              <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                No jobs found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Start by posting your first job"}
              </p>
              <Link to="/employer/post-job">
                <Button variant="cta">
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </EmployerLayout>
  );
};

export default EmployerJobs;
