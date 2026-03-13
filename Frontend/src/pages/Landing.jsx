import HeroSection from '@/components/landing/HeroSection';
import FeaturedBooksSection from '@/components/landing/FeaturedBooksSection';
import BrandShowcase from '@/components/landing/BrandShowcase';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import StatsSection from '@/components/landing/StatsSection';
import PricingSection from '@/components/landing/PricingSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';

const Landing = () => {
  return (
    <>
      <HeroSection />
      <FeaturedBooksSection />
      <BrandShowcase />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
};

export default Landing;
