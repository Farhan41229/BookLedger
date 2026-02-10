import { Outlet, Link } from 'react-router';
import { Book } from 'lucide-react';
import { FloatingShape } from '@/components/auth/FloatingShape';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        {/* This is where the Login/Signup form will appear */}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;