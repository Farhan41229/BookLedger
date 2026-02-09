import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

const VerifyEmailPage = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    const newCode = [...code];

    // Handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || '';
      }
      setCode(newCode);

      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== '');
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    setIsLoading(true);
    console.log('Verifying code:', verificationCode);
    setTimeout(() => setIsLoading(false), 1500);
  };

  // Auto-submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== '')) {
      handleSubmit(new Event('submit'));
    }
  }, [code]);

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
            Verify Your Email
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-6">
            Enter the 6-digit code sent to your email address.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="6"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl font-bold bg-muted text-foreground border-2 border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none transition-colors"
                />
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="submit"
                className="w-full animated-gradient text-white h-11 shadow-lg shadow-primary/25"
                disabled={isLoading || code.some((digit) => !digit)}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Verify Email'
                )}
              </Button>
            </motion.div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-border/50 bg-muted/20 text-center">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the code?{' '}
            <button
              type="button"
              className="text-primary font-medium hover:underline"
              onClick={() => console.log('Resend code clicked')}
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default VerifyEmailPage;
