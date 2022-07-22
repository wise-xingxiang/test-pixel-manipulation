import {
  CARD_HEIGHT_PX,
  CARD_WIDTH_PX,
  LOGO_HEIGHT_PX,
  LOGO_WIDTH_PX,
  LOGO_X_OFFSET_PX,
  LOGO_Y_OFFSET_PX,
} from "./constants";

import template_card_url from "../assets/Template_card.png";
import template_card_plain_url from "../assets/Template_card_plain.png";

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

export const fromWhiteOnTransparentToBlackOnWhite = (
  pixels: Uint8ClampedArray
): void => {
  // Modify pixels in-place.
  for (let i = 0; i < pixels?.length; i += 4) {
    let red = pixels[i];
    let green = pixels[i + 1];
    let blue = pixels[i + 2];
    let alpha = pixels[i + 3];

    // If a > 0.1 or rgb >= (240, 240, 240), then set rgba to (255, 255, 255, 255)
    // Else, set rgba to (0, 0, 0, 255)
    if (red === 255 && green === 255 && blue === 255) {
      pixels[i] = 0;
      pixels[i + 1] = 0;
      pixels[i + 2] = 0;
      pixels[i + 3] = 255; // Zero opacity, Full alpha
    } else {
      pixels[i] = 255;
      pixels[i + 1] = 255;
      pixels[i + 2] = 255;
      pixels[i + 3] = 255; // Zero opacity, Full alpha
    }
  }
};

export const generateTransformedLogo = (
  srcBlobUri: string,
  transformationFunc: (pixels: Uint8ClampedArray) => void,
  desiredFileType: "image/png" | "image/jpeg",
  callback: (dataUrl: string) => void
) => {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH_PX;
  canvas.height = CARD_HEIGHT_PX;

  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = srcBlobUri;
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);

    const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    transformationFunc(pixels);
    context.putImageData(imgData, 0, 0);

    const dataURL = canvas.toDataURL(desiredFileType, 1);
    callback(dataURL);
  };
};

export const shrinkLogo = (
  srcBlobUri: string,
  desiredFileType: "image/png" | "image/jpeg",
  callback: (dataUrl: string) => void
) => {
  // Create canvas with the dimensions of the card
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH_PX;
  canvas.height = CARD_HEIGHT_PX;

  // Paint the image onto the crop area
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  if (desiredFileType === "image/jpeg") {
    // Addtionally, make all background pixels WHITE. Because transparent pixels when converted to JPEG will back BLACK.
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = srcBlobUri;
  img.onload = () => {
    context.drawImage(
      img,
      LOGO_X_OFFSET_PX,
      LOGO_Y_OFFSET_PX,
      LOGO_WIDTH_PX,
      LOGO_HEIGHT_PX
    );
    const dataURL = canvas.toDataURL(desiredFileType, 1);
    callback(dataURL);
  };
};

export const generateCardImage = (
  srcBlobUri: string,
  callback: (dataUrl: string) => void
) => {
  // Create canvas with the dimensions of the card
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH_PX;
  canvas.height = CARD_HEIGHT_PX;

  // Paint the image onto the crop area
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the template card image
  const baseImg = new Image();
  baseImg.crossOrigin = "anonymous";
  baseImg.src = template_card_plain_url;
  baseImg.onload = () => {
    context.drawImage(baseImg, 0, 0);

    // Draw the logo within the template card image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = srcBlobUri;
    img.onload = () => {
      context.drawImage(
        img,
        LOGO_X_OFFSET_PX,
        LOGO_Y_OFFSET_PX,
        LOGO_WIDTH_PX,
        LOGO_HEIGHT_PX
      );
      const dataURL = canvas.toDataURL("image/png", 1);
      callback(dataURL);
    };
  };
};

// Helpers

const isCloseToWhite = (red: number, green: number, blue: number) => {
  return red >= 240 && green >= 240 && blue >= 240;
};
