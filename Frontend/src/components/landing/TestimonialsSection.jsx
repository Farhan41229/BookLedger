import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Owner, The Reading Room',
    content:
      "BookLedger transformed how we manage inventory. We've reduced stockouts by 60% and our customers are happier than ever. The analytics alone are worth every penny.",
    rating: 5,
    avatar: 'SM',
    color: 'bg-blue-500',
    metric: '60%',
    metricLabel: 'Less stockouts',
  },
  {
    name: 'James Chen',
    role: 'Manager, Chapters & Verses',
    content:
      'The POS system is incredibly fast. Our checkout times dropped by 40%. The staff loves how intuitive everything is. Setup took less than an hour.',
    rating: 5,
    avatar: 'JC',
    color: 'bg-emerald-500',
    metric: '40%',
    metricLabel: 'Faster checkout',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Owner, Pageturner Books',
    content:
      "We switched from spreadsheets and it's been life-changing. The AI recommendations have helped us stock exactly what our customers want. Revenue is up 25%.",
    rating: 5,
    avatar: 'ER',
    color: 'bg-purple-500',
    metric: '25%',
    metricLabel: 'Revenue increase',
  },
];

const TestimonialsSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="testimonials" className="py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/[0.03] rounded-full blur-[120px]" />
      </div>
      <div className="absolute inset-0 bg-muted/20 -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Star className="h-4 w-4" />
            Our Mission
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight">
            We've helped{' '}
            <span className="gradient-text">innovative companies</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hundreds of bookstores of all sizes and across all regions have made big improvements with us.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-16 text-center"
        >
          {[
            { value: '24%', label: 'Revenue growth' },
            { value: '180K', label: 'Books tracked' },
            { value: '10+', label: 'Months of savings' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="group"
            >
              <div className="relative h-full rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-7
                hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 hover:border-primary/20 transition-all duration-500">
                {/* Hover gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Metric highlight */}
                  <div className="mb-5">
                    <span className="text-3xl font-bold text-primary">{testimonial.metric}</span>
                    <span className="text-sm text-muted-foreground ml-2">{testimonial.metricLabel}</span>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground leading-relaxed mb-6 text-[15px]">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-5 border-t border-border/50">
                    <div
                      className={`h-10 w-10 rounded-full ${testimonial.color} flex items-center justify-center text-white text-sm font-semibold
                        group-hover:scale-110 transition-transform duration-300`}
                    >
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
