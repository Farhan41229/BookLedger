import {
  Package,
  TrendingUp,
  Users,
  BarChart3,
  ShoppingCart,
  Clock
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

const features = [
  {
    icon: Package,
    title: 'Inventory Management',
    description: 'Track stock levels, automate reordering, and manage multiple locations with ease.',
  },
  {
    icon: ShoppingCart,
    title: 'Point of Sale',
    description: 'Fast checkout, multiple payment options, and receipt printing built right in.',
  },
  {
    icon: Users,
    title: 'Customer Management',
    description: 'Build relationships with customer profiles, purchase history, and loyalty programs.',
  },
  {
    icon: BarChart3,
    title: 'Sales Analytics',
    description: 'Real-time insights into sales trends, bestsellers, and revenue performance.',
  },
  {
    icon: TrendingUp,
    title: 'Smart Recommendations',
    description: 'AI-powered suggestions for restocking and personalized customer recommendations.',
  },
  {
    icon: Clock,
    title: 'Time-Saving Automation',
    description: 'Automate routine tasks like invoicing, reporting, and inventory alerts.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Run Your Bookstore
          </h2>
          <p className="text-lg text-muted-foreground">
            From inventory to checkout, BookLedger handles it all so you can focus on what matters most.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
