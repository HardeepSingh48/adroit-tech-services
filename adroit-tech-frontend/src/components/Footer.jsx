import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Our Services", path: "/services" },
    { name: "Contact Us", path: "/contact" },
  ];

  const services = [
    { name: "Corporate Security", path: "/services/corporate" },
    { name: "Industrial Security", path: "/services/industrial" },
    { name: "Hotel & Hospital Security", path: "/services/hotel-hospital" },
    { name: "Bank Security", path: "/services/bank" },
    { name: "Event Security", path: "/services/event" },
    { name: "Construction Site Security", path: "/services/construction" },
  ];

  const offices = [
    {
      name: "Registered Office",
      address: "403 and 404, 4th Floor, Ashiana Trade Center, Adityapur, Jamshedpur, Jharkhand 831013",
      phone: "0657-2383858",
    },
    {
      name: "Corporate Office",
      address: "220, 2nd Floor Vipul Trade Centre, Sector 48, Gurugram, Haryana - 122018",
      phone: "0124-4285514",
    },
    {
      name: "New Delhi Office",
      address: "S-211, Vardhman Sunder Plaza, Pocket-12, Sector-12, Dwarka, New Delhi-110075",
      phone: "011-41538420",
    },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-white">Adroit Tech</span>
              <span className="text-secondary"> Services</span>
            </h3>
            <p className="text-primary-foreground/80 mb-4">
              Leading provider of professional security services with over 25 years of experience across India.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              {services.slice(0, 5).map((service) => (
                <li key={service.path}>
                  <Link
                    to={service.path}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-4">
              {offices.slice(0, 1).map((office, index) => (
                <div key={index} className="text-sm">
                  <p className="font-semibold mb-1">{office.name}</p>
                  <div className="flex items-start space-x-2 mb-2">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                    <p className="text-primary-foreground/80">{office.address}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <p className="text-primary-foreground/80">{office.phone}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center space-x-2 mt-2">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:info@adroittech.com"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  info@adroittech.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} Adroit Tech Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
