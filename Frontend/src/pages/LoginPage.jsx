import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { IconInput } from '@/components/auth/IconInput';
import { PasswordInput } from '@/components/auth/PasswordInput';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Login attempt:', { email, password });
    setTimeout(() => setIsLoading(false), 1500);
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
            Welcome Back
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-6">
            Sign in to your BookLedger account
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <IconInput
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <PasswordInput
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer select-none"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="submit"
                className="w-full animated-gradient text-white h-11 shadow-lg shadow-primary/25"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </motion.div>
          </form>


        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-border/50 bg-muted/20 text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              to="/auth/signup"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
