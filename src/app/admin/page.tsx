"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AdminDashboard from "./AdminDashboard";

interface Event {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  date: string;
  end_date: string | null;
  location: string | null;
  tags: string[];
  image_url: string | null;
  registration_url: string | null;
  is_mystery: boolean;
  codename: string | null;
  teaser: string | null;
  is_published: boolean;
  created_at: string;
}

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  qr_code: string | null;
  bio: string | null;
  is_admin: boolean;
  created_at: string;
}

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || "");

      const [eventsRes, profilesRes] = await Promise.all([
        supabase.from("events").select("*").order("date", { ascending: false }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      ]);

      setEvents(eventsRes.data || []);
      setProfiles(profilesRes.data || []);
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-ocean-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <AdminDashboard
      events={events}
      profiles={profiles}
      currentUserId={currentUserId}
    />
  );
}
