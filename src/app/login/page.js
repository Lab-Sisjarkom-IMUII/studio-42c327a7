import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login - studio.imuii.id",
  description: "Masuk ke akun studio.imuii.id",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}

