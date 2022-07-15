import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import DeliverooLogo from "./assets/deliveroo_logo.png";
import {
  transformToBlackOnWhite,
  transformToWhiteOnTransparent,
} from "./lib/image_transformation";

function App() {
  const originalRef = useRef<HTMLCanvasElement>(null);
  const editedOneRef = useRef<HTMLCanvasElement>(null);
  const editedTwoRef = useRef<HTMLCanvasElement>(null);

  const [filename, setFilename] = useState<string>();
  const [imageUrl, setImageUrl] = useState("");
  const [downloadOneUrl, setDownloadOneUrl] = useState("");
  const [downloadTwoUrl, setDownloadTwoUrl] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.item(0);
    const imageFileUrl = URL.createObjectURL(imageFile as Blob);
    setFilename(imageFile?.name.split(".").at(0));

    setImageUrl(imageFileUrl);

    // Draw original image
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

        // Draw new image onto cavas
        const originalImg = new Image();
        originalImg.crossOrigin = "anonymous";
        originalImg.src = imageFileUrl;
        console.log(originalImg);
        originalImg.onload = () => originalContext.drawImage(originalImg, 0, 0);
      }
    }

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
        editedImg.src = imageFileUrl;
        editedImg.onload = () => {
          editedContext.drawImage(editedImg, 0, 0);
          const imageData = editedContext.getImageData(
            0,
            0,
            editedCanvas.width,
            editedCanvas.height
          );
          const pixels = imageData.data;
          transformToWhiteOnTransparent(pixels);
          editedContext.putImageData(imageData, 0, 0);

          const dataURL = editedCanvas.toDataURL("image/png", 1);
          console.log(dataURL);
          setDownloadOneUrl(dataURL);
        };
      }
    }

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
        editedTwoImg.src = imageFileUrl;
        editedTwoImg.onload = () => {
          editedTwoContext.drawImage(editedTwoImg, 0, 0);
          const imageData = editedTwoContext.getImageData(
            0,
            0,
            editedTwoCanvas.width,
            editedTwoCanvas.height
          );
          const pixels = imageData.data;
          transformToBlackOnWhite(pixels);
          editedTwoContext.putImageData(imageData, 0, 0);

          const dataURL = editedTwoCanvas.toDataURL("image/png", 1);
          console.log(dataURL);
          setDownloadTwoUrl(dataURL);
        };
      }
    }
  };

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th>Original</th>
            <th>White fg + Transparent bg</th>
            <th>Black fg + White bg</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <canvas
                id="original"
                width="350"
                height="350"
                ref={originalRef}
              />
            </td>

            <td>
              <canvas
                id="editedOne"
                width="350"
                height="350"
                ref={editedOneRef}
              />
            </td>

            <td>
              <canvas
                id="editedTwo"
                width="350"
                height="350"
                ref={editedTwoRef}
              />
            </td>
          </tr>

          <tr>
            <td></td>
            <td>
              {downloadOneUrl && (
                <a
                  href={downloadOneUrl}
                  download={filename + "_white_transparent"}
                >
                  Download
                </a>
              )}
            </td>
            <td>
              {" "}
              {downloadTwoUrl && (
                <a href={downloadTwoUrl} download={filename + "_black_white"}>
                  Download
                </a>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <input
        type="file"
        onChange={handleImageUpload}
        accept="image/png, image/jpg"
      />
    </div>
  );
}

export default App;
