import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Heart,
  Sparkles,
  Shield,
  Target,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const values = [
  {
    icon: Target,
    title: 'Mission-driven',
    description:
      'We exist to help bookstores thrive with tools that are simple, reliable, and built for the way you work.',
  },
  {
    icon: Shield,
    title: 'Trust & security',
    description:
      'Your data and your customers’ data stay safe. We use industry best practices so you can focus on running your store.',
  },
  {
    icon: Heart,
    title: 'Built for book lovers',
    description:
      'BookLedger is designed by people who care about books and the independent stores that sell them.',
  },
  {
    icon: Sparkles,
    title: 'Always improving',
    description:
      'We listen to store owners and keep improving inventory, sales, and reporting so you stay ahead.',
  },
];

const AboutPage = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [missionRef, missionInView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });
  const [valuesRef, valuesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 h-72 w-72 bg-primary/8 rounded-full blur-3xl animate-pulse-glow" />
          <div
            className="absolute top-40 right-20 h-96 w-96 bg-purple-400/8 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDelay: '2s' }}
          />
          <div
            className="absolute bottom-20 left-1/3 h-64 w-64 bg-blue-400/8 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDelay: '4s' }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        <div ref={heroRef} className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge
              variant="secondary"
              className="px-4 py-1.5 text-sm font-medium gap-2 border border-primary/20 mb-6"
            >
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              Our story
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
              About <span className="gradient-text">BookLedger</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              The modern way to manage your bookstore. We help independent
              stores and chains streamline operations, boost sales, and delight
              customers with tools built for book lovers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission / Story */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/30 -z-10" />
        <div
          ref={missionRef}
          className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={missionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="rounded-3xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
                Why <span className="gradient-text">BookLedger</span> exists
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We started with a simple idea: bookstores deserve software that
                feels as good as the books they sell. Too many tools are
                clunky, expensive, or built for generic retail.{" "}
                <span className="font-medium text-foreground">BookLedger</span>{" "}
                is built specifically for bookstores—inventory, point of sale,
                customer management, and reporting—so you can spend less time
                on paperwork and more time with your community and your
                shelves.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you run a single shop or multiple locations, we’re here
                to help you grow. Our goal is to be the system you trust every
                day.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values / Pillars */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 -z-10" />
        <div
          ref={valuesRef}
          className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              What we stand for
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight">
              Our values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  animate={
                    valuesInView ? { opacity: 1, y: 0, scale: 1 } : {}
                  }
                  transition={{
                    duration: 0.6,
                    delay: 0.1 + index * 0.1,
                  }}
                  className="group relative rounded-3xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ctaRef}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={ctaInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Ready to streamline your bookstore?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of stores already using BookLedger.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="animated-gradient text-white shadow-lg shadow-primary/25 gap-2"
                asChild
              >
                <Link to="/auth/login">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link to="/">Back to home</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
