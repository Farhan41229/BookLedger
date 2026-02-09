import { TrendingUp, Users, Package, DollarSign, ArrowRight, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUpModule from 'react-countup';
const CountUp = CountUpModule.default || CountUpModule;

const StatsSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  // Chart data for the mini chart
  const chartData = [25, 40, 35, 50, 45, 65, 60, 78, 72, 85, 80, 95];

  return (
    <section id="stats" className="py-28 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-muted/30 -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <TrendingUp className="h-4 w-4" />
            Why Us
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight">
            Why they prefer <span className="gradient-text">BookLedger</span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {/* Card 1: 1000+ Bookstores - Large stat */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative rounded-3xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 md:p-10 overflow-hidden
              hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="text-6xl md:text-7xl font-bold text-primary mb-4 tracking-tighter">
                {inView ? (
                  <>
                    <CountUp end={3} duration={2} />
                    k+
                  </>
                ) : (
                  '3k+'
                )}
              </div>
              <p className="text-xl font-semibold text-foreground mb-2">
                Businesses already running
              </p>
              <p className="text-muted-foreground">on BookLedger</p>
            </div>
          </motion.div>

          {/* Card 2: Instant access with icon transfer */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative rounded-3xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 md:p-10 overflow-hidden
              hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
                Instant Access to your books at any time
              </h3>
              {/* Transfer Icons */}
              <div className="flex items-center gap-4 mt-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 }}
                  className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center"
                >
                  <Package className={`h-7 w-7 text-primary`} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={inView ? { opacity: 1, scaleX: 1 } : {}}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  className="flex-1 h-[2px] bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40 relative"
                >
                  <motion.div
                    animate={{ x: [0, 60, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="absolute top-1/2 -translate-y-1/2 left-0 h-1.5 w-8 rounded-full bg-primary/40 blur-sm"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.7 }}
                  className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center"
                >
                  <BarChart className={`h-7 w-7 text-emerald-600`} />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: No data loss + Mini chart - Full width */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-2 group relative rounded-3xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden
              hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 grid md:grid-cols-2 gap-0">
              {/* Left: text content */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
                  No data loss
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Your inventory and sales data is always backed up and secure. Generate reports on your bookstore performance without missing a single transaction.
                </p>
                <div className="flex gap-8">
                  <div>
                    <div className="text-3xl font-bold text-foreground">
                      {inView ? <CountUp end={99.9} duration={2.5} decimals={1} suffix="%" /> : '99.9%'}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Uptime</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-foreground">
                      {inView ? <CountUp end={5} duration={2} suffix="M+" /> : '5M+'}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Books managed</p>
                  </div>
                </div>
              </div>

              {/* Right: Chart */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="rounded-2xl border border-border/40 bg-background/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground font-medium">Summary</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">6 Months</span>
                  </div>
                  <div className="text-3xl font-bold mb-6 tracking-tight">
                    {inView ? (
                      <>
                        $<CountUp end={1876580} duration={2.5} separator="," />
                      </>
                    ) : (
                      '$1,876,580'
                    )}
                  </div>
                  {/* SVG Area Chart */}
                  <div className="relative h-32 w-full">
                    <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.488 0.243 264 / 20%)" />
                          <stop offset="100%" stopColor="oklch(0.488 0.243 264 / 2%)" />
                        </linearGradient>
                      </defs>
                      {/* Area fill */}
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                        transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                        d={`M0,${100 - chartData[0]} ${chartData.map((v, i) => `L${(i * 300) / (chartData.length - 1)},${100 - v}`).join(' ')} L300,${100 - chartData[chartData.length - 1]} L300,100 L0,100 Z`}
                        fill="url(#chartGradient)"
                      />
                      {/* Line */}
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={inView ? { pathLength: 1 } : {}}
                        transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                        d={`M0,${100 - chartData[0]} ${chartData.map((v, i) => `L${(i * 300) / (chartData.length - 1)},${100 - v}`).join(' ')}`}
                        fill="none"
                        stroke="oklch(0.488 0.243 264)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {/* X-axis labels */}
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground/60">
                      {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map((m) => (
                        <span key={m}>{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
