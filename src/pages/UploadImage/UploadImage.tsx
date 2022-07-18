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
        console.log("image width and height: ", img2.width, img2.height);
        console.log("canvas width and height: ", canvas2.width, canvas2.height);
        context2.putImageData(imgData2, 0, 0);

        const dataURL = canvas2.toDataURL("image/png", 1);
        setFile2Url(dataURL);
        console.log({ file2Url: dataURL });
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

        const dataURL = canvas3.toDataURL("image/png", 1);
        setFile3Url(dataURL);
        console.log({ file3Url: dataURL });
      };
    }
  }, [file2Url, file3Url]);

  // Display to client - original
  useEffect(() => {
    if (originalRef.current) {
      const originalCanvas = originalRef.current;
      const originalContext = originalCanvas.getContext("2d");

      if (originalContext) {
        // Clear canvas
        originalContext.clearRect(
          0,
          0,
          originalCanvas.width,
          originalCanvas.height
        );

        const originalImg = new Image();
        originalImg.crossOrigin = "anonymous";
        originalImg.src = blobUri;
        originalImg.onload = () =>
          originalContext.drawImage(
            originalImg,
            0,
            0,
            originalImg.width,
            originalImg.height,
            0,
            0,
            originalCanvas.width,
            originalCanvas.height
          );
      }
    }
  }, [blobUri]);

  // Display to client - white on transparent
  useEffect(() => {
    // Draw edited image
    if (editedOneRef.current) {
      const editedCanvas = editedOneRef.current;
      const editedContext = editedCanvas.getContext("2d");
      if (editedContext) {
        // Clear canvas
        editedContext.clearRect(0, 0, editedCanvas.width, editedCanvas.height);

        // Draw new image onto cavas
        const editedImg = new Image();
        editedImg.crossOrigin = "anonymous";
        editedImg.src = file2Url;
        editedImg.onload = () => {
          editedContext.drawImage(
            editedImg,
            0,
            0,
            editedImg.width,
            editedImg.height,
            0,
            0,
            editedCanvas.width,
            editedCanvas.height
          );
        };
      }
    }
  }, [file2Url]);

  // Display to client - black on white
  useEffect(() => {
    // Draw editedTwo image (black on white background)
    if (editedTwoRef.current) {
      const editedTwoCanvas = editedTwoRef.current;
      const editedTwoContext = editedTwoCanvas.getContext("2d");
      if (editedTwoContext) {
        // Clear canvas
        editedTwoContext.clearRect(
          0,
          0,
          editedTwoCanvas.width,
          editedTwoCanvas.height
        );

        // Draw new image onto cavas
        const editedTwoImg = new Image();
        editedTwoImg.crossOrigin = "anonymous";
        editedTwoImg.src = file3Url;
        editedTwoImg.onload = () => {
          editedTwoContext.drawImage(
            editedTwoImg,
            0,
            0,
            editedTwoImg.width,
            editedTwoImg.height,
            0,
            0,
            editedTwoCanvas.width,
            editedTwoCanvas.height
          );
        };
      }
    }
  }, [file3Url]);

  return (
    <div style={{ width: "100%" }}>
      {/* <Header /> */}
      <table style={{ marginBlock: "auto", width: "100%" }}>
        <thead>
          <tr>
            <th>Scenario</th>
            <th>Result</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Original Image</td>
            <td>
              <canvas
                id="original"
                width={DISPLAY_WIDTH_PX}
                height={DISPLAY_HEIGHT_PX}
                ref={originalRef}
              />
            </td>
            <td />
          </tr>

          <tr>
            <td>White fg + Transparent bg</td>
            <td>
              <canvas
                id="editedOne"
                width={DISPLAY_WIDTH_PX}
                height={DISPLAY_HEIGHT_PX}
                ref={editedOneRef}
              />
            </td>

            <td>
              {file2Url && (
                <a href={file2Url} download={filename + "_white_transparent"}>
                  Download
                </a>
              )}
            </td>
          </tr>

          <tr>
            <td>Black fg + White bg</td>
            <td>
              <canvas
                id="editedTwo"
                width={DISPLAY_WIDTH_PX}
                height={DISPLAY_HEIGHT_PX}
                ref={editedTwoRef}
              />
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
