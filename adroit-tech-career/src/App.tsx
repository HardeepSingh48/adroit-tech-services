import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

// Employer Pages
import EmployerDashboard from "./pages/employer/Dashboard";
import PostJob from "./pages/employer/PostJob";
import Applications from "./pages/employer/Applications";
import EmployerJobs from "./pages/employer/EmployerJobs";
import Settings from "./pages/employer/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/jobseeker" element={<RegisterJobSeeker />} />
          <Route path="/register/employer" element={<RegisterEmployer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Employer Routes */}
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/employer/post-job" element={<PostJob />} />
          <Route path="/employer/applications" element={<Applications />} />
          <Route path="/employer/jobs" element={<EmployerJobs />} />
          <Route path="/employer/settings" element={<Settings />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
