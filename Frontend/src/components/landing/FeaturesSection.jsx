import {
  Package,
  TrendingUp,
  Users,
  BarChart3,
  ShoppingCart,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    icon: Package,
    title: 'Inventory Management',
    description: 'Track stock levels, automate reordering, and manage multiple locations with ease.',
    color: 'text-blue-600',
    bg: 'bg-blue-500/10',
    border: 'group-hover:border-blue-500/30',
  },
  {
    icon: ShoppingCart,
    title: 'Point of Sale',
    description: 'Fast checkout, multiple payment options, and receipt printing built right in.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-500/10',
    border: 'group-hover:border-emerald-500/30',
  },
  {
    icon: Users,
    title: 'Customer Management',
    description: 'Build relationships with customer profiles, purchase history, and loyalty programs.',
    color: 'text-purple-600',
    bg: 'bg-purple-500/10',
    border: 'group-hover:border-purple-500/30',
  },
  {
    icon: BarChart3,
    title: 'Sales Analytics',
    description: 'Real-time insights into sales trends, bestsellers, and revenue performance.',
    color: 'text-amber-600',
    bg: 'bg-amber-500/10',
    border: 'group-hover:border-amber-500/30',
  },
  {
    icon: TrendingUp,
    title: 'Smart Recommendations',
    description: 'AI-powered suggestions for restocking and personalized customer recommendations.',
    color: 'text-pink-600',
    bg: 'bg-pink-500/10',
    border: 'group-hover:border-pink-500/30',
  },
  {
    icon: Clock,
    title: 'Time-Saving Automation',
    description: 'Automate routine tasks like invoicing, reporting, and inventory alerts.',
    color: 'text-cyan-600',
    bg: 'bg-cyan-500/10',
    border: 'group-hover:border-cyan-500/30',
  },
];

const FeaturesSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="features" className="py-24 relative">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-muted/30 -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Package className="h-4 w-4" />
            Powerful Features
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight">
            Everything You Need to Run
            <br />
            <span className="gradient-text">Your Bookstore</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From inventory to checkout, BookLedger handles it all so you can
            focus on what matters most.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className={`relative h-full bg-card rounded-2xl border p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${feature.border}`}>
                  <div className={`h-12 w-12 rounded-xl ${feature.bg} flex items-center justify-center mb-5`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2.5 flex items-center gap-2">
                    {feature.title}
                    <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300" />
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
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

export default FeaturesSection;
