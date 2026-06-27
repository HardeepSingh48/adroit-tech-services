import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const careerPortalUrl = import.meta.env.VITE_CAREER_PORTAL_URL || "https://adroit-tech-career.vercel.app";

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services", hasDropdown: true },
    { name: "Careers", path: careerPortalUrl, isExternal: true },
    { name: "Contact", path: "/contact" },
  ];

  const services = [
    { name: "Corporate Security", path: "/services/corporate" },
    { name: "Industrial Security", path: "/services/industrial" },
    { name: "Hotel & Hospital Security", path: "/services/hotel-hospital" },
    { name: "Bank Security", path: "/services/bank" },
    { name: "Institutional Security", path: "/services/institutional" },
    { name: "Event Security", path: "/services/event" },
    { name: "Construction Site Security", path: "/services/construction" },
  ];

  // Check if we're on the home page
  const isHomePage = location.pathname === "/";
  
  // Determine if navbar should be light (scrolled on home, or always on other pages)
  const isLightNav = !isHomePage || isScrolled;

  // Dynamic text color classes
  const textColorClass = isLightNav ? "text-gray-900" : "text-white";
  const hoverColorClass = isLightNav ? "hover:text-secondary" : "hover:text-gray-200";
  const activeColorClass = isLightNav ? "text-secondary" : "text-gray-200";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
        }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.img
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              src="/assets/logos/ATS shield icon 512.png"
              alt="Adroit Tech Logo"
              className="h-10 w-auto transition-all duration-300"
            />
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  className="ml-2 text-xl font-bold"
>
  <span className={`${isLightNav ? "text-primary" : "text-white"} transition-colors duration-300`}>
    Adroit Tech 
  </span>
  <span className={`${isLightNav ? "text-secondary" : "text-white"} transition-colors duration-300`}>
    {" "}Services
  </span>
</motion.div>

          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 ">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                  >
                    <button className={`flex items-center space-x-1 ${textColorClass} ${hoverColorClass} transition-all duration-300 font-semibold hover:scale-105`}>
                      <span>{link.name}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                      {isServicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-card rounded-lg shadow-xl border border-border overflow-hidden"
                        >
                          {services.map((service) => (
                            <Link
                              key={service.path}
                              to={service.path}
                              className="block px-4 py-3 hover:bg-muted transition-all duration-200 text-sm text-gray-900 hover:scale-105 hover:font-semibold origin-left"
                            >
                              {service.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : link.isExternal ? (
                  <a
                    href={link.path}
                    className={`${textColorClass} ${hoverColorClass} transition-all duration-300 font-semibold hover:scale-105 inline-block`}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    to={link.path}
                    className={`${textColorClass} ${hoverColorClass} transition-all duration-300 font-semibold hover:scale-105 inline-block ${location.pathname === link.path ? activeColorClass : ""
                      }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
            <Link to="/contact">
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold">
                Get a Free Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden ${textColorClass} transition-colors duration-300`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`lg:hidden mt-4 pb-4 rounded-lg ${isScrolled ? "bg-background/95" : "bg-gray-900/95 backdrop-blur-md"
                }`}
            >
              <div className="px-4">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    {link.hasDropdown ? (
                      <>
                        <button
                          onClick={() => setIsServicesOpen(!isServicesOpen)}
                          className={`w-full text-left py-3 ${textColorClass} ${hoverColorClass} transition-all duration-300 font-semibold flex items-center justify-between`}
                        >
                          <span>{link.name}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${isServicesOpen ? "rotate-180" : ""
                              }`}
                          />
                        </button>
                        <AnimatePresence>
                          {isServicesOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 space-y-2"
                            >
                              {services.map((service) => (
                                <Link
                                  key={service.path}
                                  to={service.path}
                                  className={`block py-2 text-sm ${textColorClass} ${hoverColorClass} transition-all duration-200`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {service.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : link.isExternal ? (
                      <a
                        href={link.path}
                        className={`block py-3 ${textColorClass} ${hoverColorClass} transition-all duration-300 font-semibold`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className={`block py-3 ${textColorClass} ${hoverColorClass} transition-all duration-300 font-semibold ${location.pathname === link.path ? activeColorClass : ""
                          }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full mt-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    Get a Free Quote
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;