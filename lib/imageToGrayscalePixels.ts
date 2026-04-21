// imageToGrayscalePixels
// Takes a filename, pulls up the file, and returns pixel counts.
//
// export async function imageToGrayscalePixels
//

// ************************************************
export async function imageToGrayscalePixels(src: string): Promise<number[]> {
  return new Promise((resolve, reject) => {

    const img = new Image();
    img.crossOrigin = "anonymous"; // sending a security request w/o user creds.

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");  // get a context to reach tools, like getImageData.
      if (!ctx) {
        reject(new Error("Could not get 2D canvas context."));
        return;
      }
      ctx.drawImage(img, 0, 0);  // copy the image onto the surface, to get the pixels.

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;  // create an array of RGB values.
      const grayscalePixels: number[] = []; // place to load the pixel counts.

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

    console.log("Loading image, then calling img.onload implicitly  ", src);
    img.src = src;
  });
}