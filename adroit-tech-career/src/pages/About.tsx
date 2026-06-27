import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { Shield, Users, Award, Target, Clock, TrendingUp } from "lucide-react";

const About = () => {
  const milestones = [
    { year: "2010", title: "Founded", description: "Adroit Tech Services established in Delhi NCR" },
    { year: "2015", title: "1000+ Guards", description: "Reached milestone of 1000 trained security personnel" },
    { year: "2018", title: "Expansion", description: "Extended operations to Noida and Gurgaon" },
    { year: "2022", title: "Award", description: "Best Security Services Provider - NCR" },
    { year: "2024", title: "5000+ Team", description: "Growing strong with 5000+ security professionals" },
  ];

  const values = [
    {
      icon: Shield,
      title: "Integrity",
      description: "We uphold the highest standards of honesty and ethical conduct in all our operations.",
    },
    {
      icon: Users,
      title: "Teamwork",
      description: "We believe in collaborative effort and supporting each other to achieve excellence.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for continuous improvement and delivering exceptional security services.",
    },
    {
      icon: Target,
      title: "Commitment",
      description: "We are dedicated to protecting our clients' assets and ensuring their peace of mind.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-hero py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          </div>
          <div className="container relative z-10">
            <div className="max-w-3xl">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                About <span className="text-primary">Adroit Tech Services</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Adroit Tech Services is a leading security services company 
                serving Delhi NCR since 2010. We provide trained, professional security 
                personnel for residential, commercial, and industrial establishments.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our Mission
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  To provide reliable, professional security services while creating meaningful 
                  employment opportunities for individuals seeking careers in the security industry. 
                  We are committed to training and empowering our workforce to deliver excellence.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-muted rounded-xl">
                    <div className="font-display text-3xl font-bold text-primary mb-1">14+</div>
                    <div className="text-sm text-muted-foreground">Years Experience</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-xl">
                    <div className="font-display text-3xl font-bold text-primary mb-1">5000+</div>
                    <div className="text-sm text-muted-foreground">Security Personnel</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-xl">
                    <div className="font-display text-3xl font-bold text-primary mb-1">45+</div>
                    <div className="text-sm text-muted-foreground">Corporate Clients</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-xl">
                    <div className="font-display text-3xl font-bold text-primary mb-1">98%</div>
                    <div className="text-sm text-muted-foreground">Client Retention</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-primary/20 rounded-2xl p-8 md:p-12">
                  <Shield className="h-32 w-32 text-primary mx-auto mb-6 opacity-80" />
                  <h3 className="font-display text-2xl font-bold text-primary-foreground text-center mb-4">
                    "Securing Tomorrow, Today"
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Our tagline reflects our commitment to proactive security solutions 
                    and building a safer future for our clients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-20 bg-muted">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Core Values
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                The principles that guide everything we do at Adroit Tech Services
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 text-center group"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
                    <value.icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Journey
              </h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 -translate-x-1/2" />
                
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.year}
                    className={`relative flex items-center gap-6 mb-8 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center z-10 flex-shrink-0">
                      <Clock className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className={`flex-1 bg-card rounded-xl p-5 shadow-card ${
                      index % 2 === 0 ? "md:mr-auto md:ml-0" : "md:ml-auto md:mr-0"
                    } md:max-w-[calc(50%-2rem)]`}>
                      <div className="font-display text-primary font-bold mb-1">
                        {milestone.year}
                      </div>
                      <div className="font-bold text-foreground mb-1">
                        {milestone.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {milestone.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Career Growth */}
        <section className="py-16 md:py-20 gradient-hero">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Career Growth at Adroit Tech Services
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Clear progression paths for every security professional
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              {[
                "Security Guard",
                "Senior Guard",
                "Team Leader",
                "Supervisor",
                "Manager",
              ].map((role, index) => (
                <div key={role} className="flex items-center gap-4">
                  <div className="bg-card rounded-xl px-6 py-4 shadow-card text-center">
                    <div className="font-display font-bold text-foreground">{role}</div>
                  </div>
                  {index < 4 && (
                    <TrendingUp className="h-6 w-6 text-primary hidden md:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
