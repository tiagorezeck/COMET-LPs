export function formatBrazilianPhone(value: string): string {
  // Clean non-digits
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export function extractUrlUtms(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};

  const trackingKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "src",
    "sck",
    "fbclid",
    "gclid",
  ];

  trackingKeys.forEach((key) => {
    const val = params.get(key);
    if (val) utms[key] = val;
  });

  utms["referrer"] = document.referrer || "direct";
  utms["page_url"] = window.location.href;

  return utms;
}
