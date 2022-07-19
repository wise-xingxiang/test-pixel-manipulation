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
