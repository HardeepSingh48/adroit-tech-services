import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('JOB_SEEKER' | 'EMPLOYER' | 'ADMIN')[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex flex-col bg-muted">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="bg-card rounded-2xl p-8 md:p-12 max-w-md w-full text-center shadow-card border border-border">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-6 text-sm">
              You do not have the necessary permissions to view this page. You are currently logged in as{' '}
              <span className="font-semibold text-foreground">{user.role}</span>.
            </p>
            <div className="space-y-3">
              {user.role === 'EMPLOYER' && (
                <Button variant="cta" className="w-full" onClick={() => window.location.href = '/employer/dashboard'}>
                  Go to Employer Dashboard
                </Button>
              )}
              {user.role === 'ADMIN' && (
                <Button variant="cta" className="w-full" onClick={() => window.location.href = '/admin/dashboard'}>
                  Go to Admin Dashboard
                </Button>
              )}
              {user.role === 'JOB_SEEKER' && (
                <Button variant="cta" className="w-full" onClick={() => window.location.href = '/profile'}>
                  Go to Profile
                </Button>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
