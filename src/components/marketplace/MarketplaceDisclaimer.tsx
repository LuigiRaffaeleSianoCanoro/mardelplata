import { MARKETPLACE_DISCLAIMER } from "@/lib/marketplace";

export default function MarketplaceDisclaimer() {
  return (
    <p className="marketplace-disclaimer" role="note">
      {MARKETPLACE_DISCLAIMER}
    </p>
  );
}
