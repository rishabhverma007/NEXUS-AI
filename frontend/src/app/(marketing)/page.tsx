import { HeroSection } from "@/features/landing/hero";
import { FeaturesSection } from "@/features/landing/features";
import { EnterpriseSection } from "@/features/landing/enterprise";
import { WorkflowDemoSection } from "@/features/landing/workflow-demo";
import { TestimonialsSection } from "@/features/landing/testimonials";
import { PricingSection } from "@/features/landing/pricing";
import { FAQSection } from "@/features/landing/faq";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <div id="features">
        <FeaturesSection />
      </div>
      <WorkflowDemoSection />
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
    </>
  );
}
