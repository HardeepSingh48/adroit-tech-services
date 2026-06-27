import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/JobCard";
import { jobs as mockJobs } from "@/data/jobs";
import { apiRequest } from "@/lib/api";
import { AppJob } from "@/types/app.types";
import { ArrowRight } from "lucide-react";

const FeaturedJobs = () => {
  const [featuredJobs, setFeaturedJobs] = useState<AppJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await apiRequest<AppJob[]>('/jobs/featured');
        if (res.success && res.data && res.data.length > 0) {
          setFeaturedJobs(res.data);
        } else {
          setFeaturedJobs(mockJobs.filter((job) => job.featured).slice(0, 6));
        }
      } catch {
        setFeaturedJobs(mockJobs.filter((job) => job.featured).slice(0, 6));
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

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
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} featured />
            ))}
          </div>
        )}

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
