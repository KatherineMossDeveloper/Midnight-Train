// imageToGrayscalePixels
// Takes a filename, pulls up the file, and returns pixel counts.
//
// export async function imageToGrayscalePixels
//

// ************************************************
export async function imageToGrayscalePixels(
  src: string
): Promise<number[]> {

  // 1. Load the image.
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;
  await img.decode();

  // 2. Draw the image onto a canvas.
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get 2D context.");
  }
  ctx.drawImage(img, 0, 0);

  // 3. Extract the RGBA pixels.
  const imageData = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );
  const data = imageData.data;

  const grayscalePixels = [];

  // 4. Pull every 4th value, skipping the redundant values and transparency.
  for (let i = 0; i < data.length; i += 4) {
    grayscalePixels.push(data[i]);
  }

  return grayscalePixels;
}