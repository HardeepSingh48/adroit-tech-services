import { 
  Wallet, 
  GraduationCap, 
  Heart, 
  TrendingUp, 
  Clock, 
  Shield 
} from "lucide-react";

const WhyJoinSection = () => {
  const benefits = [
    {
      icon: Wallet,
      title: "Competitive Salary",
      description: "Earn attractive pay with regular increments, bonuses, and overtime compensation.",
    },
    {
      icon: Heart,
      title: "ESI & PF Benefits",
      description: "Complete health coverage and retirement benefits for you and your family.",
    },
    {
      icon: GraduationCap,
      title: "Free Training",
      description: "Professional security training provided at no cost to enhance your skills.",
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Clear promotion paths from Guard to Supervisor and Management roles.",
    },
    {
      icon: Clock,
      title: "Flexible Shifts",
      description: "Choose from day, night, or rotational shifts based on your preference.",
    },
    {
      icon: Shield,
      title: "Job Security",
      description: "Stable employment with India's growing security industry leader.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Why Join <span className="text-primary">Adroit Tech Services?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We take care of our team members with industry-leading benefits and growth opportunities
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="bg-card rounded-xl p-6 md:p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group border-2 border-transparent hover:border-primary/20"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <benefit.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyJoinSection;
