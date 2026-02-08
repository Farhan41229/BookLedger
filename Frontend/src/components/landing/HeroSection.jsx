import { ArrowRight, CheckCircle2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const HeroSection = () => {
  return (
    <section id="hero" className="pt-20 pb-16 md:pt-28 md:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <Badge variant="secondary" className="w-fit">
              Now serving 1,000+ bookstores worldwide
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              The Modern Way to Manage Your{' '}
              <span className="text-primary">Bookstore</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl">
              BookLedger streamlines inventory, sales, and customer management for bookstores of all sizes.
              Spend less time on paperwork, more time with books.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm">Cancel anytime</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gap-2">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-sm">
                <span className="font-semibold">4.9/5</span>
                <span className="text-muted-foreground"> from 500+ reviews</span>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border">
              <div className="bg-card rounded-lg shadow-2xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div className="h-3 w-32 bg-muted rounded"></div>
                    <div className="flex gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-muted rounded"></div>
                    <div className="h-4 w-5/6 bg-muted rounded"></div>
                    <div className="h-4 w-4/6 bg-muted rounded"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="h-20 bg-blue-100 dark:bg-blue-950 rounded"></div>
                    <div className="h-20 bg-green-100 dark:bg-green-950 rounded"></div>
                    <div className="h-20 bg-purple-100 dark:bg-purple-950 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 h-24 w-24 bg-primary/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 h-32 w-32 bg-blue-400/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
