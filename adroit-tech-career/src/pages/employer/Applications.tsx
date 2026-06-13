import { useState } from "react";
import EmployerLayout from "@/components/employer/EmployerLayout";
import ApplicationCard from "@/components/employer/ApplicationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockApplications } from "@/data/employers";
import { jobs } from "@/data/jobs";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  Filter,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";

const statusFilters = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interviewed", label: "Interviewed" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

const Applications = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("");

  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch = app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesJob = !jobFilter || app.jobId === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const stats = {
    total: mockApplications.length,
    new: mockApplications.filter((a) => a.status === "new").length,
    shortlisted: mockApplications.filter((a) => a.status === "shortlisted").length,
    pending: mockApplications.filter((a) => a.status === "new" || a.status === "interviewed").length,
  };

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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Applications
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage all job applications in one place
            </p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <Users className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Applications</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.new}</p>
            <p className="text-sm text-muted-foreground">New Applications</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.shortlisted}</p>
            <p className="text-sm text-muted-foreground">Shortlisted</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <XCircle className="h-6 w-6 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border-2 border-border p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className="h-11 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              >
                <option value="">All Jobs</option>
                {jobs.slice(0, 5).map((job) => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              >
                {statusFilters.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {statusFilters.map((status) => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  statusFilter === status.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                }`}
              >
                {status.label}
                {status.value !== "all" && (
                  <span className="ml-1">
                    ({mockApplications.filter((a) => a.status === status.value).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                jobTitle={jobs.find((j) => j.id === application.jobId)?.title}
                onView={() => {}}
                onShortlist={() => handleShortlist(application.id)}
                onReject={() => handleReject(application.id)}
              />
            ))
          ) : (
            <div className="bg-card rounded-xl border-2 border-border p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                No applications found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </EmployerLayout>
  );
};

export default Applications;
