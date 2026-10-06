"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronRight, FolderGit2, Users } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Badge } from "@/components/shadcn/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/shadcn/carousel";
import { COMMUNITY_SIZE_LABEL } from "@/lib/v3/brand";
import { ICON_STROKE, Label, TextLink } from "./parts";
import type { MemberVM, ProjectVM } from "@/lib/v3/types";

const panelCls = "flex h-full min-h-0 flex-col gap-3 lg:gap-4";

/* ── Comunidad ───────────────────────────────────────────────────────── */

export function CommunityPanel({
  projects,
  members,
  onMembers,
  onJoin,
}: {
  projects: ProjectVM[];
  members: MemberVM[];
  onMembers: () => void;
  onJoin: () => void;
}) {
  return (
    <div className={panelCls}>
      <section className="v3-glass flex shrink-0 flex-col gap-2 rounded-xl border p-4 lg:p-5">
        <div className="flex items-center justify-between gap-2">
          <Label>Comunidad</Label>
          <Label className="truncate">Mar del Plata</Label>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-[40px] leading-none font-semibold tracking-[-0.05em] lg:text-[44px]">{COMMUNITY_SIZE_LABEL}</div>
            <div className="mt-1 text-[13px] text-muted-foreground">personas</div>
          </div>
          {members.length > 0 ? (
            <Button variant="outline" className="h-11 lg:h-9" onClick={onMembers}>
              <Users className="size-4" strokeWidth={ICON_STROKE} aria-hidden />
              Ver miembros
            </Button>
          ) : null}
        </div>
        <p className="text-[13.5px] leading-[1.45] text-muted-foreground short:hidden">
          La gente que hace software en Mar del Plata.
        </p>
      </section>

      <section className="v3-glass flex min-h-0 shrink-0 flex-col rounded-xl border p-4 lg:p-5" data-fit="2">
        {projects.length > 0 ? (
          <Carousel opts={{ align: "start" }} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>Proyectos · {projects.length}</Label>
              <div className="flex gap-1">
                <CarouselPrevious variant="ghost" className="static size-11 translate-y-0 rounded-lg lg:size-8" />
                <CarouselNext variant="ghost" className="static size-11 translate-y-0 rounded-lg lg:size-8" />
              </div>
            </div>
            <CarouselContent>
              {projects.map((p) => (
                <CarouselItem key={p.id}>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <FolderGit2 className="size-4 shrink-0 text-muted-foreground" strokeWidth={ICON_STROKE} aria-hidden />
                      <span className="truncate text-[16px] font-medium tracking-[-0.01em]">{p.name}</span>
                      {p.status ? <Badge variant="outline">{p.status === "active" ? "Activo" : p.status === "paused" ? "En pausa" : p.status}</Badge> : null}
                    </div>
                    {p.description ? (
                      <p className="line-clamp-2 text-[13.5px] leading-[1.4] text-muted-foreground">{p.description}</p>
                    ) : null}
                    <div className="flex gap-3">
                      {p.repoUrl ? (
                        <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="v3-label inline-flex min-h-11 items-center gap-1 hover-device:hover:text-foreground lg:min-h-8">
                          Repo <ArrowUpRight className="size-3" strokeWidth={ICON_STROKE} aria-hidden />
                        </a>
                      ) : null}
                      {p.demoUrl ? (
                        <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="v3-label inline-flex min-h-11 items-center gap-1 hover-device:hover:text-foreground lg:min-h-8">
                          Demo <ArrowUpRight className="size-3" strokeWidth={ICON_STROKE} aria-hidden />
                        </a>
                      ) : null}
                      <Link href="/proyectos" className="v3-label inline-flex min-h-11 items-center gap-1 hover-device:hover:text-foreground lg:min-h-8">
                        Ver más <ChevronRight className="size-3" strokeWidth={ICON_STROKE} aria-hidden />
                      </Link>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="flex flex-col gap-1.5">
            <Label>Proyectos</Label>
            <p className="text-[14px] leading-[1.45]">Todavía no hay proyectos públicos cargados. ¿Estás construyendo algo?</p>
            <TextLink href="/proyectos" className="self-start">Ver directorio</TextLink>
          </div>
        )}
      </section>

      <div className="mt-auto flex shrink-0 gap-2 pb-3 lg:pb-0">
        <Button className="h-11 flex-1 lg:h-10" onClick={onJoin}>
          Sumá tu proyecto
        </Button>
      </div>
    </div>
  );
}

