import { RegisterForm } from "@/features/auth/register-form";
import { AuthBackground } from "@/features/auth/auth-background";

export default function SignupPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      <AuthBackground />
      <RegisterForm />
    </div>
  );
}
