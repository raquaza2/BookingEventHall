import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { getCurrentAdmin } from "@/lib/auth";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="shell grid min-h-[calc(100vh-180px)] place-items-center py-12">
      <AdminLoginForm />
    </main>
  );
}

