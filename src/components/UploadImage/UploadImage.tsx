import { useEffect, useRef, useState } from "react";
import "./UploadImage.css";
import {
  transformToBlackOnWhite,
  transformToWhiteOnTransparent,
} from "../.././lib/image_transformation";

const IMAGE_MIN_WIDTH_PX = 2024;
const IMAGE_MIN_HEIGHT_PX = 1276;

const DISPLAY_WIDTH_PX = IMAGE_MIN_WIDTH_PX / 4;
const DISPLAY_HEIGHT_PX = IMAGE_MIN_HEIGHT_PX / 4;

interface Props {
  blobUri: string;
  filename: string;
}

function UploadImage({ blobUri, filename }: Props) {
  const originalRef = useRef<HTMLCanvasElement>(null);
  const editedOneRef = useRef<HTMLCanvasElement>(null);
  const editedTwoRef = useRef<HTMLCanvasElement>(null);

  const [file2Url, setFile2Url] = useState("");
  const [file3Url, setFile3Url] = useState("");

  // Generate the 3 full-sized images
  useEffect(() => {
    // Obtain the cropped image file blob.

    // Generate the 3 assets - original, white on transparent and black on white IN FULL IMAGE DIMENSIONS.
    // Save their respective URIs into state.

    const canvas1 = createCanvas();
    const context1 = canvas1.getContext("2d");
    if (context1) {
      context1.clearRect(0, 0, canvas1.width, canvas1.height);
      const img1 = new Image();
      img1.crossOrigin = "anonymous";
      img1.src = blobUri;
      img1.onload = () => {
        canvas1.width = img1.width;
        canvas1.height = img1.height;
        context1.drawImage(img1, 0, 0);
      };
    }

    const canvas2 = createCanvas();
    const context2 = canvas2.getContext("2d");
    if (context2) {
      context2.clearRect(0, 0, canvas2.width, canvas2.height);
      const img2 = new Image();
      img2.crossOrigin = "anonymous";
      img2.src = blobUri;
      img2.onload = () => {
        canvas2.width = img2.width;
        canvas2.height = img2.height;
        context2.drawImage(img2, 0, 0);

        const imgData2 = context2.getImageData(
          0,
          0,
          canvas2.width,
          canvas2.height
        );
        const pixels = imgData2.data;
        transformToWhiteOnTransparent(pixels);
        context2.putImageData(imgData2, 0, 0);

        const dataURL = canvas2.toDataURL("image/png", 1); // Save as png to retain transparency.
        setFile2Url(dataURL);
      };
    }

    const canvas3 = createCanvas();
    const context3 = canvas3.getContext("2d");
    if (context3) {
      context3.clearRect(0, 0, canvas3.width, canvas3.height);
      const img3 = new Image();
      img3.crossOrigin = "anonymous";
      img3.src = blobUri;
      img3.onload = () => {
        canvas3.width = img3.width;
        canvas3.height = img3.height;
        context3.drawImage(img3, 0, 0);

        const imgData3 = context3.getImageData(
          0,
          0,
          canvas3.width,
          canvas3.height
        );
        const pixels = imgData3.data;
        transformToBlackOnWhite(pixels);
        context3.putImageData(imgData3, 0, 0);

        const dataURL = canvas3.toDataURL("image/jpeg", 1); // Save as jpeg due to backend requirement.
        setFile3Url(dataURL);
      };
    }
  }, [file2Url, file3Url]);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table style={{ marginBlock: "auto", width: "100%" }}>
        <thead>
          <tr>
            <th>Original Image</th>
            <th>White fg + Transparent bg</th>
            <th>Black fg + White bg</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <img
                src={blobUri}
                style={{
                  aspectRatio: `${IMAGE_MIN_WIDTH_PX} / ${IMAGE_MIN_HEIGHT_PX}`,
                  width: "25vw",
                }}
              />
            </td>
            <td>
              <img
                src={file2Url}
                style={{
                  aspectRatio: `${IMAGE_MIN_WIDTH_PX} / ${IMAGE_MIN_HEIGHT_PX}`,
                  width: "25vw",
                }}
              />
            </td>
            <td>
              <img
                src={file3Url}
                style={{
                  aspectRatio: `${IMAGE_MIN_WIDTH_PX} / ${IMAGE_MIN_HEIGHT_PX}`,
                  width: "25vw",
                }}
              />
            </td>
          </tr>

          <tr>
            <td>
              {blobUri && (
                <a href={blobUri} download={filename + "_original"}>
                  Download
                </a>
              )}
            </td>
            <td>
              {file2Url && (
                <a href={file2Url} download={filename + "_white_transparent"}>
                  Download
                </a>
              )}
            </td>
            <td>
              {file3Url && (
                <a href={file3Url} download={filename + "_black_white"}>
                  Download
                </a>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default UploadImage;

const createCanvas = () => {
  const canvas = document.createElement("canvas");
  canvas.width = IMAGE_MIN_WIDTH_PX;
  canvas.height = IMAGE_MIN_HEIGHT_PX;
  return canvas;
};
