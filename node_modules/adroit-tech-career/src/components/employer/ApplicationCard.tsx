import { Application } from "@/data/employers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Mail,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  User,
} from "lucide-react";

interface ApplicationCardProps {
  application: Application;
  jobTitle?: string;
  onView?: () => void;
  onShortlist?: () => void;
  onReject?: () => void;
}

const statusColors = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  shortlisted: "bg-primary/10 text-primary border-primary/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  interviewed: "bg-amber-100 text-amber-800 border-amber-200",
  hired: "bg-green-100 text-green-800 border-green-200",
};

const statusLabels = {
  new: "New",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  interviewed: "Interviewed",
  hired: "Hired",
};

const ApplicationCard = ({
  application,
  jobTitle,
  onView,
  onShortlist,
  onReject,
}: ApplicationCardProps) => {
  return (
    <div className="bg-card rounded-xl p-5 border-2 border-border hover:border-primary/30 transition-all shadow-card">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
          {application.candidatePhoto ? (
            <img
              src={application.candidatePhoto}
              alt={application.candidateName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground truncate">
                {application.candidateName}
              </h3>
              {jobTitle && (
                <p className="text-sm text-muted-foreground">Applied for: {jobTitle}</p>
              )}
            </div>
            <Badge className={statusColors[application.status]}>
              {statusLabels[application.status]}
            </Badge>
          </div>

          <div className="space-y-1 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <a href={`tel:${application.candidatePhone}`} className="hover:text-primary">
                {application.candidatePhone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <a href={`mailto:${application.candidateEmail}`} className="hover:text-primary truncate">
                {application.candidateEmail}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm mb-4">
            <span className="px-2 py-1 bg-muted rounded text-foreground">
              {application.experience}
            </span>
            <span className="px-2 py-1 bg-muted rounded text-foreground">
              {application.availability}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onView}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            {application.status !== "shortlisted" && application.status !== "hired" && (
              <Button variant="cta" size="sm" onClick={onShortlist}>
                <CheckCircle className="h-4 w-4 mr-1" />
                Shortlist
              </Button>
            )}
            {application.status !== "rejected" && application.status !== "hired" && (
              <Button variant="ghost" size="sm" onClick={onReject} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
