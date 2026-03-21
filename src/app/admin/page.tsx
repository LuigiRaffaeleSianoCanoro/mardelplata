import { createClient } from "@/lib/supabase/server";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: false });

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <AdminDashboard 
      events={events || []} 
      profiles={profiles || []} 
      currentUserId={user?.id || ""}
    />
  );
}
