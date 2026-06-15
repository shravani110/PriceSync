import { useEffect, useState } from "react";

const FALLBACK_RGB = "124, 92, 252"; // accent-primary

export function useDominantColor(src) {
  const [rgb, setRgb] = useState(FALLBACK_RGB);

  useEffect(() => {
    if (!src) return;

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      if (cancelled) return;
      try {
        const size = 32;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] === 0) continue;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        if (count === 0) return;
        setRgb(`${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)}`);
      } catch {
        setRgb(FALLBACK_RGB);
      }
    };

    img.onerror = () => setRgb(FALLBACK_RGB);
    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src]);

  return rgb;
}
