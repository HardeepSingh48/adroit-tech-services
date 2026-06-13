import { useState } from "react";
import { Link } from "react-router-dom";
import EmployerLayout from "@/components/employer/EmployerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { jobs } from "@/data/jobs";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  Plus,
  Eye,
  Edit,
  XCircle,
  Copy,
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
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "closed" | "draft">("all");

  // Add status to jobs for demo
  const jobsWithStatus = jobs.map((job, index) => ({
    ...job,
    status: index % 3 === 0 ? "closed" : index % 5 === 0 ? "draft" : "active" as "active" | "closed" | "draft",
    applications: Math.floor(Math.random() * 30) + 5,
  }));

  const filteredJobs = jobsWithStatus.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCloseJob = (id: string) => {
    toast({
      title: "Job Closed",
      description: "The job listing has been closed.",
    });
  };

  const handleDuplicate = (id: string) => {
    toast({
      title: "Job Duplicated",
      description: "A copy of the job has been created as a draft.",
    });
  };

  const statusColors = {
    active: "bg-green-100 text-green-800 border-green-200",
    closed: "bg-muted text-muted-foreground border-border",
    draft: "bg-amber-100 text-amber-800 border-amber-200",
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
          {filteredJobs.length > 0 ? (
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
                          <Badge className={statusColors[job.status]}>
                            {job.status}
                          </Badge>
                          {job.featured && (
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />
                            {job.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {job.applications} applications
                          </span>
                          <span>Posted: {job.postedDate}</span>
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
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Job
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(job.id)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        {job.status === "active" && (
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
