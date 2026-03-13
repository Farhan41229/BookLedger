import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { IconInput } from '@/components/auth/IconInput';
import toast from 'react-hot-toast';
import { PasswordInput } from '@/components/auth/PasswordInput';
import useAuthStore from '@/store/authStore';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { register, isLoading, error, message, clearError, clearMessage } = useAuthStore();

  useEffect(() => {
    clearError();
    clearMessage();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await register(name, email, password);
    if (result.success) {
      toast.success('Registration successful! Please log in.');
      navigate('/auth/login');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="z-10"
    >
      <div className="glass rounded-2xl shadow-xl max-w-lg w-full mx-4 overflow-hidden">
        <div className="p-10">
          <h2 className="text-3xl font-bold mb-2 text-center gradient-text">
            Create an Account
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-6">
            Join BookLedger to start shopping
          </p>

          {error && (
            <div className="text-destructive text-sm text-center bg-destructive/10 rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          {message && (
            <div className="text-primary text-sm text-center bg-primary/10 rounded-lg p-3 mb-4">
              {message}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <IconInput
              icon={User}
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <IconInput
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <PasswordInput
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="submit"
                className="w-full animated-gradient text-white h-11 mt-4 shadow-lg shadow-primary/25"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Sign Up'
                )}
              </Button>
            </motion.div>
          </form>
        </div>

        <div className="px-8 py-4 border-t border-border/50 bg-muted/20 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
