import Link from "next/link";
import {
  initialsFromName,
  LOOKING_FOR_LABELS,
  STARTUP_STAGE_LABELS,
} from "@/lib/marketplace";
import type { MarketplaceStartupPublic } from "@/lib/types/marketplace";

export default function StartupCard({ startup }: { startup: MarketplaceStartupPublic }) {
  return (
    <Link href={`/marketplace/startups/${startup.slug}`} className="shell-card marketplace-card">
      <div className="marketplace-card-head">
        <div className="marketplace-avatar" aria-hidden>
          {startup.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={startup.logo_url} alt="" />
          ) : (
            <span>{initialsFromName(startup.name)}</span>
          )}
        </div>
        <div>
          <h3 className="shell-card__title">{startup.name}</h3>
          <p className="shell-card__meta">
            {STARTUP_STAGE_LABELS[startup.stage]} · {startup.city}
          </p>
        </div>
      </div>
      <p className="shell-card__desc">{startup.one_liner}</p>
      <div className="marketplace-chip-row">
        {startup.looking_for.slice(0, 3).map((item) => (
          <span key={item} className="marketplace-chip">
            {LOOKING_FOR_LABELS[item]}
          </span>
        ))}
        {startup.has_deck && <span className="marketplace-chip marketplace-chip--deck">Deck a pedido</span>}
      </div>
    </Link>
  );
}
