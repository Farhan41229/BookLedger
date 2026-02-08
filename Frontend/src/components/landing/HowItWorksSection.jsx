import { UserPlus, Upload, Settings, Rocket } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Sign Up',
    description: 'Create your account in under 2 minutes. No credit card required for the trial.',
  },
  {
    icon: Upload,
    number: '02',
    title: 'Import Your Data',
    description: 'Upload your existing inventory via CSV or enter books manually. We make it simple.',
  },
  {
    icon: Settings,
    number: '03',
    title: 'Customize & Configure',
    description: 'Set up your store preferences, payment methods, and staff permissions.',
  },
  {
    icon: Rocket,
    number: '04',
    title: 'Start Selling',
    description: 'You\'re ready to go! Process sales, manage inventory, and grow your business.',
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Started in 4 Simple Steps
          </h2>
          <p className="text-lg text-muted-foreground">
            Setting up BookLedger is quick and painless. You'll be up and running in no time.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connector Line (except last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-border"></div>
                )}

                <div className="relative z-10 text-center">
                  <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 mb-6 relative">
                    <Icon className="h-10 w-10 text-primary" />
                    <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
