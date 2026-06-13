import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Briefcase, IndianRupee, Calendar, Star } from "lucide-react";
import { Job } from "@/data/jobs";

interface JobCardProps {
  job: Job;
  featured?: boolean;
}

const JobCard = ({ job, featured }: JobCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div className={`card-job rounded-xl p-5 md:p-6 relative group ${featured ? "border-primary" : ""}`}>
      {/* Featured Badge */}
      {featured && (
        <div className="absolute -top-3 left-4">
          <Badge className="bg-primary text-primary-foreground gap-1">
            <Star className="h-3 w-3" fill="currentColor" />
            Featured
          </Badge>
        </div>
      )}

      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm">{job.location}</span>
            </div>
          </div>
          <Badge variant="outline" className="shrink-0">
            {job.type}
          </Badge>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IndianRupee className="h-4 w-4 text-primary" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>{job.shift} Shift</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4 text-primary" />
            <span>{job.experience}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formatDate(job.postedDate)}</span>
          </div>
        </div>

        {/* Description Preview */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
          {job.description}
        </p>

        {/* Actions */}
        <div className="flex gap-3 mt-auto">
          <Link to={`/jobs/${job.id}`} className="flex-1">
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              View Details
            </Button>
          </Link>
          <Link to={`/jobs/${job.id}#apply`}>
            <Button variant="cta">Apply Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
