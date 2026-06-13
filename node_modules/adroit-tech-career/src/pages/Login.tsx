import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  Shield,
  Mail,
  Lock,
  User,
  Building2,
  Briefcase,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"jobseeker" | "employer">("jobseeker");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    
    toast({
      title: "Login Successful!",
      description: `Welcome back! Redirecting to ${activeTab === "employer" ? "dashboard" : "jobs"}...`,
    });

    // Redirect based on user type
    if (activeTab === "employer") {
      navigate("/employer/dashboard");
    } else {
      navigate("/jobs");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 gradient-hero py-12 md:py-20">
        <div className="container">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                Welcome Back
              </h1>
              <p className="text-primary-foreground/70">
                Login to your Adroit Tech Services account
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "jobseeker" | "employer")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted">
                  <TabsTrigger 
                    value="jobseeker" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Job Seeker
                  </TabsTrigger>
                  <TabsTrigger 
                    value="employer"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
                  >
                    <Building2 className="h-4 w-4" />
                    Employer
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="jobseeker">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="email-js" className="flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4 text-primary" />
                        Email / Phone
                      </Label>
                      <Input
                        id="email-js"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter email or phone number"
                        className="border-border focus:border-primary h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="password-js" className="flex items-center gap-2 mb-2">
                        <Lock className="h-4 w-4 text-primary" />
                        Password
                      </Label>
                      <Input
                        id="password-js"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Enter your password"
                        className="border-border focus:border-primary h-12"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember-js"
                          checked={formData.rememberMe}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, rememberMe: checked as boolean })
                          }
                        />
                        <label
                          htmlFor="remember-js"
                          className="text-sm text-muted-foreground cursor-pointer"
                        >
                          Remember me
                        </label>
                      </div>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>

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
                          Logging in...
                        </>
                      ) : (
                        <>Login as Job Seeker</>
                      )}
                    </Button>

                    <p className="text-center text-muted-foreground text-sm">
                      New job seeker?{" "}
                      <Link to="/register/jobseeker" className="text-primary font-semibold hover:underline">
                        Register here
                      </Link>
                    </p>
                  </form>
                </TabsContent>

                <TabsContent value="employer">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="email-emp" className="flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4 text-primary" />
                        Email Address
                      </Label>
                      <Input
                        id="email-emp"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your company email"
                        className="border-border focus:border-primary h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="password-emp" className="flex items-center gap-2 mb-2">
                        <Lock className="h-4 w-4 text-primary" />
                        Password
                      </Label>
                      <Input
                        id="password-emp"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Enter your password"
                        className="border-border focus:border-primary h-12"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember-emp"
                          checked={formData.rememberMe}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, rememberMe: checked as boolean })
                          }
                        />
                        <label
                          htmlFor="remember-emp"
                          className="text-sm text-muted-foreground cursor-pointer"
                        >
                          Remember me
                        </label>
                      </div>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>

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
                          Logging in...
                        </>
                      ) : (
                        <>Login as Employer</>
                      )}
                    </Button>

                    <p className="text-center text-muted-foreground text-sm">
                      New employer?{" "}
                      <Link to="/register/employer" className="text-primary font-semibold hover:underline">
                        Register here
                      </Link>
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
