// /utility/exportImages.ts
// functions that copy images to clipboard
//
// export async function copySvgElementToClipboard
//     function cloneSvgWithInlineStyles
// export async function copyPngElementToClipboard
//

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

export async function copySvgElementToClipboard(svg: SVGSVGElement) {
  const styledClone = cloneSvgWithInlineStyles(svg);

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(styledClone);

  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const clipboardItem = new ClipboardItem({ "image/svg+xml": blob });

  await navigator.clipboard.write([clipboardItem]);
}

export async function copyPngElementToClipboard(svgElement: SVGSVGElement) {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);

  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.src = url;

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.drawImage(img, 0, 0);

  await new Promise<void>((resolve) => {
    canvas.toBlob(async (pngBlob) => {
      if (!pngBlob) return;

      const clipboardItem = new ClipboardItem({ "image/png": pngBlob });
      await navigator.clipboard.write([clipboardItem]);
      resolve();
    });
  });

  URL.revokeObjectURL(url);
}
