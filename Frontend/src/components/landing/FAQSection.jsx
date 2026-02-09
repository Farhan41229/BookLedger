import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle, Shield, CreditCard, Zap, Users, BookOpen, Cloud, Lock } from "lucide-react";
import { useInView } from "react-intersection-observer";

const faqs = [
  {
    icon: Zap,
    question: "How fast can I get started with BookLedger?",
    answer: "You can be up and running in less than 5 minutes. Import your existing inventory via CSV, set up your store details, and you're ready to sell. Our onboarding wizard guides you through every step."
  },
  {
    icon: Cloud,
    question: "Is my data secure and backed up?",
    answer: "Absolutely. We use enterprise-grade encryption for all data and perform automatic daily backups. Your business information is stored on secure cloud servers with 99.9% uptime guarantee."
  },
  {
    icon: CreditCard,
    question: "Do I need a credit card to start the trial?",
    answer: "No, our 14-day free trial requires no credit card. You get full access to all features on the Professional plan so you can experience the full power of BookLedger risk-free."
  },
  {
    icon: Users,
    question: "Can I add multiple staff accounts?",
    answer: "Yes, depending on your plan. The Starter plan includes 2 seats, Professional includes 5, and Enterprise offers unlimited seats. You can set granular permissions for each staff member."
  },
  {
    icon: BookOpen,
    question: "Does it work for used book bookstores?",
    answer: "BookLedger is perfect for used bookstores! We have specific features for trade-in credits, condition grading, and unique SKU generation for rare items."
  },
  {
    icon: Shield,
    question: "What happens if I need support?",
    answer: "Our support team is available 24/7 via chat and email. Professional and Enterprise plans also get priority phone support and a dedicated account manager."
  },
  {
    icon: Lock,
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, there are no long-term contracts. You can upgrade, downgrade, or cancel your subscription at any time from your dashboard with just a few clicks."
  },
  {
    icon: HelpCircle,
    question: "Do you integrate with online marketplaces?",
    answer: "Yes! We seamlessly sync inventory with Shopify, WooCommerce, Amazon, and eBay, so you can sell across multiple channels without overselling."
  }
];

const FAQSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <HelpCircle className="h-4 w-4" />
            Common Questions
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about BookLedger. Can't find the answer you're looking for? Chat with our friendly team.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => {
              const Icon = faq.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="glass-card mb-4 data-[state=open]:ring-2 data-[state=open]:ring-primary/30 px-6"
                  >
                    <AccordionTrigger className="hover:no-underline py-6 [&[data-state=open]>div>div>svg]:text-primary">
                      <div className="flex items-center gap-4 text-left">
                        <div className="h-10 w-10 shrink-0 rounded-lg bg-muted flex items-center justify-center transition-colors duration-300">
                          <Icon className="h-5 w-5 text-muted-foreground transition-colors duration-300" />
                        </div>
                        <span className="text-lg font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-[3.5rem] pr-4 pb-6 text-muted-foreground leading-relaxed text-base">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              );
            })}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
