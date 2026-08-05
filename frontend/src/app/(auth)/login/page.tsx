import { LoginForm } from "@/features/auth/login-form";
import { AuthBackground } from "@/features/auth/auth-background";

export default function LoginPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      <AuthBackground />
      <LoginForm />
    </div>
  );
}
