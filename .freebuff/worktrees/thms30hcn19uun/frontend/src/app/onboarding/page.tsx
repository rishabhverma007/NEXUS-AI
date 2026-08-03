import { OnboardingWizard } from "@/features/onboarding/onboarding-wizard";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <OnboardingWizard />
    </div>
  );
}
