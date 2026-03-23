"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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

interface AdminDashboardProps {
  events: Event[];
  profiles: Profile[];
  currentUserId: string;
}

type Tab = "events" | "users" | "scanner";

export default function AdminDashboard({ events, profiles, currentUserId }: AdminDashboardProps) {
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
    <div className="min-h-screen bg-ocean-900">
      {/* Header */}
      <header className="bg-ocean-800 border-b border-ocean-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image src="/mdpdev.png" alt="MdPDev logo" width={40} height={40} className="rounded-xl" />
            </Link>
            <div>
              <h1 className="font-display font-bold text-white text-lg">Admin Panel</h1>
              <p className="text-ocean-400 text-xs">MdPDev Content Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/perfil" className="text-ocean-300 hover:text-white transition-colors text-sm">
              Mi Perfil
            </Link>
            <button onClick={handleLogout} className="text-ocean-400 hover:text-white transition-colors text-sm">
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-ocean-800/50 border-b border-ocean-700/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: "events" as Tab, label: "Eventos", icon: CalendarIcon },
              { id: "users" as Tab, label: "Usuarios", icon: UsersIcon },
              { id: "scanner" as Tab, label: "Escaner QR", icon: QrIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "text-white border-ocean-400 bg-ocean-700/30"
                    : "text-ocean-400 border-transparent hover:text-white hover:bg-ocean-700/20"
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-white">Gestión de Eventos</h2>
        <button
          onClick={onNew}
          className="flex items-center gap-2 bg-ocean-400 hover:bg-ocean-300 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Nuevo Evento
        </button>
      </div>

      <div className="bg-ocean-800/50 rounded-2xl border border-ocean-700/30 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ocean-700/30">
              <th className="text-left px-6 py-4 text-ocean-300 font-medium text-sm">Evento</th>
              <th className="text-left px-6 py-4 text-ocean-300 font-medium text-sm">Fecha</th>
              <th className="text-left px-6 py-4 text-ocean-300 font-medium text-sm">Estado</th>
              <th className="text-right px-6 py-4 text-ocean-300 font-medium text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b border-ocean-700/20 last:border-0">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-white">{event.title}</div>
                    {event.subtitle && <div className="text-ocean-400 text-sm">{event.subtitle}</div>}
                    <div className="flex gap-1 mt-1">
                      {event.tags?.map((tag) => (
                        <span key={tag} className="text-xs bg-ocean-700/50 text-ocean-300 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-ocean-200 text-sm">
                  {new Date(event.date).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-6 py-4">
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
                <td className="px-6 py-4 text-right">
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
                <td colSpan={4} className="px-6 py-12 text-center text-ocean-400">
                  No hay eventos. Crea el primero!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-white">Gestión de Usuarios</h2>
        <div className="text-ocean-400 text-sm">{profiles.length} usuarios registrados</div>
      </div>

      <div className="bg-ocean-800/50 rounded-2xl border border-ocean-700/30 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ocean-700/30">
              <th className="text-left px-6 py-4 text-ocean-300 font-medium text-sm">Usuario</th>
              <th className="text-left px-6 py-4 text-ocean-300 font-medium text-sm">QR Code</th>
              <th className="text-left px-6 py-4 text-ocean-300 font-medium text-sm">Registrado</th>
              <th className="text-left px-6 py-4 text-ocean-300 font-medium text-sm">Rol</th>
              <th className="text-right px-6 py-4 text-ocean-300 font-medium text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id} className="border-b border-ocean-700/20 last:border-0">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-ocean-700/50">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-ocean-400">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="8" r="4"/>
                            <path d="M20 21a8 8 0 1 0-16 0"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">{profile.full_name || "Sin nombre"}</div>
                      <div className="text-ocean-400 text-sm">{profile.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-ocean-300 text-sm">{profile.qr_code}</span>
                </td>
                <td className="px-6 py-4 text-ocean-200 text-sm">
                  {new Date(profile.created_at).toLocaleDateString("es-AR")}
                </td>
                <td className="px-6 py-4">
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
                <td className="px-6 py-4 text-right">
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
      </div>
    </div>
  );
}

function ScannerTab() {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-ocean-700/50 flex items-center justify-center">
        <QrIcon size={40} />
      </div>
      <h2 className="text-xl font-display font-bold text-white mb-2">Escaner QR</h2>
      <p className="text-ocean-400 mb-6">Escanea los QR de los miembros en eventos</p>
      <Link
        href="/admin/scanner"
        className="inline-flex items-center gap-2 bg-ocean-400 hover:bg-ocean-300 text-white px-6 py-3 rounded-xl font-medium transition-all"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
        Abrir Escaner
      </Link>
    </div>
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
              <button type="button" onClick={onClose} className="px-4 py-2 text-ocean-300 hover:text-white transition-colors">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-ocean-400 hover:bg-ocean-300 disabled:bg-ocean-600 text-white font-medium py-2 px-6 rounded-xl transition-all"
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
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
            <button type="button" onClick={onClose} className="px-4 py-2 text-ocean-300 hover:text-white transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-ocean-400 hover:bg-ocean-300 disabled:bg-ocean-600 text-white font-medium py-2 px-6 rounded-xl transition-all"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
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
