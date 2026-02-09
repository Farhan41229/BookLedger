import { UserPlus, Upload, Settings, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const steps = [
  {
    icon: UserPlus,
    number: '1',
    title: 'Open your account',
    description: 'Sign up to BookLedger and set up your account from the dashboard.',
  },
  {
    icon: Upload,
    number: '2',
    title: 'Import your data',
    description: 'Upload your existing inventory via CSV or enter books manually.',
  },
  {
    icon: Settings,
    number: '3',
    title: 'Customize & Configure',
    description: 'Set up your store preferences, payment methods, and staff permissions.',
  },
  {
    icon: Rocket,
    number: '4',
    title: 'Start selling',
    description: "You're ready to go! Process sales, manage inventory, and grow.",
  },
];

const HowItWorksSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="how-it-works" className="py-28 relative overflow-hidden">
      {/* Dark background */}
      <div className="absolute inset-0 -z-10 animated-gradient" />
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:3rem_3rem] -z-[5]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6 backdrop-blur-sm">
            <Rocket className="h-4 w-4" />
            Step by Step
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15]">
            Maximize your returns with a{' '}
            <span className="text-white/60">BookLedger account that generates.</span>
          </h2>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="group"
              >
                <div className="relative rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] p-7 h-full
                  hover:bg-white/[0.10] hover:border-white/[0.15] transition-all duration-500 overflow-hidden">
                  {/* Large background number */}
                  <span className="absolute -top-4 -left-1 text-[120px] font-bold text-white/[0.04] leading-none select-none pointer-events-none
                    group-hover:text-white/[0.08] transition-colors duration-500">
                    {step.number}
                  </span>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center mb-20
                      group-hover:bg-white/15 transition-all duration-500 group-hover:scale-110">
                      <Icon className="h-6 w-6 text-white/80" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
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
