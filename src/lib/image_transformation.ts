import { Area } from "react-easy-crop";

export const transformToWhiteOnTransparent = (
  pixels: Uint8ClampedArray
): void => {
  // Modify pixels in-place.
  for (let i = 0; i < pixels?.length; i += 4) {
    let red = pixels[i];
    let green = pixels[i + 1];
    let blue = pixels[i + 2];
    let alpha = pixels[i + 3];

    // If a > 0.1 or rgb >= (240, 240, 240), then set a == 1
    // Else, set rgba to (255, 255, 255, 0)
    if (alpha <= 0.1 || isCloseToWhite(red, green, blue)) {
      pixels[i + 3] = 0; // Make transparent
    } else {
      pixels[i] = 255;
      pixels[i + 1] = 255;
      pixels[i + 2] = 255;
      pixels[i + 3] = 255; // Zero opacity, Full alpha
    }
  }
};

export const transformToBlackOnWhite = (pixels: Uint8ClampedArray): void => {
  // Note: The input pixels are expected to be the original image file uploaded by the user, instead of the "white on transparent" one.
  // Modify pixels in-place.
  for (let i = 0; i < pixels?.length; i += 4) {
    let red = pixels[i];
    let green = pixels[i + 1];
    let blue = pixels[i + 2];
    let alpha = pixels[i + 3];

    // If a > 0.1 or rgb >= (240, 240, 240), then set rgba to (255, 255, 255, 255)
    // Else, set rgba to (0, 0, 0, 255)
    if (alpha <= 0.1 || isCloseToWhite(red, green, blue)) {
      pixels[i] = 255;
      pixels[i + 1] = 255;
      pixels[i + 2] = 255;
      pixels[i + 3] = 255; // Zero opacity, Full alpha
    } else {
      pixels[i] = 0;
      pixels[i + 1] = 0;
      pixels[i + 2] = 0;
      pixels[i + 3] = 255; // Zero opacity, Full alpha
    }
  }
};

const isCloseToWhite = (red: number, green: number, blue: number) => {
  return red >= 240 && green >= 240 && blue >= 240;
};

export function getCroppedImg(
  imageSrc: string | undefined,
  pixelCrop: Area | undefined
) {
  if (!imageSrc || !pixelCrop) {
    return;
  }
  const image = new Image();
  image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
  image.src = imageSrc;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return;
  }
  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );
  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated image at the top left corner
  ctx.putImageData(data, 0, 0);

  return canvas.toDataURL("image/png", 1);
}
