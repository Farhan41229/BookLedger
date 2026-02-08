import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, Sparkles, Zap, Shield } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small independent bookstores just getting started.",
      monthlyPrice: 29,
      annualPrice: 24,
      icon: Zap,
      features: [
        "Up to 2,000 inventory items",
        "2 staff accounts",
        "Basic POS system",
        "Daily sales reports",
        "Email support",
        "Cloud backup"
      ],
      limitations: [
        "No e-commerce integration",
        "No loyalty program",
        "No API access"
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "blue"
    },
    {
      name: "Professional",
      description: "Ideal for growing bookstores with higher volume and online sales.",
      monthlyPrice: 79,
      annualPrice: 65,
      icon: Sparkles,
      features: [
        "Unlimited inventory items",
        "5 staff accounts",
        "Advanced POS with dual screen",
        "E-commerce integration (Shopify/Woo)",
        "Customer loyalty program",
        "Advanced analytics & insights",
        "Priority chat & phone support",
        "Marketing tools built-in"
      ],
      limitations: [],
      cta: "Start Free Trial",
      popular: true,
      color: "primary"
    },
    {
      name: "Enterprise",
      description: "For multi-location chains requiring custom solutions and scale.",
      monthlyPrice: "Custom",
      annualPrice: "Custom",
      icon: Shield,
      features: [
        "Unlimited everything",
        "Multi-location management",
        "Headless API access",
        "Dedicated account manager",
        "Custom development",
        "SSO & advanced security",
        "Warehouse management",
        "On-site training"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false,
      color: "purple"
    }
  ];

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Simple Pricing
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Transparent Plans for <span className="gradient-text">Every Stage</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Choose the plan that fits your bookstore's needs. No hidden fees.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
            <Switch 
              checked={isAnnual} 
              onCheckedChange={setIsAnnual} 
            />
            <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annual <span className="text-emerald-600 font-bold text-xs ml-1">(Save 20%)</span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto perspective-1000">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const isCustom = typeof price === 'string';
            
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30, rotateX: 5 }}
                animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ 
                  y: -10, 
                  rotateX: 2, 
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
                }}
                className={`relative flex flex-col glass-card transition-all duration-300 preserve-3d group ${
                  plan.popular ? 'ring-2 ring-primary/40 z-10 scale-105 md:scale-110' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary hover:to-purple-600 border-none px-4 py-1 animate-pulse-badge shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="mb-8">
                  <div className={`h-12 w-12 rounded-xl bg-${plan.color}-500/10 flex items-center justify-center mb-6`}>
                    <Icon className={`h-6 w-6 text-${plan.color === 'primary' ? 'primary' : plan.color + '-600'}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    {isCustom ? (
                      <span className="text-4xl font-bold">Custom</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold">$</span>
                        <span className="text-5xl font-bold tracking-tight">
                          {price}
                        </span>
                        <span className="text-muted-foreground ml-2">/mo</span>
                      </>
                    )}
                  </div>
                  {!isCustom && isAnnual && (
                    <div className="text-xs text-emerald-600 font-medium mt-2">
                      Billed ${price * 12} yearly
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div className="mt-0.5 h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground/60">
                      <div className="mt-0.5 h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                      </div>
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  size="lg" 
                  variant={plan.popular ? 'default' : 'outline'}
                  className={`w-full ${plan.popular ? 'shadow-lg shadow-primary/25' : ''}`}
                >
                  {plan.cta}
                </Button>
                
                {/* Gradient Border on Hover */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
