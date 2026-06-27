import { useState, useEffect } from "react";
import EmployerLayout from "@/components/employer/EmployerLayout";
import ApplicationCard from "@/components/employer/ApplicationCard";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { AppApplication } from "@/types/app.types";
import {
  Search,
  Users,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const statusFilters = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interviewed", label: "Interviewed" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

const Applications = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [applications, setApplications] = useState<AppApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const res = await apiRequest<AppApplication[]>('/employers/applications');
      if (res.success && res.data) {
        setApplications(res.data);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const filteredApplications = applications.filter((app) => {
    const candidateName = app.jobSeeker?.fullName || 'Candidate';
    const candidateEmail = app.jobSeeker?.user?.email || '';
    const matchesSearch = candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidateEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await apiRequest(`/employers/applications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      toast({
        title: "Status Updated",
        description: `Application status moved to ${newStatus}.`,
      });
      fetchApps();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not update status.";
      toast({
        title: "Update Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const stats = {
    total: applications.length,
    submitted: applications.filter((a) => a.status === "SUBMITTED").length,
    shortlisted: applications.filter((a) => a.status === "SHORTLISTED").length,
    hired: applications.filter((a) => a.status === "HIRED").length,
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
            <p className="text-2xl font-bold text-foreground">{stats.submitted}</p>
            <p className="text-sm text-muted-foreground">Submitted</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.shortlisted}</p>
            <p className="text-sm text-muted-foreground">Shortlisted</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <XCircle className="h-6 w-6 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.hired}</p>
            <p className="text-sm text-muted-foreground">Hired</p>
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
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredApplications.length > 0 ? (
            filteredApplications.map((application) => (
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
                onShortlist={() => handleUpdateStatus(application.id, 'SHORTLISTED')}
                onReject={() => handleUpdateStatus(application.id, 'REJECTED')}
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
