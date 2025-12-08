import { useNavigate } from 'react-router-dom';
import { Building, Users, Wrench, Car, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Header } from '@/components/layout/Header';

const roles: { role: UserRole; label: string; description: string; icon: typeof Building }[] = [
  {
    role: 'owner',
    label: 'Owner',
    description: 'Manage branches, view revenue, and oversee all operations',
    icon: Building,
  },
  {
    role: 'manager',
    label: 'Manager',
    description: 'Manage operators, track services, and handle branch operations',
    icon: Users,
  },
  {
    role: 'operator',
    label: 'Operator',
    description: 'Process wash and service jobs, track earnings',
    icon: Wrench,
  },
  {
    role: 'customer',
    label: 'Customer',
    description: 'Track vehicles, view history, and earn rewards',
    icon: Car,
  },
];

export default function Login() {
  const { login, connectWallet, walletConnected, walletAddress } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: UserRole) => {
    login(role);
    switch (role) {
      case 'owner':
        navigate('/dashboard/owner');
        break;
      case 'manager':
        navigate('/dashboard/manager');
        break;
      case 'operator':
        navigate('/dashboard/operator');
        break;
      case 'customer':
        navigate('/dashboard/customer');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Welcome to AutoX402
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect your wallet and select your role to continue
            </p>
          </div>

          {/* Wallet Connection */}
          <div className="bg-card rounded-xl border border-border p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Core Wallet</h3>
                  <p className="text-sm text-muted-foreground">
                    {walletConnected ? walletAddress : 'Not connected'}
                  </p>
                </div>
              </div>
              <Button
                variant={walletConnected ? 'outline' : 'default'}
                onClick={connectWallet}
                disabled={walletConnected}
              >
                {walletConnected ? 'Connected' : 'Connect'}
              </Button>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground mb-4">Select Your Role</h2>
            {roles.map(({ role, label, description, icon: Icon }) => (
              <button
                key={role}
                onClick={() => handleLogin(role)}
                className="w-full p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{label}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            This is a demo application. Select any role to explore the dashboard.
          </p>
        </div>
      </main>
    </div>
  );
}
