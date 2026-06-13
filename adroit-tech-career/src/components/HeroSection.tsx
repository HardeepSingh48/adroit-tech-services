import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Briefcase, Shield } from "lucide-react";
import { cities, experienceLevels } from "@/data/jobs";

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (location) params.set("city", location);
    if (experience) params.set("experience", experience);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] gradient-hero overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/5 rounded-full" />
      </div>

      {/* Shield Pattern */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-5">
        <Shield className="w-full h-full" />
      </div>

      <div className="container relative z-10 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-primary-foreground text-sm font-medium">
              Trusted by 45+ Companies
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-slide-up">
            Join{" "}
            <span className="text-primary relative">
              Adroit Tech Services
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
              >
                <path
                  d="M2 10C50 4 150 2 298 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="text-primary"
                />
              </svg>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Your Career Starts Here. Join 5,000+ Security Professionals. 
            Find the best security jobs across Delhi NCR with competitive salaries and benefits.
          </p>

          {/* Search Box */}
          <div className="bg-card/95 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 shadow-card-hover animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Job Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Location */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground appearance-none cursor-pointer"
                >
                  <option value="">All Locations</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience */}
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground appearance-none cursor-pointer"
                >
                  <option value="">Experience</option>
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <Button
                variant="hero"
                size="xl"
                onClick={handleSearch}
                className="w-full"
              >
                <Search className="h-5 w-5 mr-2" />
                Search Jobs
              </Button>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">Popular:</span>
              {["Security Guard", "Watchman", "Bouncer", "CCTV Operator"].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      navigate(`/jobs?q=${term}`);
                    }}
                    className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "150+", label: "Active Jobs" },
              { value: "8,500+", label: "Applications" },
              { value: "3,200+", label: "Hired" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          className="w-full h-16 md:h-24"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
