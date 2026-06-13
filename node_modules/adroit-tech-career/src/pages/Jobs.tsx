import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import JobFilters from "@/components/JobFilters";
import { Button } from "@/components/ui/button";
import { jobs } from "@/data/jobs";
import { Search, SlidersHorizontal, X, Grid, List } from "lucide-react";

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    type: [] as string[],
    shift: [] as string[],
    experience: searchParams.get("experience") || "",
    salaryRange: [10000, 40000] as [number, number],
  });

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !job.title.toLowerCase().includes(query) &&
          !job.description.toLowerCase().includes(query) &&
          !job.location.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // City filter
      if (filters.city && job.city !== filters.city) return false;

      // Type filter
      if (filters.type.length > 0 && !filters.type.includes(job.type)) return false;

      // Shift filter
      if (filters.shift.length > 0 && !filters.shift.includes(job.shift)) return false;

      // Experience filter
      if (filters.experience && job.experience !== filters.experience) return false;

      // Salary range
      if (job.salaryMin < filters.salaryRange[0] || job.salaryMax > filters.salaryRange[1]) {
        return false;
      }

      return true;
    });

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
        break;
      case "salary-high":
        result.sort((a, b) => b.salaryMax - a.salaryMax);
        break;
      case "salary-low":
        result.sort((a, b) => a.salaryMin - b.salaryMin);
        break;
    }

    return result;
  }, [searchQuery, filters, sortBy]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted">
        {/* Page Header */}
        <section className="gradient-hero py-12 md:py-16">
          <div className="container">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground text-center mb-6">
              Find Your Perfect <span className="text-primary">Security Job</span>
            </h1>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs by title, keyword, or location..."
                  className="w-full pl-12 pr-4 py-4 bg-card rounded-xl shadow-card-hover focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="container py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <JobFilters filters={filters} setFilters={setFilters} />
            </aside>

            {/* Job Listings */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{filteredJobs.length}</span> jobs found
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden gap-2"
                    onClick={() => setShowMobileFilters(true)}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="salary-high">Salary: High to Low</option>
                    <option value="salary-low">Salary: Low to High</option>
                  </select>

                  {/* View Mode */}
                  <div className="hidden md:flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Jobs Grid/List */}
              {filteredJobs.length > 0 ? (
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-card rounded-xl">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    No jobs found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-secondary/80" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background overflow-y-auto animate-slide-up">
            <JobFilters
              filters={filters}
              setFilters={setFilters}
              onClose={() => setShowMobileFilters(false)}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Jobs;
