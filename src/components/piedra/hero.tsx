"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { COMMUNITY_SIZE_LABEL } from "@/lib/v3/brand";
import { Button } from "./button";
import { Label } from "./label";
import { Kbd } from "@/components/shadcn/kbd";
import { ICON_STROKE } from "./event-card";

const COORDS = "38°00′S 57°33′W";
const HERO_WORDS = ["El", "Club", "Tech", "de", "Mar", "del", "Plata"] as const;

export function HomeHero({
  brand,
  nextUrl,
  onExplore,
  modKey,
  venueName,
  venueAddress,
  city,
}: {
  brand: string;
  nextUrl?: string | null;
  onExplore: () => void;
  modKey: string;
  venueName?: string | null;
  venueAddress?: string | null;
  city?: string | null;
}) {
  return (
    <section className="relative isolate min-w-0 shrink-0 overflow-hidden px-4 pt-5 pb-4 shorter:pt-3 shorter:pb-2.5 lg:flex lg:min-w-0 lg:flex-col lg:justify-between lg:gap-6 lg:border-r lg:px-[min(56px,4vw)] lg:pt-[min(48px,5dvh)] lg:pb-[min(40px,4.4dvh)]">
      <div className="v3-hero-photo" aria-hidden>
        <Image src="/v3/photos/mdp-hero-costa.jpg" alt="" fill priority sizes="(min-width: 1024px) 64vw, 100vw" />
      </div>
      <span className="v3-cross hidden lg:block" style={{ left: -6, top: -6 }} aria-hidden />
      <span className="v3-cross hidden lg:block" style={{ right: -6, top: -6 }} aria-hidden />
      <div className="relative min-w-0">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 lg:justify-start lg:gap-6">
          <Label className="min-w-0 truncate">[MDQ] {COORDS}</Label>
          <Label className="shrink-0 lg:hidden">{COMMUNITY_SIZE_LABEL} personas</Label>
          <Label className="hidden lg:inline">Comunidad dev</Label>
          <Label className="hidden xl:inline">Costa atlántica</Label>
        </div>
        <h1 className="v3-display mt-3 max-w-full text-[clamp(2rem,1.1rem+5.6vw,3rem)] short:text-[clamp(1.85rem,1rem+5vw,2.5rem)] shorter:text-[clamp(1.75rem,0.9rem+4.6vw,2.125rem)] lg:mt-[min(32px,3.5dvh)] lg:text-[min(112px,12.4dvh,7.8vw)]">
          {HERO_WORDS.map((w, i) => (
            <span key={w + i}>
              <span className="v3-word" style={{ ["--i" as string]: i }}>
                <span>{w}</span>
              </span>
              {i < HERO_WORDS.length - 1 ? " " : null}
              {w === "de" ? <br className="lg:hidden" /> : null}
            </span>
          ))}
        </h1>
        <p className="mt-3 max-w-full text-[14.5px] leading-[1.45] text-pretty text-muted-foreground short:hidden lg:hidden">
          La comunidad dev de Mar del Plata: meetups, hackathons, empleos y lo que sale en los medios.
        </p>
        <p className="mt-[min(28px,3dvh)] hidden max-w-[560px] text-[18px] leading-[1.5] text-muted-foreground lg:block">
          {brand} junta a la gente que hace software en Mar del Plata: meetups, hackathons, empleos y lo que sale en los medios.
        </p>
        <div className="mt-8 hidden items-center gap-3 lg:flex dshort:mt-6">
          {nextUrl ? (
            <Button href={nextUrl} target="_blank" size="xl">
              Anotarme al próximo
              <ArrowUpRight className="size-4" strokeWidth={ICON_STROKE} aria-hidden />
            </Button>
          ) : null}
          <Button variant="outline" size="xl" className="gap-3 px-4" onClick={onExplore}>
            Explorar <Kbd>{modKey}K</Kbd>
          </Button>
        </div>
      </div>
      <div
        className={
          venueName
            ? "mt-auto hidden min-w-0 overflow-hidden rounded-xl border bg-background/80 lg:grid lg:grid-cols-3"
            : "mt-auto hidden min-w-0 overflow-hidden rounded-xl border bg-background/80 lg:grid lg:grid-cols-2"
        }
      >
      <div className="p-5">
        <Label>Comunidad</Label>
        <div className="mt-2 text-[28px] font-semibold tracking-[-0.04em]">{COMMUNITY_SIZE_LABEL}</div>
        <div className="text-[13px] text-muted-foreground">personas</div>
      </div>
      <div className="border-l p-5">
        <Label>Ciudad</Label>
        <div className="mt-2 text-[28px] font-semibold tracking-[-0.04em]">Mar del Plata</div>
        <div className="text-[13px] text-muted-foreground">Costa atlántica</div>
      </div>
      {venueName ? (
        <div className="min-w-0 border-l p-5">
          <Label>Próxima sede</Label>
          <div className="mt-2 truncate text-[28px] font-semibold tracking-[-0.04em]">{venueName}</div>
          <div className="truncate text-[13px] text-muted-foreground">{venueAddress ?? city}</div>
        </div>
      ) : null}
      </div>
    </section>
  );
}
