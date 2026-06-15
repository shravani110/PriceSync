// Search-result thumbnails are served small/low-quality by default — bump
// the size/quality params each store embeds in its CDN URL so product card
// images render sharp instead of blurry.

export function upscaleAmazonImage(url) {
  if (!url) return url;
  return url.replace(/\._[A-Za-z0-9_]+_\./, "._SL1000_.");
}

export function upscaleFlipkartImage(url) {
  if (!url) return url;
  return url.replace(/\/image\/\d+\/\d+\//, "/image/832/832/").replace(/q=\d+/, "q=90");
}

export function upscaleMyntraImage(url) {
  if (!url) return url;
  return url.replace(/w_\d+/, "w_500").replace(/q_\d+/, "q_90");
}

export function upscaleCromaImage(url) {
  if (!url) return url;
  return url.replace(/tr=w-\d+/, "tr=w-800");
}

export function upscaleVijaySalesImage(url) {
  if (!url) return url;
  return url.replace(/height=&width=/, "height=600&width=600");
}
