import { HeroSection } from "@/features/landing/hero";
import { FeaturesSection } from "@/features/landing/features";
import { WorkflowDemoSection } from "@/features/landing/workflow-demo";
import { ShowcaseSection } from "@/features/landing/showcase";
import { EnterpriseSection } from "@/features/landing/enterprise";
import { TestimonialsSection } from "@/features/landing/testimonials";
import { PricingSection } from "@/features/landing/pricing";
import { FAQSection } from "@/features/landing/faq";
import { CTABanner } from "@/features/landing/cta-banner";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <div id="features">
        <FeaturesSection />
      </div>
      <WorkflowDemoSection />
      <ShowcaseSection />
      <div id="enterprise">
        <EnterpriseSection />
      </div>
      <TestimonialsSection />
      <div id="pricing">
        <PricingSection />
      </div>
      <div id="faq">
        <FAQSection />
      </div>
      <CTABanner />
    </>
  );
}
