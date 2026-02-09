import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { IconInput } from '@/components/auth/IconInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Signup attempt:', { name, email, password });
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="z-10"
    >
      <div className="glass rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-2 text-center gradient-text">
            Create Account
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-6">
            Start managing your book collection today
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <PasswordStrengthMeter password={password} />

            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={setAgreed}
                className="mt-0.5"
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground cursor-pointer select-none leading-snug"
              >
                I agree to the{' '}
                <button type="button" className="text-primary hover:underline">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-primary hover:underline">
                  Privacy Policy
                </button>
              </label>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="submit"
                className="w-full animated-gradient text-white h-11 shadow-lg shadow-primary/25"
                disabled={isLoading || !agreed}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Create Account'
                )}
              </Button>
            </motion.div>
          </form>


        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-border/50 bg-muted/20 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SignupPage;
