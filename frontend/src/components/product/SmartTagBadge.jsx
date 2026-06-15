import { Flame, TrendingUp, Award } from "lucide-react";

const TAG_STYLES = {
  "Ultimate Steal": {
    icon: Flame,
    className: "bg-tag-steal/15 text-tag-steal border-tag-steal/30",
  },
  Trending: {
    icon: TrendingUp,
    className: "bg-tag-trending/15 text-tag-trending border-tag-trending/30",
  },
  "Best Price": {
    icon: Award,
    className: "bg-accent-secondary/15 text-accent-secondary border-accent-secondary/30",
  },
};

function SmartTagBadge({ tag }) {
  const style = TAG_STYLES[tag];
  if (!style) return null;
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${style.className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {tag}
    </span>
  );
}

export default SmartTagBadge;
