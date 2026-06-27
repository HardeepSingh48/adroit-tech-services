import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, AlertCircle, User, Briefcase, LogIn } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await login({
        identifier: formData.email,
        password: formData.password,
      });

      setIsSubmitting(false);

      if (res.success) {
        toast({
          title: "Login Successful!",
          description: `Welcome back to Adroit Tech Services.`,
        });

        const role = res.data?.user?.role;
        if (role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (role === "EMPLOYER") {
          navigate("/employer/dashboard");
        } else {
          navigate("/jobs");
        }
      }
    } catch (err: unknown) {
      setIsSubmitting(false);
      const message = err instanceof Error ? err.message : "Invalid credentials. Please check your email/phone and password.";
      setErrorMessage(message);
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 gradient-hero py-12 md:py-20 flex items-center justify-center">
        <div className="container">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                <img src="/assets/logos/ATS shield icon 512.png" alt="Adroit Tech Logo" className="h-10 w-auto object-contain" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                Portal Login
              </h1>
              <p className="text-primary-foreground/70 text-sm">
                Single sign-in for Job Seekers, Employers, and Administrators
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card border border-border">
              {errorMessage && (
                <div className="p-4 mb-6 rounded-xl bg-destructive/10 border border-destructive/30 flex items-start gap-3 text-destructive animate-fade-in">
                  <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                  <div className="text-sm font-medium leading-relaxed">{errorMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2 mb-2 text-foreground font-medium">
                    <Mail className="h-4 w-4 text-primary" />
                    Email Address or Phone Number
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter registered email or phone"
                    className="border-border focus:border-primary h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="flex items-center gap-2 mb-2 text-foreground font-medium">
                    <Lock className="h-4 w-4 text-primary" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your account password"
                    className="border-border focus:border-primary h-12"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, rememberMe: checked as boolean })
                      }
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="cta"
                  size="xl"
                  className="w-full mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>

                <div className="pt-6 border-t border-border mt-6 text-center space-y-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Don't have an account yet?
                  </p>
                  <div className="flex items-center justify-center gap-4 flex-wrap text-sm">
                    <Link to="/register/jobseeker" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Register as Job Seeker
                    </Link>
                    <span className="text-muted-foreground">•</span>
                    <Link to="/register/employer" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      Register as Employer
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
