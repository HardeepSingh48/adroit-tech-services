import React, { useEffect, useState } from 'react';
import UserLayout from '@/components/user/UserLayout';
import { apiRequest } from '@/lib/api';
import { AppJobSeekerProfile } from '@/types/app.types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2, User, Mail, Phone, MapPin, Briefcase, Award, Save, ShieldCheck } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [profile, setProfile] = useState<AppJobSeekerProfile | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    preferredCity: '',
    experience: 'FRESHER',
    skills: '',
    certifications: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiRequest<AppJobSeekerProfile>('/job-seekers/profile');
        if (res.success && res.data) {
          setProfile(res.data);
          setFormData({
            fullName: res.data.fullName || '',
            phone: res.data.user?.phone || '',
            preferredCity: res.data.preferredCity || '',
            experience: res.data.experience || 'FRESHER',
            skills: Array.isArray(res.data.skills) ? res.data.skills.join(', ') : '',
            certifications: Array.isArray(res.data.certifications) ? res.data.certifications.join(', ') : '',
          });
        }
      } catch (err: unknown) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const skillsArray = formData.skills
        ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      const certsArray = formData.certifications
        ? formData.certifications.split(',').map((c) => c.trim()).filter(Boolean)
        : [];

      const res = await apiRequest<AppJobSeekerProfile>('/job-seekers/profile', {
        method: 'PUT',
        body: JSON.stringify({
          fullName: formData.fullName,
          preferredCity: formData.preferredCity || undefined,
          experience: formData.experience,
          skills: skillsArray,
          certifications: certsArray,
        }),
      });

      if (res.success && res.data) {
        setProfile(res.data);
        toast({
          title: 'Profile Updated',
          description: 'Your profile details have been saved successfully.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile.';
      toast({
        title: 'Error',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                {profile?.fullName || user?.email || 'Job Seeker Profile'}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4 text-primary" />
                {user?.email || 'No email registered'}
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            Status: Active Candidate
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card border border-border">
          <h2 className="font-display text-lg font-bold text-foreground mb-6 pb-2 border-b border-border">
            Personal & Professional Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <Label htmlFor="fullName" className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-primary" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Phone (Read Only) */}
              <div>
                <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  disabled
                  value={formData.phone || user?.phone || 'N/A'}
                  className="bg-muted text-muted-foreground"
                />
              </div>

              {/* Preferred City */}
              <div>
                <Label htmlFor="preferredCity" className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Preferred City / Location
                </Label>
                <Input
                  id="preferredCity"
                  value={formData.preferredCity}
                  onChange={(e) => setFormData({ ...formData, preferredCity: e.target.value })}
                  placeholder="e.g., Delhi NCR, Mumbai, Bangalore"
                />
              </div>

              {/* Experience Level */}
              <div>
                <Label htmlFor="experience" className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Experience Level
                </Label>
                <select
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="FRESHER">Fresher (0 Years)</option>
                  <option value="ZERO_TO_ONE">0 - 1 Year</option>
                  <option value="ONE_TO_THREE">1 - 3 Years</option>
                  <option value="THREE_PLUS">3+ Years</option>
                </select>
              </div>

              {/* Skills */}
              <div className="md:col-span-2">
                <Label htmlFor="skills" className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-primary" />
                  Skills (Comma Separated)
                </Label>
                <Input
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g., CCTV Monitoring, Physical Guarding, Access Control, First Aid"
                />
              </div>

              {/* Certifications */}
              <div className="md:col-span-2">
                <Label htmlFor="certifications" className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Security Licenses & Certifications (Comma Separated)
                </Label>
                <Input
                  id="certifications"
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  placeholder="e.g., PSARA Training Certificate, Fire Safety Certification"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <Button variant="cta" type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserProfile;
