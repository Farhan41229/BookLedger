import { UserPlus, Upload, Settings, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const steps = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Sign Up',
    description: 'Create your account in under 2 minutes. No credit card required for the trial.',
    color: 'text-blue-600',
    bg: 'bg-blue-500/10',
    ring: 'ring-blue-500/20',
  },
  {
    icon: Upload,
    number: '02',
    title: 'Import Your Data',
    description: 'Upload your existing inventory via CSV or enter books manually. We make it simple.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-500/10',
    ring: 'ring-emerald-500/20',
  },
  {
    icon: Settings,
    number: '03',
    title: 'Customize & Configure',
    description: 'Set up your store preferences, payment methods, and staff permissions.',
    color: 'text-purple-600',
    bg: 'bg-purple-500/10',
    ring: 'ring-purple-500/20',
  },
  {
    icon: Rocket,
    number: '04',
    title: 'Start Selling',
    description: "You're ready to go! Process sales, manage inventory, and grow your business.",
    color: 'text-amber-600',
    bg: 'bg-amber-500/10',
    ring: 'ring-amber-500/20',
  },
];

const HowItWorksSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Rocket className="h-4 w-4" />
            Quick Setup
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight">
            Get Started in{' '}
            <span className="gradient-text">4 Simple Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Setting up BookLedger is quick and painless. You'll be up and running in no time.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector Line (desktop only) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-blue-300 via-purple-300 to-amber-300 origin-left"
            />
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                className="relative"
              >
                <div className="relative z-10 text-center">
                  {/* Icon Circle */}
                  <div className="relative inline-flex mb-6">
                    <div className={`h-20 w-20 rounded-2xl ${step.bg} flex items-center justify-center ring-4 ${step.ring} ring-offset-2 ring-offset-background`}>
                      <Icon className={`h-9 w-9 ${step.color}`} />
                    </div>
                    <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[250px] mx-auto">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
