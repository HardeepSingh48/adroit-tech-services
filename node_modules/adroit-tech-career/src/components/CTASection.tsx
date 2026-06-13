import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="relative gradient-hero rounded-2xl md:rounded-3xl p-8 md:p-16 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Ready to Start Your{" "}
              <span className="text-primary">Security Career?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join thousands of security professionals who have built successful careers with Tech Services. Register today and take the first step!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button variant="hero" size="xl" className="gap-2 w-full sm:w-auto">
                  Register Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href="tel:+911234567890">
                <Button variant="heroOutline" size="xl" className="gap-2 w-full sm:w-auto">
                  <Phone className="h-5 w-5" />
                  Call Us
                </Button>
              </a>
            </div>

            {/* WhatsApp */}
            <div className="mt-6">
              <a
                href="https://wa.me/911234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Or message us on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
