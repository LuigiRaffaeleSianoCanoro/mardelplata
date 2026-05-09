"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { resolveAvatarDisplayUrl } from "@/lib/avatarPresets";
import { Button, GlassCard, PageHeader } from "@/components/ui";

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

interface NewsletterSubscriber {
  id: string;
  email: string;
  source: string | null;
  status: "pending" | "confirmed" | "unsubscribed";
  created_at: string;
}

interface AdminDashboardProps {
  events: Event[];
  profiles: Profile[];
  subscribers: NewsletterSubscriber[];
  currentUserId: string;
}

type Tab = "events" | "users" | "scanner" | "newsletter";

export default function AdminDashboard({ events, profiles, subscribers, currentUserId }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("events");
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen app-canvas">
      <header className="border-b border-ocean-300/10 backdrop-blur-md bg-ocean-900/40 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/mdpdev.png"
              alt="MdPDev logo"
              width={32}
              height={32}
              className="rounded-xl shadow-md shadow-ocean-700/40 group-hover:scale-105 transition-transform"
            />
            <span className="font-display font-semibold text-white text-[0.95rem] tracking-tight">
              mardelplata<span className="text-ocean-300">.dev</span>
              <span className="text-ocean-400/70 font-mono text-[0.7rem] ml-2">/ admin</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button href="/perfil" variant="ghost" size="sm">
              Mi perfil
            </Button>
            <Button onClick={handleLogout} variant="ghost" size="sm">
              Salir
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pt-10">
        <PageHeader
          eyebrow="/ Panel admin"
          title={<>Centro de <span className="gradient-text">control</span></>}
          description="Eventos, miembros, escáner QR y suscriptores del newsletter."
        />
      </div>

      <div className="border-b border-ocean-300/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto whitespace-nowrap" role="tablist">
            {[
              { id: "events" as Tab, label: "Eventos", icon: CalendarIcon },
              { id: "users" as Tab, label: "Usuarios", icon: UsersIcon },
              { id: "scanner" as Tab, label: "Escáner QR", icon: QrIcon },
              { id: "newsletter" as Tab, label: "Newsletter", icon: MailIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`flex flex-shrink-0 items-center gap-2 px-3 sm:px-5 py-3 text-sm font-medium transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "text-white border-ocean-300"
                    : "text-ocean-300/60 border-transparent hover:text-white hover:border-ocean-400/30"
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "events" && (
          <EventsTab 
            events={events} 
            onEdit={setEditingEvent}
            onNew={() => setShowEventModal(true)}
          />
        )}
        {activeTab === "users" && (
          <UsersTab 
            profiles={profiles} 
            currentUserId={currentUserId}
            onEdit={setEditingUser}
          />
        )}
        {activeTab === "scanner" && (
          <ScannerTab />
        )}
        {activeTab === "newsletter" && (
          <NewsletterTab subscribers={subscribers} />
        )}
      </main>

      {/* Event Modal */}
      {(showEventModal || editingEvent) && (
        <EventModal
          event={editingEvent}
          onClose={() => {
            setShowEventModal(false);
            setEditingEvent(null);
          }}
          onSave={() => {
            setShowEventModal(false);
            setEditingEvent(null);
            router.refresh();
          }}
        />
      )}

      {/* User Edit Modal */}
      {editingUser && (
        <UserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={() => {
            setEditingUser(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function EventsTab({ events, onEdit, onNew }: { events: Event[]; onEdit: (e: Event) => void; onNew: () => void }) {
  const supabase = createClient();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que querés eliminar este evento?")) return;
    await supabase.from("events").delete().eq("id", id);
    router.refresh();
  };

  const handleTogglePublish = async (event: Event) => {
    await supabase.from("events").update({ is_published: !event.is_published }).eq("id", event.id);
    router.refresh();
  };

  return (
    <div className="fade-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-ocean-300/70">/ 01 · Eventos</p>
          <h2 className="text-xl font-display font-bold text-white mt-1">Gestión de eventos</h2>
        </div>
        <Button onClick={onNew} variant="primary" size="sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Nuevo evento
        </Button>
      </div>

      <GlassCard className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-ocean-700/30">
              <th className="text-left px-4 sm:px-6 py-4 text-ocean-300 font-medium text-sm">Evento</th>
              <th className="text-left px-4 sm:px-6 py-4 text-ocean-300 font-medium text-sm">Fecha</th>
              <th className="text-left px-4 sm:px-6 py-4 text-ocean-300 font-medium text-sm">Estado</th>
              <th className="text-right px-4 sm:px-6 py-4 text-ocean-300 font-medium text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b border-ocean-700/20 last:border-0">
                <td className="px-4 sm:px-6 py-4">
                  <div>
                    <div className="font-medium text-white truncate max-w-[240px] sm:max-w-none">{event.title}</div>
                    {event.subtitle && (
                      <div className="text-ocean-400 text-sm truncate max-w-[240px] sm:max-w-none">
                        {event.subtitle}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {event.tags?.map((tag) => (
                        <span key={tag} className="text-xs bg-ocean-700/50 text-ocean-300 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 text-ocean-200 text-sm">
                  {new Date(event.date).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <button
                    onClick={() => handleTogglePublish(event)}
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      event.is_published
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {event.is_published ? "Publicado" : "Borrador"}
                  </button>
                </td>
                <td className="px-4 sm:px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(event)}
                      className="text-ocean-400 hover:text-white transition-colors p-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 sm:px-6 py-12 text-center text-ocean-400">
                  No hay eventos. Creá el primero.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}

function UsersTab({ profiles, currentUserId, onEdit }: { profiles: Profile[]; currentUserId: string; onEdit: (p: Profile) => void }) {
  const supabase = createClient();
  const router = useRouter();

  const handleToggleAdmin = async (profile: Profile) => {
    if (profile.id === currentUserId) {
      alert("No podés quitarte permisos de admin a vos mismo");
      return;
    }
    await supabase.from("profiles").update({ is_admin: !profile.is_admin }).eq("id", profile.id);
    router.refresh();
  };

  const handleDelete = async (profile: Profile) => {
    if (profile.id === currentUserId) {
      alert("No podés eliminarte a vos mismo");
      return;
    }
    if (!confirm(`¿Seguro que querés eliminar a ${profile.full_name || profile.email}? Esta acción no se puede deshacer.`)) return;
    await supabase.from("profiles").delete().eq("id", profile.id);
    router.refresh();
  };

  return (
    <div className="fade-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-ocean-300/70">/ 02 · Comunidad</p>
          <h2 className="text-xl font-display font-bold text-white mt-1">Gestión de usuarios</h2>
        </div>
        <div className="text-ocean-300/70 text-xs font-mono">{profiles.length} registrados</div>
      </div>

      <GlassCard className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-ocean-700/30">
              <th className="text-left px-4 sm:px-6 py-4 text-ocean-300 font-medium text-sm">Usuario</th>
              <th className="text-left px-4 sm:px-6 py-4 text-ocean-300 font-medium text-sm">QR Code</th>
              <th className="text-left px-4 sm:px-6 py-4 text-ocean-300 font-medium text-sm">Registrado</th>
              <th className="text-left px-4 sm:px-6 py-4 text-ocean-300 font-medium text-sm">Rol</th>
              <th className="text-right px-4 sm:px-6 py-4 text-ocean-300 font-medium text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id} className="border-b border-ocean-700/20 last:border-0">
                <td className="px-4 sm:px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-ocean-700/50">
                      <img
                        src={resolveAvatarDisplayUrl(profile.avatar_url, profile.full_name || profile.id)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-white truncate max-w-[160px] sm:max-w-none">
                        {profile.full_name || "Sin nombre"}
                      </div>
                      <div className="text-ocean-400 text-sm truncate max-w-[160px]">{profile.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 min-w-0">
                  <span className="block font-mono text-ocean-300 text-xs max-w-[140px] sm:max-w-[220px] truncate">
                    {profile.qr_code}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 text-ocean-200 text-sm">
                  {new Date(profile.created_at).toLocaleDateString("es-AR")}
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <button
                    onClick={() => handleToggleAdmin(profile)}
                    disabled={profile.id === currentUserId}
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      profile.is_admin
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-ocean-700/50 text-ocean-400"
                    } ${profile.id === currentUserId ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-80"}`}
                  >
                    {profile.is_admin ? "Admin" : "Miembro"}
                  </button>
                </td>
                <td className="px-4 sm:px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(profile)}
                      className="text-ocean-400 hover:text-white transition-colors p-2"
                      title="Editar usuario"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(profile)}
                      disabled={profile.id === currentUserId}
                      className="text-red-400 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-2"
                      title="Eliminar usuario"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}

function ScannerTab() {
  return (
    <GlassCard className="text-center py-14 fade-up">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-ocean-700/40 border border-ocean-300/15 flex items-center justify-center">
        <QrIcon size={40} />
      </div>
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-ocean-300/70">/ 03 · Presencia</p>
      <h2 className="text-xl font-display font-bold text-white mt-1 mb-2">Escáner QR</h2>
      <p className="text-ocean-300/80 text-sm mb-6 max-w-md mx-auto">
        Escaneá los QR de los miembros para registrar asistencia en eventos.
      </p>
      <Link
        href="/admin/scanner"
        className="btn-app-primary shimmer-x-target inline-flex"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
        Abrir escáner
      </Link>
    </GlassCard>
  );
}

function EventModal({ event, onClose, onSave }: { event: Event | null; onClose: () => void; onSave: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: event?.title || "",
    subtitle: event?.subtitle || "",
    description: event?.description || "",
    date: event?.date ? new Date(event.date).toISOString().slice(0, 16) : "",
    location: event?.location || "",
    tags: event?.tags?.join(", ") || "",
    registration_url: event?.registration_url || "",
    is_mystery: event?.is_mystery || false,
    codename: event?.codename || "",
    teaser: event?.teaser || "",
    is_published: event?.is_published ?? true,
  });
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      title: formData.title,
      subtitle: formData.subtitle || null,
      description: formData.description || null,
      date: new Date(formData.date).toISOString(),
      location: formData.location || null,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      registration_url: formData.registration_url || null,
      is_mystery: formData.is_mystery,
      codename: formData.codename || null,
      teaser: formData.teaser || null,
      is_published: formData.is_published,
      updated_at: new Date().toISOString(),
    };

    if (event) {
      await supabase.from("events").update(data).eq("id", event.id);
    } else {
      await supabase.from("events").insert(data);
    }

    setLoading(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-ocean-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-ocean-700/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-white">
            {event ? "Editar Evento" : "Nuevo Evento"}
          </h2>
          <button onClick={onClose} className="text-ocean-400 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-ocean-200 mb-1">Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-2 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ocean-400"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-ocean-200 mb-1">Subtítulo</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData((f) => ({ ...f, subtitle: e.target.value }))}
                className="w-full px-4 py-2 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ocean-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-200 mb-1">Fecha y hora *</label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData((f) => ({ ...f, date: e.target.value }))}
                className="w-full px-4 py-2 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ocean-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-200 mb-1">Ubicación</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData((f) => ({ ...f, location: e.target.value }))}
                className="w-full px-4 py-2 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ocean-400"
                placeholder="Ej: Costa Coffee, Mar del Plata"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-ocean-200 mb-1">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ocean-400 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-200 mb-1">Tags (separados por coma)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData((f) => ({ ...f, tags: e.target.value }))}
                className="w-full px-4 py-2 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ocean-400"
                placeholder="meetup, networking, talks"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-200 mb-1">URL de registro</label>
              <input
                type="url"
                value={formData.registration_url}
                onChange={(e) => setFormData((f) => ({ ...f, registration_url: e.target.value }))}
                className="w-full px-4 py-2 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ocean-400"
              />
            </div>
          </div>

          <div className="border-t border-ocean-700/30 pt-4 mt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_mystery}
                onChange={(e) => setFormData((f) => ({ ...f, is_mystery: e.target.checked }))}
                className="w-5 h-5 rounded border-ocean-600 bg-ocean-900 text-ocean-400 focus:ring-ocean-400"
              />
              <span className="text-ocean-200">Es un evento misterio</span>
            </label>
          </div>

          {formData.is_mystery && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-ocean-900/30 p-4 rounded-xl">
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-1">Nombre clave</label>
                <input
                  type="text"
                  value={formData.codename}
                  onChange={(e) => setFormData((f) => ({ ...f, codename: e.target.value }))}
                  className="w-full px-4 py-2 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ocean-400"
                  placeholder="Operación: ???"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-200 mb-1">Teaser</label>
                <input
                  type="text"
                  value={formData.teaser}
                  onChange={(e) => setFormData((f) => ({ ...f, teaser: e.target.value }))}
                  className="w-full px-4 py-2 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ocean-400"
                  placeholder="Algo épico se viene..."
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData((f) => ({ ...f, is_published: e.target.checked }))}
                className="w-5 h-5 rounded border-ocean-600 bg-ocean-900 text-ocean-400 focus:ring-ocean-400"
              />
              <span className="text-ocean-200">Publicar evento</span>
            </label>
            <div className="flex gap-3">
              <Button type="button" onClick={onClose} variant="ghost" size="sm">
                Cancelar
              </Button>
              <Button type="submit" loading={loading} variant="primary" size="sm">
                Guardar
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function UserModal({ user, onClose, onSave }: { user: Profile; onClose: () => void; onSave: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user.full_name || "",
    bio: user.bio || "",
    is_admin: user.is_admin,
  });
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await supabase.from("profiles").update({
      full_name: formData.full_name,
      bio: formData.bio,
      is_admin: formData.is_admin,
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);

    setLoading(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-ocean-800 rounded-2xl p-6 w-full max-w-md border border-ocean-700/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-white">Editar Usuario</h2>
          <button onClick={onClose} className="text-ocean-400 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ocean-200 mb-1">Nombre</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData((f) => ({ ...f, full_name: e.target.value }))}
              className="w-full px-4 py-2 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ocean-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ocean-200 mb-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData((f) => ({ ...f, bio: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ocean-400 resize-none"
            />
          </div>
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_admin}
                onChange={(e) => setFormData((f) => ({ ...f, is_admin: e.target.checked }))}
                className="w-5 h-5 rounded border-ocean-600 bg-ocean-900 text-ocean-400 focus:ring-ocean-400"
              />
              <span className="text-ocean-200">Es administrador</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" onClick={onClose} variant="ghost" size="sm">
              Cancelar
            </Button>
            <Button type="submit" loading={loading} variant="primary" size="sm">
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Icons
function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function QrIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}

function MailIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function NewsletterTab({ subscribers }: { subscribers: NewsletterSubscriber[] }) {
  const [list, setList] = useState<NewsletterSubscriber[]>(subscribers);
  const [filter, setFilter] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = list.filter((s) =>
    !filter ||
    s.email.toLowerCase().includes(filter.toLowerCase()) ||
    (s.source ?? "").toLowerCase().includes(filter.toLowerCase()),
  );

  const handleExport = () => {
    const header = ["email", "source", "status", "created_at"].join(",");
    const escape = (v: string) => {
      if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
      return v;
    };
    const rows = list.map((s) =>
      [escape(s.email), escape(s.source ?? ""), s.status, s.created_at].join(","),
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const ts = new Date().toISOString().slice(0, 10);
    a.download = `newsletter-subscribers-${ts}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este suscriptor? No se puede deshacer.")) return;
    setBusyId(id);
    const supabase = createClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("id", id);
    setBusyId(null);
    if (error) {
      alert("No se pudo eliminar: " + error.message);
      return;
    }
    setList((l) => l.filter((s) => s.id !== id));
  };

  return (
    <GlassCard tone="default" className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold text-white">Suscriptores</h2>
          <p className="text-ocean-300/60 text-sm font-light">
            {list.length} {list.length === 1 ? "persona" : "personas"} en la lista.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filtrar por email o fuente"
            className="bg-ocean-950/40 border border-ocean-300/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-ocean-300/35 focus:outline-none focus:border-ocean-400/40"
          />
          <Button onClick={handleExport} variant="ghost" size="sm" disabled={list.length === 0}>
            Exportar CSV
          </Button>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="text-ocean-300/60 text-sm font-light py-8 text-center">
          Todavía no hay suscriptores. Cuando alguien complete el formulario del footer aparece acá.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-ocean-300/55 text-xs uppercase tracking-wider border-b border-ocean-300/10">
              <tr>
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Fuente</th>
                <th className="py-2 pr-4 font-medium">Estado</th>
                <th className="py-2 pr-4 font-medium">Creado</th>
                <th className="py-2 pr-4 font-medium text-right">·</th>
              </tr>
            </thead>
            <tbody className="text-white/85">
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-ocean-300/5 hover:bg-ocean-900/30">
                  <td className="py-2 pr-4 font-mono text-[0.78rem]">{s.email}</td>
                  <td className="py-2 pr-4 text-ocean-300/70">{s.source ?? "—"}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={
                        s.status === "confirmed"
                          ? "text-emerald-300"
                          : s.status === "unsubscribed"
                            ? "text-rose-300/80"
                            : "text-amber-300/85"
                      }
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-ocean-300/70 text-[0.78rem]">
                    {new Date(s.created_at).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-2 pr-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      disabled={busyId === s.id}
                      className="text-rose-300/65 hover:text-rose-200 text-xs font-medium disabled:opacity-50"
                    >
                      {busyId === s.id ? "Borrando…" : "Borrar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-ocean-300/55 text-sm font-light py-6 text-center">
              No hay coincidencias para “{filter}”.
            </p>
          )}
        </div>
      )}
    </GlassCard>
  );
}
