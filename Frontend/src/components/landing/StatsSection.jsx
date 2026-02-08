import { TrendingUp, Users, Package, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

const stats = [
  {
    icon: Users,
    value: 1000,
    suffix: '+',
    label: 'Happy Bookstores',
    description: 'Trust BookLedger daily',
  },
  {
    icon: Package,
    value: 5,
    suffix: 'M+',
    label: 'Books Managed',
    description: 'Across all platforms',
  },
  {
    icon: DollarSign,
    value: 50,
    prefix: '$',
    suffix: 'M+',
    label: 'Sales Processed',
    description: 'Revenue facilitated',
  },
  {
    icon: TrendingUp,
    value: 99.9,
    suffix: '%',
    decimals: 1,
    label: 'Uptime Guarantee',
    description: 'Rock-solid reliability',
  },
];

const StatsSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section id="stats" className="py-24 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient -z-10" />
      {/* Overlay pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] -z-[5]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm mb-5">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-1 text-white">
                  {inView ? (
                    <>
                      {stat.prefix || ''}
                      <CountUp
                        end={stat.value}
                        duration={2.5}
                        decimals={stat.decimals || 0}
                        separator=","
                      />
                      {stat.suffix || ''}
                    </>
                  ) : (
                    <span>{stat.prefix || ''}{stat.value}{stat.suffix || ''}</span>
                  )}
                </div>
                <div className="text-white font-medium mb-1">{stat.label}</div>
                <div className="text-white/60 text-sm">{stat.description}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
