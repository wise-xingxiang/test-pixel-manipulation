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

    if (isCloseToWhite(red, green, blue)) {
      pixels[i + 3] = 0;
    } else {
      pixels[i] = 255;
      pixels[i + 1] = 255;
      pixels[i + 2] = 255;
      // pixels[i + 3] = 255;
    }
  }
};

const isCloseToWhite = (red: number, green: number, blue: number) => {
  return red >= 240 && green >= 240 && blue >= 240;
};
