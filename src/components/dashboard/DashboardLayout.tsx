import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Car,
  Droplets,
  DollarSign,
  Users,
  Settings,
  BarChart3,
  Gift,
  Building,
  Wrench,
  Clock,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const ownerNav: NavItem[] = [
  { href: '/dashboard/owner', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/owner/branches', label: 'Branches', icon: Building },
  { href: '/dashboard/owner/revenue', label: 'Revenue', icon: DollarSign },
  { href: '/dashboard/owner/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/owner/settings', label: 'Settings', icon: Settings },
];

const managerNav: NavItem[] = [
  { href: '/dashboard/manager', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/manager/operators', label: 'Operators', icon: Users },
  { href: '/dashboard/manager/services', label: 'Services', icon: Wrench },
  { href: '/dashboard/manager/alerts', label: 'Alerts', icon: Clock },
];

const operatorNav: NavItem[] = [
  { href: '/dashboard/operator', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/operator/new', label: 'New Job', icon: Car },
  { href: '/dashboard/operator/today', label: "Today's Jobs", icon: Clock },
  { href: '/dashboard/operator/earnings', label: 'Earnings', icon: DollarSign },
];

const customerNav: NavItem[] = [
  { href: '/dashboard/customer', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/customer/vehicles', label: 'My Vehicles', icon: Car },
  { href: '/dashboard/customer/history', label: 'History', icon: Clock },
  { href: '/dashboard/customer/loyalty', label: 'Rewards', icon: Gift },
];

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();

  const getNavItems = (): NavItem[] => {
    switch (user?.role) {
      case 'owner':
        return ownerNav;
      case 'manager':
        return managerNav;
      case 'operator':
        return operatorNav;
      case 'customer':
        return customerNav;
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border p-4 hidden lg:block overflow-y-auto">
          <div className="mb-6 px-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              {user?.role} Dashboard
            </p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
