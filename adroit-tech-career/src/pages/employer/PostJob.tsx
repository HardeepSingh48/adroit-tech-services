import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployerLayout from "@/components/employer/EmployerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { cities, jobTypes, shifts, experienceLevels, jobCategories } from "@/data/jobs";
import {
  Briefcase,
  MapPin,
  IndianRupee,
  Clock,
  FileText,
  Star,
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

const benefitsList = [
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
    category: "Commercial Security",
    type: "Full Time",
    shift: "Day Shift",
    city: "Delhi",
    address: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    responsibilities: ["Maintain security logs", "Perform patrols"],
    requirements: ["Clean criminal record", "Physically fit"],
    experience: "Fresher",
    ageMin: "",
    ageMax: "",
    education: "10th Pass",
    benefits: ["ESI & PF"] as string[],
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

  const mapType = (val: string) => {
    if (val.includes("Part")) return "PART_TIME";
    if (val.includes("Contract")) return "CONTRACT";
    return "FULL_TIME";
  };

  const mapShift = (val: string) => {
    if (val.includes("Night")) return "NIGHT";
    if (val.includes("Rotational")) return "ROTATIONAL";
    return "DAY";
  };

  const mapExp = (val: string) => {
    if (val.includes("0-1")) return "ZERO_TO_ONE";
    if (val.includes("1-3")) return "ONE_TO_THREE";
    if (val.includes("3+")) return "THREE_PLUS";
    return "FRESHER";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const allBenefits = [...formData.benefits];
    if (formData.customBenefit) allBenefits.push(formData.customBenefit);

    try {
      const payload = {
        title: formData.title,
        category: formData.category || "Commercial Security",
        description: formData.description,
        responsibilities: formData.responsibilities.filter(Boolean),
        requirements: formData.requirements.filter(Boolean),
        benefits: allBenefits,
        type: mapType(formData.type),
        shift: mapShift(formData.shift),
        experienceLevel: mapExp(formData.experience),
        city: formData.city || "Delhi",
        address: formData.address,
        salaryMin: Number(formData.salaryMin) || 15000,
        salaryMax: Number(formData.salaryMax) || 25000,
        positions: Number(formData.positions) || 1,
        ageMin: formData.ageMin ? Number(formData.ageMin) : undefined,
        ageMax: formData.ageMax ? Number(formData.ageMax) : undefined,
        education: formData.education || undefined,
        deadline: formData.deadline || undefined,
      };

      const res = await apiRequest('/jobs', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setIsSubmitting(false);

      if (res.success) {
        toast({
          title: "Job Posted Successfully!",
          description: "Your job listing is now live and visible to candidates.",
        });
        navigate("/employer/dashboard");
      }
    } catch (err: unknown) {
      setIsSubmitting(false);
      const message = err instanceof Error ? err.message : "Could not post job listing. Please check required fields.";
      toast({
        title: "Posting Failed",
        description: message,
        variant: "destructive",
      });
    }
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
                  placeholder="e.g., Senior Security Guard"
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
                  placeholder="e.g., 18000"
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
                  placeholder="e.g., 25000"
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
              {benefitsList.map((benefit) => (
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
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
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
                <>Post Job Now</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </EmployerLayout>
  );
};

export default PostJob;
