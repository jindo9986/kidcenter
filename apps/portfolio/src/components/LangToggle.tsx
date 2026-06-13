"use client";

import { useEffect, useState } from "react";
import { Button } from "@kidcenter/ui";
import type { Locale } from "@/lib/locale";

export function LangToggle() {
  const [locale, setLocale] = useState<Locale>("vi");

  useEffect(() => {
    // Sync from the persisted locale on mount (external source).
    const saved = (localStorage.getItem("locale") as Locale | null) ?? "vi";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocale(saved);
    document.documentElement.dataset.locale = saved;
  }, []);

  function toggle() {
    const next: Locale = locale === "vi" ? "en" : "vi";
    setLocale(next);
    document.documentElement.dataset.locale = next;
    localStorage.setItem("locale", next);
  }

  return (
    <Button
      variant="ghost"
      size="md"
      onClick={toggle}
      aria-label="Switch language"
      className="min-h-11"
    >
      🌐 {locale === "vi" ? "EN" : "VI"}
    </Button>
  );
}
