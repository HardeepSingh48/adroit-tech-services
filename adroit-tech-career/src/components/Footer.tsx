import { Link } from "react-router-dom";
import { Shield, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <Shield className="h-10 w-10 text-primary" />
              <div className="flex flex-col">
                <span className="font-display text-2xl font-bold text-primary-foreground tracking-wider">
                  Adroit
                </span>
                <span className="text-xs text-muted-foreground -mt-1">
                  Tech Services
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Securitech Seven Pvt. Ltd. - Your trusted partner for professional
              security services across Delhi NCR since 2010.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-bold mb-4 text-primary-foreground">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Browse Jobs", path: "/jobs" },
                { name: "About Us", path: "/about" },
                { name: "Career Growth", path: "/about" },
                { name: "Training Programs", path: "/about" },
                { name: "Contact Us", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Job Categories */}
          <div>
            <h3 className="font-display text-lg font-bold mb-4 text-primary-foreground">
              Job Categories
            </h3>
            <ul className="space-y-3">
              {[
                "Security Guard",
                "Watchman",
                "Bouncer",
                "CCTV Operator",
                "Security Supervisor",
              ].map((category) => (
                <li key={category}>
                  <Link
                    to="/jobs"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-lg font-bold mb-4 text-primary-foreground">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">
                  123, Sector 15, Gurgaon, Haryana - 122001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a
                  href="tel:+911234567890"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  +91 1234567890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:careers@adroittech.com"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  careers@adroittech.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm text-center md:text-left">
            © 2024 Securitech Seven Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
