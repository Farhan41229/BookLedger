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
  },
  {
    name: 'James Chen',
    role: 'Manager, Chapters & Verses',
    content:
      "The POS system is incredibly fast. Our checkout times dropped by 40%. The staff loves how intuitive everything is. Setup took less than an hour.",
    rating: 5,
    avatar: 'JC',
    color: 'bg-emerald-500',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Owner, Pageturner Books',
    content:
      "We switched from spreadsheets and it's been life-changing. The AI recommendations have helped us stock exactly what our customers want. Revenue is up 25%.",
    rating: 5,
    avatar: 'ER',
    color: 'bg-purple-500',
  },
];

const TestimonialsSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="testimonials" className="py-24 relative">
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
            <Star className="h-4 w-4" />
            Testimonials
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight">
            Loved by{' '}
            <span className="gradient-text">Bookstore Owners</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what bookstore owners around the world have to say about
            BookLedger.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="relative h-full bg-card rounded-2xl border p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-primary/15 mb-4" />

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
                <p className="text-muted-foreground leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <div className={`h-10 w-10 rounded-full ${testimonial.color} flex items-center justify-center text-white text-sm font-semibold`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
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
