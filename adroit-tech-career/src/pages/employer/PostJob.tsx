import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployerLayout from "@/components/employer/EmployerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { cities, jobTypes, shifts, experienceLevels, jobCategories } from "@/data/jobs";
import {
  Briefcase,
  MapPin,
  IndianRupee,
  Clock,
  Users,
  FileText,
  Star,
  Calendar,
  Plus,
  X,
} from "lucide-react";

const educationLevels = [
  "5th Pass",
  "8th Pass",
  "10th Pass",
  "12th Pass",
  "Graduate",
];

const benefits = [
  "ESI & PF",
  "Uniform Provided",
  "Accommodation",
  "Meals",
  "Transport",
  "Medical Insurance",
];

const PostJob = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    type: "",
    shift: "",
    city: "",
    address: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    responsibilities: [""],
    requirements: [""],
    experience: "",
    ageMin: "",
    ageMax: "",
    education: "",
    benefits: [] as string[],
    customBenefit: "",
    positions: "1",
    featured: false,
    deadline: "",
  });

  const handleAddItem = (field: "responsibilities" | "requirements") => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ""],
    });
  };

  const handleRemoveItem = (field: "responsibilities" | "requirements", index: number) => {
    const newItems = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newItems.length ? newItems : [""],
    });
  };

  const handleItemChange = (field: "responsibilities" | "requirements", index: number, value: string) => {
    const newItems = [...formData[field]];
    newItems[index] = value;
    setFormData({
      ...formData,
      [field]: newItems,
    });
  };

  const handleBenefitToggle = (benefit: string) => {
    if (formData.benefits.includes(benefit)) {
      setFormData({
        ...formData,
        benefits: formData.benefits.filter((b) => b !== benefit),
      });
    } else {
      setFormData({
        ...formData,
        benefits: [...formData.benefits, benefit],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    toast({
      title: "Job Posted Successfully!",
      description: "Your job listing is now live and visible to candidates.",
    });
    navigate("/employer/dashboard");
  };

  return (
    <EmployerLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Post a New Job
          </h1>
          <p className="text-muted-foreground mt-1">
            Fill in the details to create a new job listing
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-card rounded-xl border-2 border-border p-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="title" className="mb-2 block">Job Title *</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Security Guard"
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="category" className="mb-2 block">Job Category *</Label>
                <select
                  id="category"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                >
                  <option value="">Select category</option>
                  {jobCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="type" className="mb-2 block">Employment Type *</Label>
                <select
                  id="type"
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                >
                  <option value="">Select type</option>
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="shift" className="mb-2 block">Shift Type *</Label>
                <select
                  id="shift"
                  required
                  value={formData.shift}
                  onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                  className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                >
                  <option value="">Select shift</option>
                  {shifts.map((shift) => (
                    <option key={shift} value={shift}>{shift}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location & Salary */}
          <div className="bg-card rounded-xl border-2 border-border p-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Location & Salary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="city" className="mb-2 block">City *</Label>
                <select
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                >
                  <option value="">Select city</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="address" className="mb-2 block">Complete Address *</Label>
                <Input
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter complete address"
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="salaryMin" className="mb-2 block flex items-center gap-1">
                  <IndianRupee className="h-4 w-4" />
                  Minimum Salary (₹) *
                </Label>
                <Input
                  id="salaryMin"
                  type="number"
                  required
                  value={formData.salaryMin}
                  onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                  placeholder="e.g., 15000"
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="salaryMax" className="mb-2 block flex items-center gap-1">
                  <IndianRupee className="h-4 w-4" />
                  Maximum Salary (₹) *
                </Label>
                <Input
                  id="salaryMax"
                  type="number"
                  required
                  value={formData.salaryMax}
                  onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                  placeholder="e.g., 20000"
                  className="h-12"
                />
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="bg-card rounded-xl border-2 border-border p-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Job Details
            </h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="description" className="mb-2 block">Job Description *</Label>
                <Textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the job role and expectations..."
                  className="min-h-[120px]"
                />
              </div>

              {/* Responsibilities */}
              <div>
                <Label className="mb-2 block">Responsibilities *</Label>
                {formData.responsibilities.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={item}
                      onChange={(e) => handleItemChange("responsibilities", index, e.target.value)}
                      placeholder="Enter responsibility"
                      className="h-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem("responsibilities", index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddItem("responsibilities")}
                  className="mt-1"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Responsibility
                </Button>
              </div>

              {/* Requirements */}
              <div>
                <Label className="mb-2 block">Requirements *</Label>
                {formData.requirements.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={item}
                      onChange={(e) => handleItemChange("requirements", index, e.target.value)}
                      placeholder="Enter requirement"
                      className="h-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem("requirements", index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddItem("requirements")}
                  className="mt-1"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Requirement
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="experience" className="mb-2 block">Experience Required *</Label>
                  <select
                    id="experience"
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  >
                    <option value="">Select experience</option>
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="mb-2 block">Age Range</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={formData.ageMin}
                      onChange={(e) => setFormData({ ...formData, ageMin: e.target.value })}
                      placeholder="Min"
                      className="h-12"
                    />
                    <Input
                      type="number"
                      value={formData.ageMax}
                      onChange={(e) => setFormData({ ...formData, ageMax: e.target.value })}
                      placeholder="Max"
                      className="h-12"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="education" className="mb-2 block">Education</Label>
                  <select
                    id="education"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  >
                    <option value="">Select education</option>
                    {educationLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-card rounded-xl border-2 border-border p-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Benefits Offered
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center space-x-2">
                  <Checkbox
                    id={benefit}
                    checked={formData.benefits.includes(benefit)}
                    onCheckedChange={() => handleBenefitToggle(benefit)}
                  />
                  <label
                    htmlFor={benefit}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {benefit}
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Label htmlFor="customBenefit" className="mb-2 block">Custom Benefit</Label>
              <Input
                id="customBenefit"
                value={formData.customBenefit}
                onChange={(e) => setFormData({ ...formData, customBenefit: e.target.value })}
                placeholder="Add any other benefit"
                className="h-10"
              />
            </div>
          </div>

          {/* Additional Settings */}
          <div className="bg-card rounded-xl border-2 border-border p-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Additional Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="positions" className="mb-2 block flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Number of Positions *
                </Label>
                <Input
                  id="positions"
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={formData.positions}
                  onChange={(e) => setFormData({ ...formData, positions: e.target.value })}
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="deadline" className="mb-2 block flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Application Deadline
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, featured: checked as boolean })
                    }
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      Featured Job - Highlight this job on homepage
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button type="button" variant="outline" size="lg">
              Save as Draft
            </Button>
            <Button type="button" variant="ctaSecondary" size="lg">
              Preview Job
            </Button>
            <Button
              type="submit"
              variant="cta"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Posting...
                </>
              ) : (
                <>Post Job</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </EmployerLayout>
  );
};

export default PostJob;
