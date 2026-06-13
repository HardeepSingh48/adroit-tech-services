import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
} from "lucide-react";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      value: "+91 1234567890",
      link: "tel:+911234567890",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "+91 1234567890",
      link: "https://wa.me/911234567890",
    },
    {
      icon: Mail,
      title: "Email",
      value: "careers@adroittech.com",
      link: "mailto:careers@adroittech.com",
    },
    {
      icon: Clock,
      title: "Office Hours",
      value: "Mon-Sat: 9AM - 6PM",
      link: null,
    },
  ];

  const offices = [
    {
      city: "Gurgaon (Head Office)",
      address: "123, Sector 15, Gurgaon, Haryana - 122001",
    },
    {
      city: "Delhi",
      address: "456, Connaught Place, New Delhi - 110001",
    },
    {
      city: "Noida",
      address: "789, Sector 62, Noida, UP - 201301",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-hero py-16 md:py-20">
          <div className="container text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about job opportunities or our services? 
              We're here to help. Reach out to us anytime.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="space-y-6">
                <div className="bg-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold text-foreground mb-6">
                    Get in Touch
                  </h2>
                  <div className="space-y-4">
                    {contactInfo.map((info) => (
                      <div key={info.title} className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <info.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            {info.title}
                          </div>
                          {info.link ? (
                            <a
                              href={info.link}
                              target={info.link.startsWith("http") ? "_blank" : undefined}
                              rel="noopener noreferrer"
                              className="font-semibold text-foreground hover:text-primary transition-colors"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <div className="font-semibold text-foreground">
                              {info.value}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Office Locations */}
                <div className="bg-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold text-foreground mb-6">
                    Our Offices
                  </h2>
                  <div className="space-y-4">
                    {offices.map((office) => (
                      <div key={office.city} className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-foreground">
                            {office.city}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {office.address}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-xl p-6 md:p-8 shadow-card">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Send us a Message
                  </h2>

                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-foreground mb-2">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for reaching out. Our team will get back to you within 24 hours.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({
                            name: "",
                            phone: "",
                            email: "",
                            subject: "",
                            message: "",
                          });
                        }}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name" className="mb-2 block">
                            Your Name *
                          </Label>
                          <Input
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="Enter your name"
                            className="h-12"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="mb-2 block">
                            Phone Number *
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            placeholder="Enter phone number"
                            className="h-12"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="email" className="mb-2 block">
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            placeholder="Enter email (optional)"
                            className="h-12"
                          />
                        </div>
                        <div>
                          <Label htmlFor="subject" className="mb-2 block">
                            Subject *
                          </Label>
                          <select
                            id="subject"
                            required
                            value={formData.subject}
                            onChange={(e) =>
                              setFormData({ ...formData, subject: e.target.value })
                            }
                            className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                          >
                            <option value="">Select subject</option>
                            <option value="job-inquiry">Job Inquiry</option>
                            <option value="application-status">Application Status</option>
                            <option value="security-services">Security Services</option>
                            <option value="partnership">Partnership</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="message" className="mb-2 block">
                          Your Message *
                        </Label>
                        <Textarea
                          id="message"
                          required
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                          placeholder="How can we help you?"
                          className="min-h-[150px]"
                        />
                      </div>

                      <Button
                        type="submit"
                        variant="cta"
                        size="xl"
                        className="w-full gap-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-16 bg-muted">
          <div className="container">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-10">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  q: "How do I apply for a job?",
                  a: "You can apply directly through our website by visiting the Jobs page, selecting a position, and filling out the application form. You can also call us or visit our office.",
                },
                {
                  q: "What documents do I need?",
                  a: "You'll need your Aadhar card, PAN card (if available), passport size photos, and any educational certificates. Experience letters are helpful but not mandatory.",
                },
                {
                  q: "Is training provided?",
                  a: "Yes! We provide comprehensive free training to all new recruits covering security protocols, emergency response, and customer service.",
                },
                {
                  q: "When will I receive my uniform?",
                  a: "Uniforms are provided free of cost during your training period before you start your first assignment.",
                },
                {
                  q: "How is salary paid?",
                  a: "Salaries are paid monthly directly to your bank account. We ensure timely payment by the 7th of every month.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-card rounded-xl p-6 shadow-card">
                  <h3 className="font-display font-bold text-foreground mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
