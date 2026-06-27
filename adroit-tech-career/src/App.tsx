import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Register from "./pages/Register";
import RegisterJobSeeker from "./pages/RegisterJobSeeker";
import RegisterEmployer from "./pages/RegisterEmployer";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import RoleGuard from "./components/RoleGuard";

// User (Job Seeker) Pages
import UserProfile from "./pages/user/UserProfile";
import UserApplications from "./pages/user/UserApplications";
import UserSavedJobs from "./pages/user/UserSavedJobs";

// Employer Pages
import EmployerDashboard from "./pages/employer/Dashboard";
import PostJob from "./pages/employer/PostJob";
import Applications from "./pages/employer/Applications";
import EmployerJobs from "./pages/employer/EmployerJobs";
import Settings from "./pages/employer/Settings";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminEmployers from "./pages/admin/Employers";
import AdminUsers from "./pages/admin/Users";
import AdminJobs from "./pages/admin/Jobs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/jobseeker" element={<RegisterJobSeeker />} />
            <Route path="/register/employer" element={<RegisterEmployer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Job Seeker Protected Routes */}
            <Route path="/profile" element={<RoleGuard allowedRoles={['JOB_SEEKER']}><UserProfile /></RoleGuard>} />
            <Route path="/user/profile" element={<RoleGuard allowedRoles={['JOB_SEEKER']}><UserProfile /></RoleGuard>} />
            <Route path="/user/applications" element={<RoleGuard allowedRoles={['JOB_SEEKER']}><UserApplications /></RoleGuard>} />
            <Route path="/user/saved-jobs" element={<RoleGuard allowedRoles={['JOB_SEEKER']}><UserSavedJobs /></RoleGuard>} />

            {/* Employer Protected Routes */}
            <Route path="/employer/dashboard" element={<RoleGuard allowedRoles={['EMPLOYER', 'ADMIN']}><EmployerDashboard /></RoleGuard>} />
            <Route path="/employer/post-job" element={<RoleGuard allowedRoles={['EMPLOYER', 'ADMIN']}><PostJob /></RoleGuard>} />
            <Route path="/employer/applications" element={<RoleGuard allowedRoles={['EMPLOYER', 'ADMIN']}><Applications /></RoleGuard>} />
            <Route path="/employer/jobs" element={<RoleGuard allowedRoles={['EMPLOYER', 'ADMIN']}><EmployerJobs /></RoleGuard>} />
            <Route path="/employer/settings" element={<RoleGuard allowedRoles={['EMPLOYER', 'ADMIN']}><Settings /></RoleGuard>} />
            
            {/* Admin Protected Routes */}
            <Route path="/admin/dashboard" element={<RoleGuard allowedRoles={['ADMIN']}><AdminDashboard /></RoleGuard>} />
            <Route path="/admin/employers" element={<RoleGuard allowedRoles={['ADMIN']}><AdminEmployers /></RoleGuard>} />
            <Route path="/admin/users" element={<RoleGuard allowedRoles={['ADMIN']}><AdminUsers /></RoleGuard>} />
            <Route path="/admin/jobs" element={<RoleGuard allowedRoles={['ADMIN']}><AdminJobs /></RoleGuard>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
