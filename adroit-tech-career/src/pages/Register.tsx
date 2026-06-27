import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
  Upload,
  CheckCircle,
  Shield,
} from "lucide-react";

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    location: "",
    experience: "",
    photo: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
    toast({
      title: "Registration Successful!",
      description: "Welcome to Adroit Tech Services. You can now apply for jobs.",
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted py-12">
          <div className="bg-card rounded-2xl p-8 md:p-12 max-w-md w-full mx-4 text-center shadow-card">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Welcome to Adroit Tech Services!
            </h1>
            <p className="text-muted-foreground mb-8">
              Your account has been created successfully. Start exploring job opportunities now.
            </p>
            <Link to="/jobs">
              <Button variant="cta" size="xl" className="w-full">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted py-12 md:py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <img src="/assets/logos/ATS shield icon 512.png" alt="Adroit Tech Logo" className="h-10 w-auto object-contain" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Register as Job Seeker
              </h1>
              <p className="text-muted-foreground">
                Create your account to apply for security jobs at Adroit Tech Services 
              </p>
            </div>

            {/* Registration Form */}
            <div className="bg-card rounded-2xl p-6 md:p-10 shadow-card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-primary" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="border-border focus:border-primary h-12"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-primary" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter phone number"
                      className="border-border focus:border-primary h-12"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-primary" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email (optional)"
                      className="border-border focus:border-primary h-12"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-primary" />
                      Password *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Create a password"
                      className="border-border focus:border-primary h-12"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <Label htmlFor="location" className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Preferred Location *
                    </Label>
                    <select
                      id="location"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    >
                      <option value="">Select location</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Gurgaon">Gurgaon</option>
                      <option value="Noida">Noida</option>
                      <option value="Faridabad">Faridabad</option>
                      <option value="Ghaziabad">Ghaziabad</option>
                    </select>
                  </div>

                  {/* Experience */}
                  <div className="md:col-span-2">
                    <Label htmlFor="experience" className="mb-2 block">
                      Experience Level *
                    </Label>
                    <select
                      id="experience"
                      required
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    >
                      <option value="">Select experience</option>
                      <option value="fresher">Fresher</option>
                      <option value="0-1">0-1 years</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3+">3+ years</option>
                    </select>
                  </div>

                  {/* Photo Upload */}
                  <div className="md:col-span-2">
                    <Label className="flex items-center gap-2 mb-2">
                      <Upload className="h-4 w-4 text-primary" />
                      Upload Photo
                    </Label>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) =>
                          setFormData({ ...formData, photo: e.target.files?.[0] || null })
                        }
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {formData.photo ? formData.photo.name : "Click to upload your photo (JPG, PNG)"}
                        </p>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="cta"
                  size="xl"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>Create Account</>
                  )}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  By registering, you agree to our{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
