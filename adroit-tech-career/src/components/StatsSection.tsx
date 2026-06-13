import { Shield, Users, Building, Award } from "lucide-react";
import { stats } from "@/data/jobs";

const StatsSection = () => {
  const statItems = [
    {
      icon: Shield,
      value: stats.activeJobs + "+",
      label: "Active Job Openings",
      description: "Find your perfect security role",
    },
    {
      icon: Users,
      value: stats.totalApplications.toLocaleString() + "+",
      label: "Applications Received",
      description: "Trusted by job seekers",
    },
    {
      icon: Award,
      value: stats.candidatesHired.toLocaleString() + "+",
      label: "Successfully Hired",
      description: "Careers transformed",
    },
    {
      icon: Building,
      value: stats.companiesServed + "+",
      label: "Companies Served",
      description: "Pan Delhi NCR coverage",
    },
  ];

  return (
    <section className="py-16 md:py-20 gradient-hero relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {statItems.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/20 mb-4 group-hover:bg-primary/30 transition-colors">
                <stat.icon className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              </div>
              <div className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-primary-foreground font-medium mb-1">
                {stat.label}
              </div>
              <div className="text-muted-foreground text-sm hidden md:block">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
