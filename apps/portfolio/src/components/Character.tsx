import type { Character as CharacterType } from "@/lib/schemas";
import { Localized } from "./Localized";

export function Character({ data }: { data: CharacterType }) {
  return (
    <div className="break-avoid rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-lg font-extrabold text-white">
          {data.level.code}
        </span>
        <span className="font-display text-lg font-bold text-ink">
          <Localized value={{ vi: data.level.vi, en: data.level.en }} />
        </span>
        <span className="rounded-full bg-teal/12 px-2.5 py-0.5 text-xs font-bold text-teal">
          <Localized value={data.allYearsNote} />
        </span>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {data.attributes.map((a, i) => (
          <li
            key={i}
            className="break-avoid flex items-start gap-3 rounded-2xl bg-cream p-3"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-extrabold text-brand">
              {data.level.code}
            </span>
            <div>
              <p className="font-bold text-ink">
                <Localized value={a.keyword} />
              </p>
              <p className="text-sm text-ink/60">
                <Localized value={a.desc} />
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs text-ink/40">
        <Localized value={data.scaleNote} />
      </p>
    </div>
  );
}
