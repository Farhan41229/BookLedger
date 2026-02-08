import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const CTASection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="relative overflow-hidden rounded-3xl animated-gradient p-12 md:p-20">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:2rem_2rem]" />

            {/* Floating decorations */}
            <div className="absolute top-10 left-10 h-40 w-40 bg-white/5 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-10 right-10 h-52 w-52 bg-white/5 rounded-full blur-3xl animate-float-delayed" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-white/[0.02] rounded-full blur-3xl" />

            <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-10 items-center">
              {/* Left content */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-sm font-medium mb-8 backdrop-blur-sm">
                    <Sparkles className="h-4 w-4" />
                    Try it now
                  </div>
                </motion.div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white tracking-tight leading-[1.15]">
                  Ready to level up your
                  <br />
                  bookstore process?
                </h2>
                <p className="text-lg text-white/60 max-w-xl leading-relaxed">
                  Supports small businesses with simple invoicing, powerful integrations, and cash flow management tools.
                </p>
              </div>

              {/* Right: CTA buttons */}
              <div className="flex flex-col gap-4">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 gap-2 shadow-lg text-base px-8 h-13 font-semibold"
                >
                  Get Started Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 text-base px-8 h-13 gap-2"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="relative z-10 text-sm text-white/40 mt-10 md:mt-6">
              No credit card required · 14-day free trial · Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
