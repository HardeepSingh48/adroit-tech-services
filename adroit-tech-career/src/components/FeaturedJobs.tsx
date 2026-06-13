import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/JobCard";
import { jobs } from "@/data/jobs";
import { ArrowRight } from "lucide-react";

const FeaturedJobs = () => {
  const featuredJobs = jobs.filter((job) => job.featured).slice(0, 6);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Featured <span className="text-primary">Opportunities</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the latest security positions with competitive salaries and excellent benefits
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} featured />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/jobs">
            <Button variant="cta" size="xl" className="gap-2">
              View All Jobs
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
