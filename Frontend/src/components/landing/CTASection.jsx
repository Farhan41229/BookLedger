import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const CTASection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-gradient-to-br from-primary to-blue-600 border-0 text-primary-foreground">
          <div className="p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your Bookstore?
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Join 1,000+ bookstores already using BookLedger to streamline operations and boost sales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 gap-2"
              >
                Start Your Free Trial
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Schedule a Demo
              </Button>
            </div>
            <p className="text-sm text-primary-foreground/70 mt-6">
              No credit card required · 14-day free trial · Cancel anytime
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CTASection;
