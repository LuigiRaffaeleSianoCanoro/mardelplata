"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { BrowserMultiFormatReader } from "@zxing/library";

interface ScannedMember {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  qr_code: string;
  scanned_at: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
}

export default function ScannerPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState<ScannedMember | null>(null);
  const [scannedMembers, setScannedMembers] = useState<ScannedMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      loadAttendance();
    }
  }, [selectedEvent]);

  const loadEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select("id, title, date")
      .order("date", { ascending: false });
    setEvents(data || []);
    if (data && data.length > 0) {
      setSelectedEvent(data[0].id);
    }
  };

  const loadAttendance = async () => {
    const { data } = await supabase
      .from("event_attendance")
      .select(`
        id,
        scanned_at,
        profiles!event_attendance_user_id_fkey (
          id,
          full_name,
          email,
          avatar_url,
          qr_code
        )
      `)
      .eq("event_id", selectedEvent)
      .order("scanned_at", { ascending: false });

    if (data) {
      const members = data.map((a) => ({
        id: (a.profiles as unknown as ScannedMember).id,
        full_name: (a.profiles as unknown as ScannedMember).full_name,
        email: (a.profiles as unknown as ScannedMember).email,
        avatar_url: (a.profiles as unknown as ScannedMember).avatar_url,
        qr_code: (a.profiles as unknown as ScannedMember).qr_code,
        scanned_at: a.scanned_at,
      }));
      setScannedMembers(members);
    }
  };

  const startScanning = async () => {
    if (!selectedEvent) {
      setError("Selecciona un evento primero");
      return;
    }

    try {
      setScanning(true);
      setError(null);
      
      codeReaderRef.current = new BrowserMultiFormatReader();
      
      if (videoRef.current) {
        await codeReaderRef.current.decodeFromVideoDevice(
          null,
          videoRef.current,
          async (result) => {
            if (result) {
              const code = result.getText();
              await handleScan(code);
            }
          }
        );
      }
    } catch (err) {
      setError("No se pudo acceder a la cámara");
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
    setScanning(false);
  };

  const handleScan = async (qrValue: string) => {
    // Extract QR code from URL or use directly
    let qrCode = qrValue;
    if (qrValue.includes("/miembro?code=")) {
      qrCode = qrValue.split("/miembro?code=").pop() || qrValue;
    } else if (qrValue.includes("/miembro/")) {
      qrCode = qrValue.split("/miembro/").pop() || qrValue;
    }

    // Check if already scanned
    if (scannedMembers.some((m) => m.qr_code === qrCode)) {
      setError("Este miembro ya fue registrado en este evento");
      return;
    }

    // Find profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("qr_code", qrCode)
      .single();

    if (!profile) {
      setError("QR no válido o usuario no encontrado");
      return;
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Register attendance
    const { error: insertError } = await supabase
      .from("event_attendance")
      .insert({
        event_id: selectedEvent,
        user_id: profile.id,
        scanned_by: user?.id,
      });

    if (insertError) {
      if (insertError.code === "23505") {
        setError("Este miembro ya fue registrado en este evento");
      } else {
        setError("Error al registrar asistencia");
      }
      return;
    }

    const scanned: ScannedMember = {
      id: profile.id,
      full_name: profile.full_name,
      email: profile.email,
      avatar_url: profile.avatar_url,
      qr_code: profile.qr_code,
      scanned_at: new Date().toISOString(),
    };

    setLastScanned(scanned);
    setScannedMembers((prev) => [scanned, ...prev]);
    setError(null);
    setManualCode("");

    // Play success sound feedback
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(200);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleScan(manualCode.trim());
    }
  };

  return (
    <div className="min-h-screen bg-ocean-900">
      {/* Header */}
      <header className="bg-ocean-800 border-b border-ocean-700/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 text-ocean-400 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Volver al Admin
          </Link>
          <h1 className="font-display font-bold text-white">Escaner QR</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Event Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-ocean-200 mb-2">Evento activo</label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full px-4 py-3 bg-ocean-800 border border-ocean-600/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ocean-400"
          >
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title} - {new Date(event.date).toLocaleDateString("es-AR")}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner */}
          <div className="bg-ocean-800/50 rounded-2xl p-6 border border-ocean-700/30">
            <h2 className="text-lg font-display font-bold text-white mb-4">Cámara</h2>
            
            <div className="relative aspect-square bg-ocean-900 rounded-xl overflow-hidden mb-4">
              {scanning ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ocean-500">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
              )}
              {scanning && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-ocean-400 rounded-xl animate-pulse" />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {scanning ? (
                <button
                  onClick={stopScanning}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="6" y="6" width="12" height="12" rx="2"/>
                  </svg>
                  Detener
                </button>
              ) : (
                <button
                  onClick={startScanning}
                  className="flex-1 bg-ocean-400 hover:bg-ocean-300 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  Iniciar Cámara
                </button>
              )}
            </div>

            {/* Manual input */}
            <div className="mt-4 pt-4 border-t border-ocean-700/30">
              <form onSubmit={handleManualSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Código manual (MDP-XXXX)"
                  className="flex-1 px-4 py-2 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white text-sm placeholder:text-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-400"
                />
                <button
                  type="submit"
                  className="bg-ocean-600 hover:bg-ocean-500 text-white px-4 py-2 rounded-xl transition-colors"
                >
                  Buscar
                </button>
              </form>
            </div>

            {/* Error/Success messages */}
            {error && (
              <div className="mt-4 bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            {lastScanned && !error && (
              <div className="mt-4 bg-green-500/20 border border-green-500/40 text-green-300 px-4 py-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <div>
                    <div className="font-medium">{lastScanned.full_name || "Miembro"}</div>
                    <div className="text-green-400 text-sm">Registrado exitosamente</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Attendance List */}
          <div className="bg-ocean-800/50 rounded-2xl p-6 border border-ocean-700/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-bold text-white">Asistencia</h2>
              <span className="text-ocean-400 text-sm">{scannedMembers.length} registrados</span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {scannedMembers.map((member) => (
                <div
                  key={member.id + member.scanned_at}
                  className="flex items-center gap-3 bg-ocean-900/50 rounded-xl p-3"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-ocean-700/50 flex-shrink-0">
                    {member.avatar_url ? (
                      <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ocean-400">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="8" r="4"/>
                          <path d="M20 21a8 8 0 1 0-16 0"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">
                      {member.full_name || "Sin nombre"}
                    </div>
                    <div className="text-ocean-400 text-xs">
                      {new Date(member.scanned_at).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <div className="text-ocean-500 text-xs font-mono">
                    {member.qr_code}
                  </div>
                </div>
              ))}
              {scannedMembers.length === 0 && (
                <div className="text-center py-8 text-ocean-500">
                  No hay asistentes registrados
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
