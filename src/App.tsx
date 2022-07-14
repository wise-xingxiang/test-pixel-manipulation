import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import DeliverooLogo from "./assets/deliveroo_logo.png";
import { transformToWhiteOnTransparent } from "./lib/image_transformation";

function App() {
  const originalRef = useRef<HTMLCanvasElement | null>(null);
  const editedRef = useRef<HTMLCanvasElement | null>(null);

  const [imageUrl, setImageUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.item(0);
    const imageFileUrl = URL.createObjectURL(imageFile as Blob);
    imageFile?.arrayBuffer;

    setImageUrl(imageFileUrl);

    if (originalRef.current) {
      const originalCanvas = originalRef.current;
      const originalContext = originalCanvas.getContext("2d");

      if (originalContext) {
        const originalImg = new Image();
        originalImg.crossOrigin = "anonymous";
        originalImg.src = imageFileUrl;
        console.log(originalImg);
        originalImg.onload = () => originalContext.drawImage(originalImg, 0, 0);
      }
    }

    // Draw edited image
    if (editedRef.current) {
      const editedCanvas = editedRef.current;
      const editedContext = editedCanvas.getContext("2d");
      if (editedContext) {
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
          setDownloadUrl(dataURL);
        };
      }
    }
  };

  return (
    <div className="App">
      <canvas id="original" width="350" height="350" ref={originalRef} />
      <canvas id="edited" width="350" height="350" ref={editedRef} />
      <p>{imageUrl}</p>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      {downloadUrl && (
        <a href={downloadUrl} download="edited_image">
          Download
        </a>
      )}
    </div>
  );
}

export default App;
