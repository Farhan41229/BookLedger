import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Zap, Shield, ArrowUpRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInView } from 'react-intersection-observer';

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small independent bookstores just getting started.',
      monthlyPrice: 29,
      annualPrice: 24,
      icon: Zap,
      features: [
        'Up to 2,000 inventory items',
        '2 staff accounts',
        'Basic POS system',
        'Daily sales reports',
        'Email support',
        'Cloud backup',
      ],
      limitations: [
        'No e-commerce integration',
        'No loyalty program',
        'No API access',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Professional',
      description: 'Ideal for growing bookstores with higher volume and online sales.',
      monthlyPrice: 79,
      annualPrice: 65,
      icon: Sparkles,
      features: [
        'Unlimited inventory items',
        '5 staff accounts',
        'Advanced POS with dual screen',
        'E-commerce integration (Shopify/Woo)',
        'Customer loyalty program',
        'Advanced analytics & insights',
        'Priority chat & phone support',
        'Marketing tools built-in',
      ],
      limitations: [],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'For multi-location chains requiring custom solutions and scale.',
      monthlyPrice: 'Custom',
      annualPrice: 'Custom',
      icon: Shield,
      features: [
        'Unlimited everything',
        'Multi-location management',
        'Headless API access',
        'Dedicated account manager',
        'Custom development',
        'SSO & advanced security',
        'Warehouse management',
        'On-site training',
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-28 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Choose Plan
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
            Transparent Plans for{' '}
            <span className="gradient-text">Every Stage</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Choose the plan that fits your bookstore's needs. No hidden fees.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
            <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annual{' '}
              <span className="text-emerald-600 font-bold text-xs ml-1">
                (Save 20%)
              </span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const isCustom = typeof price === 'string';

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.1 + index * 0.12,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="group"
              >
                <div
                  className={`relative flex flex-col h-full rounded-3xl border p-8 transition-all duration-500
                    ${
                      plan.popular
                        ? 'bg-gradient-to-b from-primary via-primary to-[oklch(0.4_0.22_264)] text-white border-primary/50 shadow-2xl shadow-primary/20 scale-[1.02] md:scale-105'
                        : 'bg-card/80 border-border/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5'
                    }
                    hover:-translate-y-2`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      <Badge className="bg-white text-primary hover:bg-white border-none px-4 py-1 shadow-lg font-semibold">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className={`text-sm ${plan.popular ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      {isCustom ? (
                        <span className="text-4xl font-bold">Custom</span>
                      ) : (
                        <>
                          <span className="text-lg font-bold">$</span>
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={price}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.2 }}
                              className="text-5xl font-bold tracking-tight"
                            >
                              {price}
                            </motion.span>
                          </AnimatePresence>
                          <span className={`ml-1 ${plan.popular ? 'text-white/60' : 'text-muted-foreground'}`}>
                            /month
                          </span>
                        </>
                      )}
                    </div>
                    {!isCustom && isAnnual && (
                      <div className={`text-xs font-medium mt-2 ${plan.popular ? 'text-white/50' : 'text-emerald-600'}`}>
                        Billed ${price * 12} yearly
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3.5 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <div
                          className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${
                            plan.popular
                              ? 'bg-white/20'
                              : 'bg-emerald-500/10'
                          }`}
                        >
                          <Check
                            className={`h-3 w-3 ${
                              plan.popular ? 'text-white' : 'text-emerald-600'
                            }`}
                          />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, i) => (
                      <li
                        key={`lim-${i}`}
                        className={`flex items-start gap-3 text-sm ${plan.popular ? 'text-white/40' : 'text-muted-foreground/50'}`}
                      >
                        <div className="mt-0.5 h-5 w-5 rounded-full bg-muted/50 flex items-center justify-center shrink-0">
                          <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                        </div>
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    size="lg"
                    className={`w-full gap-2 group/btn ${
                      plan.popular
                        ? 'bg-white text-primary hover:bg-white/90 shadow-lg'
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
