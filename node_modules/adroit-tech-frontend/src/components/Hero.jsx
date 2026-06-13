import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const stats = [
    { icon: Users, value: "25+", label: "Years Experience" },
    { icon: Shield, value: "1000+", label: "Clients Served" },
    { icon: CheckCircle, value: "500+", label: "Active Guards" },
    { icon: Award, value: "100%", label: "Client Satisfaction" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block bg-secondary/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            >
              <span className="text-secondary font-semibold">Professional Security Solutions</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              Your Trusted Partner in{" "}
              <span className="text-secondary">Security Excellence</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl mb-8 text-white/90"
            >
              With over 25 years of experience, Adroit Tech provides comprehensive security solutions
              across corporate, industrial, and institutional sectors throughout India.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/services">
                <Button
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-white transition-all duration-300 hover:scale-110 hover:shadow-xl font-semibold px-8"
                >
                  Our Services
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-black hover:bg-white hover:text-primary font-semibold px-8 transition-all duration-300 hover:scale-110 hover:shadow-xl"
                >
                  Contact Us
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-secondary" />
                  <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>


          {/* Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            {/* Decorative Background Circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[450px] h-[450px] rounded-full bg-gradient-to-br from-secondary/30 to-secondary/10 blur-3xl" />
            </div>
            
            {/* Main Image Container */}
            <div className="relative mx-28 w-[520px] h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              {/* Image with blend mode to unify background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/60 mix-blend-multiply" />
              <img
                src="/assets/images/security-guard-portrait.png"
                alt="Professional Security Guard"
                className="relative w-full h-full object-contain object-bottom mix-blend-normal"
                style={{ objectPosition: 'center bottom', filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))' }}
              />
              
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent pointer-events-none" />
              
              {/* Decorative Elements */}
              <div className="absolute top-8 right-8 w-20 h-20 border-4 border-secondary/30 rounded-full" />
              <div className="absolute bottom-8 left-8 w-16 h-16 border-4 border-secondary/30 rounded-lg rotate-45" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
