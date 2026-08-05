import { OnboardingWizard } from "@/features/onboarding/onboarding-wizard";
import { AuthBackground } from "@/features/auth/auth-background";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      <AuthBackground />
      <OnboardingWizard />
    </div>
  );
}
