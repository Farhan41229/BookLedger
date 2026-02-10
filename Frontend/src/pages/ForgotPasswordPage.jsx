import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { IconInput } from '@/components/auth/IconInput';
import useAuthStore from '@/store/authStore';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const {
    forgotPassword,
    isLoading,
    error,
    message,
    clearError,
    clearMessage,
  } = useAuthStore();

  useEffect(() => {
    clearError();
    clearMessage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
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
            Forgot Password
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-6">
            Enter your email and we&apos;ll send you a link to reset your
            password.
          </p>

          {error && (
            <div className="text-destructive text-sm text-center bg-destructive/10 rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          {message && (
            <div className="text-primary text-sm text-center bg-primary/10 rounded-lg p-3 mb-4">
              If an account exists for that email, we&apos;ve sent a reset link.
              Check your inbox.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <IconInput
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                type="submit"
                className="w-full animated-gradient text-white h-11 shadow-lg shadow-primary/25"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </motion.div>
          </form>
        </div>

        <div className="px-8 py-4 border-t border-border/50 bg-muted/20 text-center">
          <p className="text-sm text-muted-foreground">
            <Link
              to="/auth/login"
              className="text-primary font-medium hover:underline"
            >
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;
