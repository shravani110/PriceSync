// Visual metadata for each marketplace we aggregate.
// Logos are rendered as colored initial-badges to avoid bundling trademarked assets.
export const STORE_META = {
  Amazon: { initial: "a", color: "#FF9900", textColor: "#0a0a0f" },
  Flipkart: { initial: "F", color: "#2874F0", textColor: "#ffffff" },
  Myntra: { initial: "M", color: "#FF3F6C", textColor: "#ffffff" },
  Ajio: { initial: "A", color: "#D4AF37", textColor: "#0a0a0f" },
  Croma: { initial: "C", color: "#06B6D4", textColor: "#0a0a0f" },
};

export function getStoreMeta(name) {
  return STORE_META[name] || { initial: name?.[0] ?? "?", color: "#9CA3AF", textColor: "#0a0a0f" };
}
