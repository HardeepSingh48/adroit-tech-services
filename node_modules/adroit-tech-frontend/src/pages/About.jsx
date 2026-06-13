import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Target, Award, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary to-primary/90 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About Adroit Tech Services</h1>
              <p className="text-xl text-white/90">
                Building trust through excellence in security services since 2001
              </p>
            </motion.div>
          </div>
        </section>

        {/* Company History */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p className="mb-4">
                    Adriot Tech Services was established in 2001 by the promoters of 
                    Industrial Security Agency (ISA), which has been serving the market since 1976. With 
                    this rich legacy spanning over 25 years, Adroit Tech has emerged as one of the leading brands 
                    in the security solutions industry with a pan-India presence.
                  </p>
                  <p className="mb-4">
                    With vast experience in industrial security management, residential security, fire 
                    fighting, and security consultancy, Adroit Tech has built excellent proven records across 
                    various segments. We specialize in outsourced business processes where safety and 
                    security are the primary goals.
                  </p>
                  <p>
                    The company strategically manages its human resources to ensure complete satisfaction 
                    to its customers. Through our effective human resource policy, Adroit Tech has been able to 
                    retain talented staff with a huge workforce, ensuring long-term relationships for the future.
                  </p>
<motion.div 
  className="my-8 rounded-xl overflow-hidden shadow-lg"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.5 }}
>
  <img src="/assets/images/guard-corporate-building.png" alt="Adroit Tech Guard at a corporate building" className="w-full h-auto object-cover" />
</motion.div>
                </div>
              </motion.div>

              {/* Values Grid */}
              <div className="grid md:grid-cols-2 gap-8 mt-16">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-card p-8 rounded-xl shadow-lg"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To provide world-class security services that protect our clients' assets, people, 
                    and reputation through innovative solutions and highly trained professionals.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-card p-8 rounded-xl shadow-lg"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
                  <p className="text-muted-foreground">
                    To be India's most trusted and respected security services provider, setting industry 
                    standards for excellence, reliability, and customer satisfaction.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Awards Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Recognition & Awards</h2>
              </div>
              
              <div className="bg-gradient-to-br from-primary to-primary/90 text-white p-12 rounded-2xl shadow-xl">
                <div className="grid md:grid-cols-2 items-center gap-8">
                  <motion.div
                    className="rounded-xl overflow-hidden shadow-lg"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <img src="/assets/images/award-ceremony.png" alt="Receiving the Bharat Gaurav Award" className="w-full h-auto object-cover" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-2xl font-bold mb-3">Bharat Gaurav Award - Gold Medal</h3>
                    <p className="text-white/90">
                      Presented by World Economic Progress Society, New Delhi. This prestigious award
                      was given to our Director for his indispensable contribution to society and
                      excellence in the security services industry.
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Key Statistics */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
                <p className="text-muted-foreground text-lg">Numbers that reflect our commitment to excellence</p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { number: "25+", label: "Years of Experience" },
                  { number: "1000+", label: "Satisfied Clients" },
                  { number: "500+", label: "Security Personnel" },
                  { number: "100%", label: "Client Retention" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">
                      {stat.number}
                    </div>
                    <div className="text-muted-foreground font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
