import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { IS_MOCK } from "@/lib/devMock";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (IS_MOCK) {
    return <AdminLayoutClient>{children}</AdminLayoutClient>;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");

  if (adminError || !isAdmin) {
    redirect("/perfil");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
