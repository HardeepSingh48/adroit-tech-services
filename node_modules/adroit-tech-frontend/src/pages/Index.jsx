import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import ContactForm from "@/components/ContactForm";
import { Building2, Factory, Hotel, Landmark, Calendar, HardHat, Shield, Clock, Award } from "lucide-react";

const Index = () => {
  const { ref: servicesRef, inView: servicesInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { ref: whyUsRef, inView: whyUsInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const services = [
    {
      icon: Building2,
      title: "Corporate Security",
      description: "Comprehensive security solutions for corporate offices, including front desk management and staff safety.",
      link: "/services/corporate",
    },
    {
      icon: Factory,
      title: "Industrial Security",
      description: "Proven expertise in managing industrial security with well-trained professionals.",
      link: "/services/industrial",
    },
    {
      icon: Hotel,
      title: "Hotel & Hospital Security",
      description: "Specialized security services ensuring safety and comfort for guests and patients.",
      link: "/services/hotel-hospital",
    },
    {
      icon: Landmark,
      title: "Bank Security",
      description: "Professional security management for banking institutions with strict protocols.",
      link: "/services/bank",
    },
    {
      icon: Building2,
      title: "Institutional Security",
      description: "Experienced in managing security for government and educational institutions.",
      link: "/services/institutional",
    },
    {
      icon: Calendar,
      title: "Event Security",
      description: "Comprehensive event security management for gatherings of all sizes.",
      link: "/services/event",
    },
    {
      icon: HardHat,
      title: "Construction Site Security",
      description: "Specialized man-guarding services for construction sites and work zones.",
      link: "/services/construction",
    },
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: "25+ Years Experience",
      description: "Established in 2001 with a legacy dating back to 1976 through ISA.",
    },
    {
      icon: Award,
      title: "Certified Professionals",
      description: "All guards are licensed, trained, and certified security professionals.",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Round-the-clock security services with immediate response capability.",
    },
    {
      icon: Building2,
      title: "Pan India Presence",
      description: "Comprehensive coverage across India with multiple regional offices.",
    },
  ];
  const clients = [
    { name: "Bhushan Steel", logo: "/assets/images/clients/Bhushan-Steel-logo-01.png" },
    { name: "Emami", logo: "/assets/images/clients/Emami.jpeg" },
    { name: "HCC", logo: "/assets/images/clients/HCC.png" },
    { name: "Jusco", logo: "/assets/images/clients/Jusco.png" },
    { name: "L&T", logo: "/assets/images/clients/L&T.png" },
    { name: "Navayuga", logo: "/assets/images/clients/Navayuga.png" },
    { name: "NCC", logo: "/assets/images/clients/ncc.jpg" },
    { name: "Tata Steel", logo: "/assets/images/clients/TataSteel.png" },
    { name: "Visa Steel", logo: "/assets/images/clients/VisaSteel.jpg" },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <Hero />

        {/* Services Section */}
        <section ref={servicesRef} className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={servicesInView ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Comprehensive security solutions tailored to your specific needs across various sectors
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard key={index} {...service} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section ref={whyUsRef} className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={whyUsInView ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Adroit Tech?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We are committed to providing the highest standards of security services
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChooseUs.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={whyUsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Clients Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Clients</h2>
              <p className="text-muted-foreground text-lg">
                We believe in long-term relationships with our valued clients
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {clients.map((client, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center min-h-[120px]"
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="w-full h-24 object-contain"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <ContactForm />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
