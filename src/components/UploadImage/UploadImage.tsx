import { useEffect, useRef, useState } from "react";
import "./UploadImage.css";
import {
  transformToBlackOnWhite,
  transformToWhiteOnTransparent,
} from "../.././lib/image_transformation";
import { IMAGE_MIN_HEIGHT_PX, IMAGE_MIN_WIDTH_PX } from "../../lib/constants";

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

  // Generate the 2 additional full-sized images
  useEffect(() => {
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
  }, [blobUri, file2Url, file3Url]);

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
                  border: "1px dashed #646cff",
                }}
              />
            </td>
            <td>
              <img
                src={file2Url}
                style={{
                  aspectRatio: `${IMAGE_MIN_WIDTH_PX} / ${IMAGE_MIN_HEIGHT_PX}`,
                  width: "25vw",
                  border: "1px dashed #646cff",
                }}
              />
            </td>
            <td>
              <img
                src={file3Url}
                style={{
                  aspectRatio: `${IMAGE_MIN_WIDTH_PX} / ${IMAGE_MIN_HEIGHT_PX}`,
                  width: "25vw",
                  border: "1px dashed #646cff",
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
