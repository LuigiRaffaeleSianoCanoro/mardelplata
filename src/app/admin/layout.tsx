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

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/perfil");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
