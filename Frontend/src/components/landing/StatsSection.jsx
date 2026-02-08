import { TrendingUp, Users, Package, DollarSign } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '1,000+',
    label: 'Happy Bookstores',
  },
  {
    icon: Package,
    value: '5M+',
    label: 'Books Managed',
  },
  {
    icon: DollarSign,
    value: '$50M+',
    label: 'Sales Processed',
  },
  {
    icon: TrendingUp,
    value: '99.9%',
    label: 'Uptime Guarantee',
  },
];

const StatsSection = () => {
  return (
    <section id="stats" className="py-20 bg-gradient-to-br from-primary to-blue-600 text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <Icon className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80 text-sm md:text-base">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
