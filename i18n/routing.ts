import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr", "es", "de", "pt", "zh", "ja", "it"],
  defaultLocale: "en",
  localePrefix: "as-needed", // English URLs stay without prefix (/pricing not /en/pricing)
});
