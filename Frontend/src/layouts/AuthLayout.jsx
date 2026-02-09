import { Outlet, Link } from 'react-router';
import { Book } from 'lucide-react';
import { FloatingShape } from '@/components/auth/FloatingShape';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10 flex items-center justify-center relative overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Floating shapes */}
      <FloatingShape color="bg-primary/30" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-blue-500/30" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-purple-500/30" size="w-32 h-32" top="40%" left="-10%" delay={2} />

      {/* Logo / back to home */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 z-10 group"
      >
        <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
          <Book className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
          BookLedger
        </span>
      </Link>

      <Outlet />
    </div>
  );
};

export default AuthLayout;
