const SAVED_KEY = "pricesync_saved";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function getSavedItems() {
  return readJSON(SAVED_KEY, []);
}

export function isSaved(productId) {
  return getSavedItems().some((item) => item.id === productId);
}

export function toggleSaved(product) {
  const items = getSavedItems();
  const exists = items.some((item) => item.id === product.id);
  const next = exists
    ? items.filter((item) => item.id !== product.id)
    : [...items, product];
  localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  return !exists;
}
