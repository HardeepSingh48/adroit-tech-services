import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApplicationForm from "@/components/ApplicationForm";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { jobs } from "@/data/jobs";
import {
  MapPin,
  Clock,
  Briefcase,
  IndianRupee,
  Calendar,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle,
  Phone,
  MessageCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const JobDetail = () => {
  const { id } = useParams();
  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              Job Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/jobs">
              <Button variant="cta">Browse All Jobs</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const similarJobs = jobs
    .filter((j) => j.id !== job.id && j.city === job.city)
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Job link has been copied to clipboard.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Job Saved!",
      description: "This job has been added to your saved jobs.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted">
        {/* Breadcrumb */}
        <div className="bg-card border-b border-border">
          <div className="container py-4">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Link>
          </div>
        </div>

        <div className="container py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Job Header */}
              <div className="bg-card rounded-xl p-6 md:p-8 shadow-card mb-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="text-primary border-primary">
                        {job.type}
                      </Badge>
                      <Badge variant="secondary">{job.shift} Shift</Badge>
                    </div>
                    <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                      {job.title}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>{job.location}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share2 className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleSave}>
                      <Bookmark className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IndianRupee className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Salary</p>
                      <p className="font-semibold text-foreground text-sm">{job.salary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Shift</p>
                      <p className="font-semibold text-foreground text-sm">{job.shift}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Experience</p>
                      <p className="font-semibold text-foreground text-sm">{job.experience}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Posted</p>
                      <p className="font-semibold text-foreground text-sm">
                        {new Date(job.postedDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-card rounded-xl p-6 md:p-8 shadow-card mb-6">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  Job Description
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {job.description}
                </p>

                <h3 className="font-display text-lg font-bold text-foreground mb-3">
                  Responsibilities
                </h3>
                <ul className="space-y-2 mb-6">
                  {job.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="font-display text-lg font-bold text-foreground mb-3">
                  Requirements
                </h3>
                <ul className="space-y-2 mb-6">
                  {job.requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="font-display text-lg font-bold text-foreground mb-3">
                  Benefits
                </h3>
                <ul className="space-y-2">
                  {job.benefits.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Application Form */}
              <div id="apply" className="bg-card rounded-xl p-6 md:p-8 shadow-card">
                <h2 className="font-display text-xl font-bold text-foreground mb-6">
                  Apply for this Position
                </h2>
                <ApplicationForm jobTitle={job.title} jobId={job.id} />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-80 space-y-6">
              {/* Quick Apply */}
              <div className="bg-card rounded-xl p-6 shadow-card sticky top-24">
                <h3 className="font-display text-lg font-bold text-foreground mb-4">
                  Quick Contact
                </h3>
                <div className="space-y-3">
                  <a href="tel:+911234567890" className="block">
                    <Button variant="cta" className="w-full gap-2">
                      <Phone className="h-4 w-4" />
                      Call Now
                    </Button>
                  </a>
                  <a
                    href="https://wa.me/911234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="ctaSecondary" className="w-full gap-2">
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </Button>
                  </a>
                </div>
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Or scroll down to fill the application form
                </p>
              </div>

              {/* Similar Jobs */}
              {similarJobs.length > 0 && (
                <div className="bg-card rounded-xl p-6 shadow-card">
                  <h3 className="font-display text-lg font-bold text-foreground mb-4">
                    Similar Jobs
                  </h3>
                  <div className="space-y-4">
                    {similarJobs.map((j) => (
                      <Link
                        key={j.id}
                        to={`/jobs/${j.id}`}
                        className="block p-4 bg-muted rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        <h4 className="font-semibold text-foreground mb-1">
                          {j.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {j.location}
                        </p>
                        <p className="text-sm text-primary font-medium mt-1">
                          {j.salary}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetail;
