import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, MapPin, FileText, CheckCircle } from "lucide-react";

interface ApplicationFormProps {
  jobTitle: string;
  jobId: string;
}

const ApplicationForm = ({ jobTitle, jobId }: ApplicationFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [appId, setAppId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    experience: "",
    availability: "immediate",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login or register as a job seeker to apply.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await apiRequest<{ id: string }>(`/jobs/${jobId}/applications`, {
        method: 'POST',
        body: JSON.stringify({
          availability: formData.availability || "immediate",
          coverNote: `Address: ${formData.address}`,
          experienceNote: formData.experience,
        }),
      });

      setIsSubmitting(false);

      if (res.success) {
        setIsSubmitted(true);
        setAppId(res.data?.id || `APP-${jobId}`);
        toast({
          title: "Application Submitted!",
          description: "Our team will review your application within 24-48 hours.",
        });
      }
    } catch (err: unknown) {
      setIsSubmitting(false);
      const message = err instanceof Error ? err.message : "Could not submit application. You may have already applied.";
      toast({
        title: "Submission Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
        <h3 className="font-display text-2xl font-bold text-foreground mb-2">
          Application Submitted!
        </h3>
        <p className="text-muted-foreground mb-6">
          Thank you for applying for {jobTitle}. Our team will review your application and contact you soon.
        </p>
        <p className="text-sm text-muted-foreground">
          Application Reference: <span className="font-mono text-primary">{appId}</span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
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
            className="border-border focus:border-primary"
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
            placeholder="Enter your phone number"
            className="border-border focus:border-primary"
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
            placeholder="Enter your email (optional)"
            className="border-border focus:border-primary"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <Label htmlFor="address" className="flex items-center gap-2 mb-2">
          <MapPin className="h-4 w-4 text-primary" />
          Current Address *
        </Label>
        <Textarea
          id="address"
          required
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Enter your complete address"
          className="border-border focus:border-primary min-h-[80px]"
        />
      </div>

      {/* Experience */}
      <div>
        <Label htmlFor="experience" className="flex items-center gap-2 mb-2">
          <FileText className="h-4 w-4 text-primary" />
          Work Experience
        </Label>
        <Textarea
          id="experience"
          value={formData.experience}
          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          placeholder="Describe your previous work experience (if any)"
          className="border-border focus:border-primary min-h-[80px]"
        />
      </div>

      {/* Availability */}
      <div>
        <Label htmlFor="availability" className="mb-2 block">
          When can you join? *
        </Label>
        <select
          id="availability"
          required
          value={formData.availability}
          onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        >
          <option value="immediate">Immediately</option>
          <option value="1-week">Within 1 week</option>
          <option value="2-weeks">Within 2 weeks</option>
          <option value="1-month">Within 1 month</option>
        </select>
      </div>

      {/* Submit Button */}
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
            Submitting...
          </>
        ) : (
          <>Submit Application</>
        )}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        By submitting, you agree to our Terms & Conditions and Privacy Policy
      </p>
    </form>
  );
};

export default ApplicationForm;
