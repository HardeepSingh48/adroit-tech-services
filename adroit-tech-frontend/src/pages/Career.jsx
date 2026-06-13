import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Briefcase, MapPin, Mail } from "lucide-react";

const Career = () => {
  const jobOpenings = [
    {
      title: "Security Guard",
      location: "Jamshedpur, Jharkhand",
      type: "Full-time",
    },
    {
      title: "Security Supervisor",
      location: "Gurugram, Haryana",
      type: "Full-time",
    },
    {
      title: "Area Manager",
      location: "New Delhi",
      type: "Full-time",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary to-primary/90 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: "40px 40px",
              }}
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Join Our Team
              </h1>
              <p className="text-xl text-white/90">
                Build your career with a leading name in the security industry.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Job Openings */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Current Openings
              </h2>
              <p className="text-muted-foreground text-lg">
                Explore exciting opportunities to grow with us.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {jobOpenings.map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 rounded-lg flex items-center justify-center mb-4">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{job.title}</h3>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    <span>{job.type}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* How to Apply */}
            <div className="text-center mt-16">
              <h3 className="text-2xl font-bold mb-4">How to Apply</h3>
              <p className="text-muted-foreground text-lg mb-6">
                Visit our Career Portal to view open positions, register your profile, and apply for jobs online.
              </p>
              <a
                href="/portal"
                className="inline-flex items-center justify-center bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                <span>Open Career Portal</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Career;