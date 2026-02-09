import { Check, X } from 'lucide-react';

const criteria = [
  { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'Contains uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'Contains lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { label: 'Contains a number', test: (pw) => /[0-9]/.test(pw) },
  { label: 'Contains special character', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = [
  'bg-destructive',
  'bg-orange-500',
  'bg-amber-500',
  'bg-blue-500',
  'bg-primary',
];

export const PasswordStrengthMeter = ({ password = '' }) => {
  const strength = criteria.reduce((score, c) => score + (c.test(password) ? 1 : 0), 0);

  if (!password) return null;

  return (
    <div className="space-y-3">
      {/* Strength bar */}
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i < strength ? strengthColors[strength] : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Password strength: <span className="font-medium text-foreground">{strengthLabels[strength]}</span>
      </p>

      {/* Criteria checklist */}
      <div className="space-y-1.5">
        {criteria.map((c) => {
          const met = c.test(password);
          return (
            <div key={c.label} className="flex items-center gap-2 text-xs">
              {met ? (
                <Check className="h-3.5 w-3.5 text-primary" />
              ) : (
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              <span className={met ? 'text-foreground' : 'text-muted-foreground'}>
                {c.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
