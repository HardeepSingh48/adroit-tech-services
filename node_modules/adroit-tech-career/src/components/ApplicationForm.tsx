import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Upload, User, Phone, Mail, MapPin, Calendar, FileText, CheckCircle } from "lucide-react";

interface ApplicationFormProps {
  jobTitle: string;
  jobId: string;
}

const ApplicationForm = ({ jobTitle, jobId }: ApplicationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    dob: "",
    address: "",
    experience: "",
    availability: "",
    resume: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: "Application Submitted!",
      description: "Our team will review your application within 24-48 hours.",
    });
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
          Thank you for applying. Our team will review your application and contact you within 24-48 hours.
        </p>
        <p className="text-sm text-muted-foreground">
          Application ID: <span className="font-mono text-primary">APP-{jobId}-{Date.now().toString(36).toUpperCase()}</span>
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

        {/* DOB */}
        <div>
          <Label htmlFor="dob" className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            Date of Birth *
          </Label>
          <Input
            id="dob"
            type="date"
            required
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
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
          <option value="">Select availability</option>
          <option value="immediate">Immediately</option>
          <option value="1-week">Within 1 week</option>
          <option value="2-weeks">Within 2 weeks</option>
          <option value="1-month">Within 1 month</option>
        </select>
      </div>

      {/* Resume Upload */}
      <div>
        <Label className="flex items-center gap-2 mb-2">
          <Upload className="h-4 w-4 text-primary" />
          Upload Resume/Photo
        </Label>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFormData({ ...formData, resume: e.target.files?.[0] || null })}
            className="hidden"
            id="resume-upload"
          />
          <label htmlFor="resume-upload" className="cursor-pointer">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {formData.resume ? formData.resume.name : "Click to upload PDF, JPG, or PNG"}
            </p>
          </label>
        </div>
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
