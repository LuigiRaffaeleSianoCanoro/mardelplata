/** GA4 event helpers. No-op when gtag is not loaded (missing NEXT_PUBLIC_GA_ID). */

type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") return;
  const gtag = (window as GtagWindow).gtag;
  if (!gtag) return;
  gtag("event", name, params);
}

export function trackWhatsappClick(source: string) {
  trackEvent("whatsapp_click", { link_source: source });
}
