import { useState } from "react";
import EmployerLayout from "@/components/employer/EmployerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { mockEmployer, industryTypes, companySizes } from "@/data/employers";
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  Trash2,
  Save,
} from "lucide-react";

const Settings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    companyName: mockEmployer.companyName,
    contactPerson: mockEmployer.contactPerson,
    email: mockEmployer.email,
    phone: mockEmployer.phone,
    address: mockEmployer.address,
    industry: mockEmployer.industry,
    companySize: mockEmployer.companySize,
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

  const handleSaveCompany = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({
      title: "Settings Saved",
      description: "Your company information has been updated.",
    });
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    setPasswords({ current: "", new: "", confirm: "" });
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
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={companyInfo.email}
                onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                className="h-12"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="mb-2 block flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={companyInfo.phone}
                onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                className="h-12"
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
            <div className="flex items-center justify-between py-2 border-t border-border">
              <div>
                <p className="font-medium text-foreground">Application Status Updates</p>
                <p className="text-sm text-muted-foreground">Notifications for status changes</p>
              </div>
              <Switch
                checked={notifications.applicationStatus}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, applicationStatus: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between py-2 border-t border-border">
              <div>
                <p className="font-medium text-foreground">Weekly Digest</p>
                <p className="text-sm text-muted-foreground">Summary of activity each week</p>
              </div>
              <Switch
                checked={notifications.weeklyDigest}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, weeklyDigest: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between py-2 border-t border-border">
              <div>
                <p className="font-medium text-foreground">Marketing Emails</p>
                <p className="text-sm text-muted-foreground">Tips and updates from Adroit Tech Services</p>
              </div>
              <Switch
                checked={notifications.marketing}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, marketing: checked })
                }
              />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-card rounded-xl border-2 border-destructive/30 p-6">
          <h2 className="font-display text-xl font-bold text-destructive mb-4 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </h2>
          <p className="text-muted-foreground mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="destructive">
            Delete Account
          </Button>
        </div>
      </div>
    </EmployerLayout>
  );
};

export default Settings;
