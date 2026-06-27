import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { apiRequest } from '@/lib/api';
import { AdminDashboardStats } from '@/types/app.types';
import { Loader2, Users, Building2, Briefcase, FileText, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalUsers: 0,
    totalEmployers: 0,
    totalJobs: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiRequest<AdminDashboardStats>('/admin/dashboard');
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err: unknown) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Registered Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      link: '/admin/users',
    },
    {
      title: 'Partner Employers',
      value: stats.totalEmployers,
      icon: Building2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      link: '/admin/employers',
    },
    {
      title: 'Active Job Listings',
      value: stats.totalJobs,
      icon: Briefcase,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      link: '/admin/jobs',
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: FileText,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      link: '/admin/dashboard',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Platform Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time statistics and operational controls for Adroit Tech Services.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <Link key={card.title} to={card.link}>
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border flex items-center justify-between hover:border-primary/30 transition-all cursor-pointer">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.title}</p>
                  <h3 className="font-display text-3xl font-bold text-foreground">{card.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Building2 className="h-5 w-5" />
                <span>Employer Verification</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Review pending employer registrations, check GST/PAN documents, and grant portal access.
              </p>
            </div>
            <Link to="/admin/employers">
              <span className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                Manage Employers <ArrowUpRight className="h-4 w-4 ml-1" />
              </span>
            </Link>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-card border border-border flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Users className="h-5 w-5" />
                <span>User Accounts</span>
              </div>
              <p className="text-sm text-muted-foreground">
                View all registered candidates and employers, update status, and audit user roles.
              </p>
            </div>
            <Link to="/admin/users">
              <span className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                Manage Users <ArrowUpRight className="h-4 w-4 ml-1" />
              </span>
            </Link>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-card border border-border flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Briefcase className="h-5 w-5" />
                <span>Job Openings Moderation</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Feature prominent job postings on the homepage or perform administrative removal of outdated jobs.
              </p>
            </div>
            <Link to="/admin/jobs">
              <span className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                Manage Jobs <ArrowUpRight className="h-4 w-4 ml-1" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
