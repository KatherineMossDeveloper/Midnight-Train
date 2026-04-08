// imageToGrayscalePixels
// Takes a filename, pulls up the file, and returns pixels.
//
// export async function imageToGrayscalePixels
//

// ************************************************
export async function imageToGrayscalePixels(src: string): Promise<number[]> {
  return new Promise((resolve, reject) => {

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get 2D canvas context."));
        return;
      }

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const grayscalePixels: number[] = [];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // standard luminance-style grayscale conversion
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        grayscalePixels.push(gray);
      }

      resolve(grayscalePixels);
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`));
    };

    img.src = src;
  });
}