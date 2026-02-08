import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const CTASection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="relative overflow-hidden rounded-3xl animated-gradient p-12 md:p-20">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:2rem_2rem]" />

            {/* Floating decorations */}
            <div className="absolute top-10 left-10 h-32 w-32 bg-white/5 rounded-full blur-2xl animate-float" />
            <div className="absolute bottom-10 right-10 h-40 w-40 bg-white/5 rounded-full blur-2xl animate-float-delayed" />

            <div className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-sm font-medium mb-8 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4" />
                  Start for free today
                </div>
              </motion.div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-white tracking-tight">
                Ready to Transform
                <br />
                Your Bookstore?
              </h2>
              <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed">
                Join 1,000+ bookstores already using BookLedger to streamline
                operations and boost sales.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 gap-2 shadow-lg text-base px-8 h-12"
                >
                  Start Your Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 text-base px-8 h-12"
                >
                  Schedule a Demo
                </Button>
              </div>

              <p className="text-sm text-white/50 mt-8">
                No credit card required · 14-day free trial · Cancel anytime
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
