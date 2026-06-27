import { useState, useEffect } from "react";
import EmployerLayout from "@/components/employer/EmployerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { AppEmployerProfile } from "@/types/app.types";
import { industryTypes } from "@/data/employers";
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  Save,
} from "lucide-react";

const Settings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "Delhi",
    industry: "Commercial",
    companySize: "11-50",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    newApplications: true,
    applicationStatus: true,
    weeklyDigest: false,
    marketing: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiRequest<AppEmployerProfile>('/employers/profile');
        if (res.success && res.data) {
          setCompanyInfo({
            companyName: res.data.companyName || "",
            contactPerson: res.data.contactPerson || "",
            email: res.data.user?.email || "",
            phone: res.data.user?.phone || "",
            address: res.data.address || "",
            city: res.data.city || "Delhi",
            industry: res.data.industry || "Commercial",
            companySize: res.data.companySize || "11-50",
          });
        }
      } catch {
        // fallback
      }
    };
    fetchProfile();
  }, []);

  const handleSaveCompany = async () => {
    setIsSaving(true);
    try {
      await apiRequest('/employers/profile', {
        method: 'PUT',
        body: JSON.stringify({
          companyName: companyInfo.companyName,
          contactPerson: companyInfo.contactPerson,
          address: companyInfo.address,
          city: companyInfo.city,
          industry: companyInfo.industry,
          companySize: companyInfo.companySize,
        }),
      });
      toast({
        title: "Settings Saved",
        description: "Your company information has been updated.",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not update company profile.";
      toast({
        title: "Save Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest('/auth/change-password', {
        method: 'PATCH',
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not change password.";
      toast({
        title: "Password Update Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <EmployerLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and preferences
          </p>
        </div>

        {/* Company Information */}
        <div className="bg-card rounded-xl border-2 border-border p-6">
          <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Company Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="companyName" className="mb-2 block">Company Name</Label>
              <Input
                id="companyName"
                value={companyInfo.companyName}
                onChange={(e) => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
                className="h-12"
              />
            </div>

            <div>
              <Label htmlFor="contactPerson" className="mb-2 block flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Contact Person
              </Label>
              <Input
                id="contactPerson"
                value={companyInfo.contactPerson}
                onChange={(e) => setCompanyInfo({ ...companyInfo, contactPerson: e.target.value })}
                className="h-12"
              />
            </div>

            <div>
              <Label htmlFor="email" className="mb-2 block flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Email Address (Read-only)
              </Label>
              <Input
                id="email"
                type="email"
                disabled
                value={companyInfo.email}
                className="h-12 bg-muted cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="mb-2 block flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Phone Number (Read-only)
              </Label>
              <Input
                id="phone"
                disabled
                value={companyInfo.phone}
                className="h-12 bg-muted cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="industry" className="mb-2 block">Industry Type</Label>
              <select
                id="industry"
                value={companyInfo.industry}
                onChange={(e) => setCompanyInfo({ ...companyInfo, industry: e.target.value })}
                className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              >
                {industryTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address" className="mb-2 block flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Address
              </Label>
              <Input
                id="address"
                value={companyInfo.address}
                onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                className="h-12"
              />
            </div>
          </div>
          <div className="mt-6">
            <Button variant="cta" onClick={handleSaveCompany} disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-card rounded-xl border-2 border-border p-6">
          <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Change Password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword" className="mb-2 block">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                required
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="h-12 max-w-md"
              />
            </div>
            <div>
              <Label htmlFor="newPassword" className="mb-2 block">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                required
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="h-12 max-w-md"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="mb-2 block">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="h-12 max-w-md"
              />
            </div>
            <Button type="submit" variant="ctaSecondary">
              Update Password
            </Button>
          </form>
        </div>

        {/* Notification Preferences */}
        <div className="bg-card rounded-xl border-2 border-border p-6">
          <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">New Applications</p>
                <p className="text-sm text-muted-foreground">Get notified when someone applies</p>
              </div>
              <Switch
                checked={notifications.newApplications}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, newApplications: checked })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </EmployerLayout>
  );
};

export default Settings;
