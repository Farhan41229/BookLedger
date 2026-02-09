import {
  Package,
  TrendingUp,
  Users,
  BarChart3,
  ShoppingCart,
  Clock,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    icon: Package,
    title: 'Inventory Management',
    description: 'Track stock levels, automate reordering, and manage multiple locations with ease.',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10',
    iconBg: 'bg-blue-100 dark:bg-blue-500/20',
    hoverBorder: 'hover:border-blue-500/30',
  },
  {
    icon: ShoppingCart,
    title: 'Point of Sale',
    description: 'Fast checkout, multiple payment options, and receipt printing built right in.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
    iconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
    hoverBorder: 'hover:border-emerald-500/30',
  },
  {
    icon: Users,
    title: 'Customer Management',
    description: 'Build relationships with customer profiles, purchase history, and loyalty programs.',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-500/10',
    iconBg: 'bg-purple-100 dark:bg-purple-500/20',
    hoverBorder: 'hover:border-purple-500/30',
  },
  {
    icon: BarChart3,
    title: 'Sales Analytics',
    description: 'Real-time insights into sales trends, bestsellers, and revenue performance.',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    iconBg: 'bg-amber-100 dark:bg-amber-500/20',
    hoverBorder: 'hover:border-amber-500/30',
  },
  {
    icon: TrendingUp,
    title: 'Smart Recommendations',
    description: 'AI-powered suggestions for restocking and personalized customer recommendations.',
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-500/10',
    iconBg: 'bg-pink-100 dark:bg-pink-500/20',
    hoverBorder: 'hover:border-pink-500/30',
  },
  {
    icon: Clock,
    title: 'Time-Saving Automation',
    description: 'Automate routine tasks like invoicing, reporting, and inventory alerts.',
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-500/10',
    iconBg: 'bg-cyan-100 dark:bg-cyan-500/20',
    hoverBorder: 'hover:border-cyan-500/30',
  },
];

const FeatureCard = ({ feature, index, inView }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <div
        className={`relative h-full rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-7
        transition-all duration-500 ease-out
        hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 hover:border-primary/20
        ${feature.hoverBorder}`}
      >
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
          {/* Icon */}
          <div className={`h-14 w-14 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6
            transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
            <Icon className={`h-7 w-7 ${feature.color}`} />
          </div>

          {/* Title with arrow */}
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2 tracking-tight">
            {feature.title}
            <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-2 translate-y-1 group-hover:opacity-60 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-400" />
          </h3>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed text-[15px]">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [gridRef, gridInView] = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section id="features" className="py-28 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 right-10 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[100px] animate-float" />
        <div className="absolute bottom-20 left-10 w-[600px] h-[600px] rounded-full bg-purple-500/[0.04] blur-[100px] animate-float-delayed" />
      </div>
      <div className="absolute inset-0 bg-muted/20 -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two-column header like Finpay */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-end mb-20"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={headerInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="h-4 w-4" />
              Powerful Features
            </motion.div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15]">
              Experience that grows{' '}
              <span className="gradient-text">with your scale.</span>
            </h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-lg text-muted-foreground leading-relaxed lg:max-w-md">
              Design a bookstore management system that works for your business and streamlined operations from inventory to checkout.
            </p>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} inView={gridInView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
