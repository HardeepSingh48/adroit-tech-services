import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { industryTypes, companySizes } from "@/data/employers";
import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
  CheckCircle,
  FileText,
  Briefcase,
  AlertCircle,
} from "lucide-react";

const RegisterEmployer = () => {
  const { registerEmployer } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "Delhi",
    industry: "",
    companySize: "",
    gstNumber: "",
    panNumber: "",
    website: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await registerEmployer({
        companyName: formData.companyName,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        industry: formData.industry || "Commercial",
        companySize: formData.companySize || "11-50",
        address: formData.address,
        city: formData.city || "Delhi",
        gstNumber: formData.gstNumber || undefined,
        panNumber: formData.panNumber || undefined,
      });

      setIsSubmitting(false);

      if (res.success) {
        setIsSuccess(true);
        toast({
          title: "Registration Successful!",
          description: "Your employer account has been created. You can now post jobs.",
        });
      }
    } catch (err: unknown) {
      setIsSubmitting(false);
      const message = err instanceof Error ? err.message : "Could not complete employer registration.";
      setErrorMessage(message);
      toast({
        title: "Registration Failed",
        description: message,
        variant: "destructive",
      });
    }
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
              Welcome, {formData.companyName}!
            </h1>
            <p className="text-muted-foreground mb-8">
              Your employer account has been created successfully. Please log in with your credentials to manage your company portal.
            </p>
            <div className="space-y-3">
              <Link to="/login">
                <Button variant="cta" size="xl" className="w-full">
                  Proceed to Login
                </Button>
              </Link>
            </div>
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
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Register as Employer
              </h1>
              <p className="text-muted-foreground">
                Create your employer account to post jobs and hire security professionals
              </p>
            </div>

            {/* Registration Form */}
            <div className="bg-card rounded-2xl p-6 md:p-10 shadow-card">
              <form onSubmit={handleSubmit} className="space-y-8">
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-start gap-3 text-destructive animate-fade-in">
                    <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                    <div className="text-sm font-medium leading-relaxed">{errorMessage}</div>
                  </div>
                )}
                {/* Company Information */}
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Company Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="companyName" className="mb-2 block">
                        Company Name *
                      </Label>
                      <Input
                        id="companyName"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="Enter company name"
                        className="border-border focus:border-primary h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="industry" className="mb-2 block">
                        Industry Type *
                      </Label>
                      <select
                        id="industry"
                        required
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                      >
                        <option value="">Select industry</option>
                        {industryTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="companySize" className="mb-2 block">
                        Company Size *
                      </Label>
                      <select
                        id="companySize"
                        required
                        value={formData.companySize}
                        onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                        className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                      >
                        <option value="">Select size</option>
                        {companySizes.map((size) => (
                          <option key={size} value={size}>{size} employees</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="address" className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Company Address *
                      </Label>
                      <Input
                        id="address"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Enter complete address"
                        className="border-border focus:border-primary h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="city" className="mb-2 block">
                        City *
                      </Label>
                      <Input
                        id="city"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Delhi, Gurgaon, Noida"
                        className="border-border focus:border-primary h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="gstNumber" className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-primary" />
                        GST Number
                      </Label>
                      <Input
                        id="gstNumber"
                        value={formData.gstNumber}
                        onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                        placeholder="Enter GST number (optional)"
                        className="border-border focus:border-primary h-12"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Person */}
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Contact Person
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="contactPerson" className="mb-2 block">
                        Contact Person Name *
                      </Label>
                      <Input
                        id="contactPerson"
                        required
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        placeholder="Enter contact person name"
                        className="border-border focus:border-primary h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4 text-primary" />
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter email address"
                        className="border-border focus:border-primary h-12"
                      />
                    </div>

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

                    <div className="md:col-span-2">
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
                        placeholder="Create a secure password"
                        className="border-border focus:border-primary h-12"
                      />
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
                    <>Create Employer Account</>
                  )}
                </Button>

                {/* Job Seeker Link */}
                <div className="pt-4 border-t border-border">
                  <p className="text-center text-muted-foreground">
                    Looking for a job?{" "}
                    <Link to="/register/jobseeker" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      Register as Job Seeker
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterEmployer;
