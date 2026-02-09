import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export const IconInput = ({ icon: Icon, className, ...props }) => {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input className={cn('pl-10', className)} {...props} />
    </div>
  );
};
