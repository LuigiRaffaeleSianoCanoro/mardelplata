"use client";

import Link from "next/link";
import { LogOut, SunMoon, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { ICON_STROKE } from "./parts";

export function UserMenu({
  name,
  avatarUrl,
  theme,
  onToggleTheme,
}: {
  name: string;
  avatarUrl?: string;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}) {
  const signOut = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    await createClient().auth.signOut();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="v3-press flex size-11 items-center justify-center rounded-full lg:size-9" aria-label="Mi cuenta">
          <Avatar className="size-8 border">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
            <AvatarFallback className="bg-muted font-mono text-[11px]">{(name.charAt(0) || "·").toUpperCase()}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate font-normal text-muted-foreground">{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/perfil">
            <UserIcon strokeWidth={ICON_STROKE} /> Mi perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/red">Red</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/asistencias">Mis asistencias</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onToggleTheme}>
          <SunMoon strokeWidth={ICON_STROKE} /> Tema {theme === "dark" ? "claro" : "oscuro"}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={signOut}>
          <LogOut strokeWidth={ICON_STROKE} /> Salir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
