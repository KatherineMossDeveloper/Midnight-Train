// /utility/exportImages.ts
// functions that copy images to clipboard
//
// export async function copySvgElementToClipboard
//     function cloneSvgWithInlineStyles
// export async function copyPngElementToClipboard
//

// ************************************************
function cloneSvgWithInlineStyles(svg: SVGSVGElement): SVGSVGElement {
  const clone = svg.cloneNode(true) as SVGSVGElement;

  const originalElements = svg.querySelectorAll("*");
  const clonedElements = clone.querySelectorAll("*");

  for (let i = 0; i < originalElements.length; i++) {
    const original = originalElements[i] as HTMLElement;
    const cloned = clonedElements[i] as HTMLElement;

    const computed = window.getComputedStyle(original);

    // Copy important computed properties
    for (const key of computed) {
      const value = computed.getPropertyValue(key);
      if (value) {
        cloned.style.setProperty(key, value);
      }
    }
  }

  return clone;
}

// ************************************************
export async function copySvgElementToClipboard(svg: SVGSVGElement) {
  const styledClone = cloneSvgWithInlineStyles(svg);

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(styledClone);

  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const clipboardItem = new ClipboardItem({ "image/svg+xml": blob });

  await navigator.clipboard.write([clipboardItem]);
}

// ************************************************
export async function copyPngElementToClipboard(svgElement: SVGSVGElement) {

  // get the rendered size to make sure the copy is like the screen image.
  const rect = svgElement.getBoundingClientRect();
  const width = Math.round(rect.width);
  const height = Math.round(rect.height);

  // cloning the SVGSVGElement, so that we can reach its properties.
  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));

  const existingViewBox = clone.getAttribute("viewBox");
  if (!existingViewBox) {
    clone.setAttribute("viewBox", `0 0 ${width} ${height}`);
  }

  // turn the element into a string
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);

  // create basically a pointer to the image (string) in memory.
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  try {
    const img = new Image();
    img.src = url;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load SVG into image"));
    });

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // rasterize:  create pixels from the image (string)
    ctx.drawImage(img, 0, 0, width, height);

    await new Promise<void>((resolve, reject) => {
      canvas.toBlob(async (pngBlob) => {
        if (!pngBlob) {
          reject(new Error("Failed to create PNG blob"));
          return;
        }

        try {
          const clipboardItem = new ClipboardItem({ "image/png": pngBlob });
          await navigator.clipboard.write([clipboardItem]);
          resolve();
        } catch (err) {
          reject(err);
        }
      }, "image/png");
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}