import { ArrowRight, CheckCircle2, Star, BookOpen, BarChart3, ShoppingCart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const HeroSection = () => {
  return (
    <section id="hero" className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-72 w-72 bg-primary/8 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-40 right-20 h-96 w-96 bg-purple-400/8 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/3 h-64 w-64 bg-blue-400/8 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '4s' }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
              <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium gap-2 border border-primary/20">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Now serving 1,000+ bookstores worldwide
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight"
            >
              The Modern Way
              <br />
              to Manage Your{' '}
              <span className="gradient-text">Bookstore</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
            >
              BookLedger streamlines inventory, sales, and customer management
              for bookstores of all sizes. Spend less time on paperwork, more
              time with books.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/25 text-base px-8 h-12">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-12">
                Watch Demo
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
              className="flex flex-wrap gap-x-6 gap-y-2"
            >
              {['No credit card required', '14-day free trial', 'Cancel anytime'].map((text) => (
                <div key={text} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-muted-foreground">{text}</span>
                </div>
              ))}
            </motion.div>

            {/* Rating */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={5}
              className="flex items-center gap-4 pt-2"
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-sm">
                <span className="font-semibold">4.9/5</span>
                <span className="text-muted-foreground"> from 500+ reviews</span>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative hidden lg:block"
          >
            {/* Main Dashboard Card */}
            <div className="relative bg-card rounded-2xl shadow-2xl border p-6 z-10">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between pb-5 border-b">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">BookLedger Dashboard</div>
                    <div className="text-xs text-muted-foreground">Today's Overview</div>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-3 gap-3 pt-5">
                <div className="rounded-xl bg-primary/5 border border-primary/10 p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs text-muted-foreground">Sales</span>
                  </div>
                  <div className="text-lg font-bold">$2,847</div>
                  <div className="text-xs text-emerald-600 font-medium">+12.5%</div>
                </div>
                <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-xs text-muted-foreground">Books</span>
                  </div>
                  <div className="text-lg font-bold">1,284</div>
                  <div className="text-xs text-emerald-600 font-medium">+8.2%</div>
                </div>
                <div className="rounded-xl bg-purple-500/5 border border-purple-500/10 p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-3.5 w-3.5 text-purple-600" />
                    <span className="text-xs text-muted-foreground">Orders</span>
                  </div>
                  <div className="text-lg font-bold">156</div>
                  <div className="text-xs text-emerald-600 font-medium">+5.1%</div>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="mt-5 rounded-xl bg-muted/40 p-4">
                <div className="text-xs font-medium mb-3">Revenue Overview</div>
                <div className="flex items-end gap-1.5 h-24">
                  {[40, 55, 35, 70, 50, 80, 65, 90, 75, 85, 60, 95].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.5, delay: 0.8 + i * 0.05 }}
                      className="flex-1 bg-primary/20 rounded-sm hover:bg-primary/40 transition-colors"
                      style={{ minHeight: 4 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Card - Top Right */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="absolute -top-4 -right-4 bg-card rounded-xl shadow-lg border p-3 z-20 animate-float"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold">Order Complete</div>
                  <div className="text-xs text-muted-foreground">Just now</div>
                </div>
              </div>
            </motion.div>

            {/* Floating Card - Bottom Left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-lg border p-3 z-20 animate-float-delayed"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-semibold">AI Insight</div>
                  <div className="text-xs text-muted-foreground">Restock Fiction</div>
                </div>
              </div>
            </motion.div>

            {/* Background gradient blob */}
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 via-purple-400/5 to-blue-400/5 rounded-3xl -z-10 blur-sm" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
