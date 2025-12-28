import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Register - studio.imuii.id",
  description: "Daftar akun baru di studio.imuii.id",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}

