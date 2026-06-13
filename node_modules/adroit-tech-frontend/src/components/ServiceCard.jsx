import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useInView } from "react-intersection-observer";

const ServiceCard = ({ icon: Icon, title, description, link, index }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-border hover:border-secondary h-full flex flex-col">
        <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-secondary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground mb-4 flex-grow">{description}</p>
        <Link to={link}>
          <Button
            variant="outline"
            className="w-full border-secondary text-secondary hover:bg-secondary hover:text-white transition-all"
          >
            Learn More
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
