import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { Building2, Factory, Hotel, Landmark, Calendar, HardHat, Shield } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Building2,
      title: "Corporate Security",
      description: "Comprehensive security solutions for corporate offices, including front desk management, staff safety, and information security. We provide trained professionals who handle inquiries while maintaining strict confidentiality.",
      link: "/services/corporate",
    },
    {
      icon: Factory,
      title: "Industrial Security",
      description: "As pioneers in industrial security management, we have proven performance at various work sites where other providers have failed. Our well-trained personnel ensure complete safety and operational continuity.",
      link: "/services/industrial",
    },
    {
      icon: Hotel,
      title: "Hotel & Hospital Security",
      description: "Safety in hotels and hospitals is paramount for guests and patients. Our specialized security services ensure a safe, comfortable environment with discreet yet effective protection.",
      link: "/services/hotel-hospital",
    },
    {
      icon: Landmark,
      title: "Bank Security",
      description: "Bank security is a critical issue requiring professional handling. Our trained personnel understand banking protocols and provide robust security management for financial institutions.",
      link: "/services/bank",
    },
    {
      icon: Building2,
      title: "Institutional Security",
      description: "Experienced in managing security for government institutions, educational facilities, and public organizations. We understand the unique requirements of institutional environments.",
      link: "/services/institutional",
    },
    {
      icon: Calendar,
      title: "Event Security",
      description: "Event security is a challenging opportunity requiring meticulous planning and execution. From small gatherings to large-scale events, we provide comprehensive security management.",
      link: "/services/event",
    },
    {
      icon: HardHat,
      title: "Construction Site Security",
      description: "Man-guarding of construction sites is one of our specializations. We protect equipment, materials, and ensure site safety with round-the-clock surveillance.",
      link: "/services/construction",
    },
  ];

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
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
              <p className="text-xl text-white/90">
                Comprehensive security solutions tailored to meet the unique needs of every industry
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard key={index} {...service} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* What Sets Us Apart */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">What Sets Us Apart</h2>
                <p className="text-muted-foreground text-lg">
                  Our commitment to excellence makes us the preferred security partner
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-card p-6 rounded-xl shadow-lg"
                >
                  <h3 className="text-xl font-semibold mb-3">Self-Motivated Guards</h3>
                  <p className="text-muted-foreground">
                    Our security personnel are carefully selected and undergo rigorous training. 
                    They are self-motivated, professional, and committed to excellence.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-card p-6 rounded-xl shadow-lg"
                >
                  <h3 className="text-xl font-semibold mb-3">Latest Security Techniques</h3>
                  <p className="text-muted-foreground">
                    We employ the latest security techniques and technologies to provide 
                    comprehensive protection and stay ahead of emerging threats.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-card p-6 rounded-xl shadow-lg"
                >
                  <h3 className="text-xl font-semibold mb-3">25 Years of Experience</h3>
                  <p className="text-muted-foreground">
                    With a legacy dating back to 1976 and formal establishment in 2001, 
                    we bring decades of expertise to every engagement.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-card p-6 rounded-xl shadow-lg"
                >
                  <h3 className="text-xl font-semibold mb-3">Pan India Presence</h3>
                  <p className="text-muted-foreground">
                    Our extensive network across India ensures consistent, reliable service 
                    delivery wherever you need us.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
