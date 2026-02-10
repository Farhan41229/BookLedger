import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/auth/PasswordInput';
import useAuthStore from '@/store/authStore';

const MIN_PASSWORD_LENGTH = 6;

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const {
    resetPassword,
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
    setLocalError('');

    if (password.length < MIN_PASSWORD_LENGTH) {
      setLocalError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    const result = await resetPassword(token, password);
    if (result?.success) {
      navigate('/auth/login', { replace: true });
      clearMessage();
    }
  };

  const displayError = localError || error;

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
            Reset Password
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-6">
            Enter your new password below.
          </p>

          {displayError && (
            <div className="text-destructive text-sm text-center bg-destructive/10 rounded-lg p-3 mb-4">
              {displayError}
            </div>
          )}

          {message && (
            <div className="text-primary text-sm text-center bg-primary/10 rounded-lg p-3 mb-4">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={MIN_PASSWORD_LENGTH}
              required
            />

            <PasswordInput
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={MIN_PASSWORD_LENGTH}
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
                  'Reset Password'
                )}
              </Button>
            </motion.div>
          </form>
        </div>

        <div className="px-8 py-4 border-t border-border/50 bg-muted/20 text-center">
          <p className="text-sm text-muted-foreground">
            Link invalid or expired?{' '}
            <Link
              to="/auth/forgot-password"
              className="text-primary font-medium hover:underline"
            >
              Request a new link
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;
