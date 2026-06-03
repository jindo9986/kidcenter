import type {
  Achievement,
  AchievementCategory,
  L,
  Medal,
} from "@/lib/schemas";
import { Localized } from "./Localized";

const MEDAL_ICON: Record<Medal, string> = {
  gold: "🥇",
  silver: "🥈",
  bronze: "🥉",
  none: "🎖️",
};

const CATEGORY_ORDER: AchievementCategory[] = [
  "international",
  "national",
  "local",
];

// Highest award first within each group: gold → silver → bronze → none.
const MEDAL_RANK: Record<Medal, number> = {
  gold: 0,
  silver: 1,
  bronze: 2,
  none: 3,
};

const CATEGORY_LABEL: Record<AchievementCategory, L> = {
  international: { vi: "Giải Quốc tế", en: "International" },
  national: { vi: "Giải Quốc gia", en: "National" },
  local: { vi: "Cấp Trường & Thành phố", en: "School & City" },
};

function MedalRow({ item }: { item: Achievement }) {
  return (
    <li className="break-avoid flex items-start gap-3 py-2">
      <span className="text-xl leading-6" aria-hidden>
        {MEDAL_ICON[item.medal]}
      </span>
      <div className="flex-1">
        <p className="font-medium text-ink">
          <Localized value={item.title} />
        </p>
        {item.detail && (
          <p className="text-sm text-ink/55">
            <Localized value={item.detail} />
          </p>
        )}
      </div>
      {item.year && (
        <span className="shrink-0 rounded-full bg-black/5 px-2 py-0.5 text-xs font-semibold text-ink/50">
          {item.year}
        </span>
      )}
    </li>
  );
}

export function Achievements({ items }: { items: Achievement[] }) {
  return (
    <div className="grid gap-4">
      {CATEGORY_ORDER.map((cat) => {
        const group = items
          .filter((a) => a.category === cat)
          .sort((a, b) => MEDAL_RANK[a.medal] - MEDAL_RANK[b.medal]);
        if (group.length === 0) return null;
        return (
          <div
            key={cat}
            className="break-avoid rounded-3xl border border-black/5 bg-white p-5 shadow-sm"
          >
            <div className="mb-2 flex items-center gap-2">
              <h3 className="font-display text-lg font-bold text-ink">
                <Localized value={CATEGORY_LABEL[cat]} />
              </h3>
              <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand">
                {group.length}
              </span>
            </div>
            <ul className="divide-y divide-black/5">
              {group.map((item, i) => (
                <MedalRow key={i} item={item} />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
