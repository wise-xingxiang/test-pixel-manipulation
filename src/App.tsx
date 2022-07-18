import React, { useState } from "react";
import "./App.css";
import CropImage from "./pages/CropImage";
import UploadImage from "./pages/UploadImage";

const App = () => {
  const [blobUri, setBlobUri] = useState<string>();
  const [filename, setFilename] = useState<string>();

  if (blobUri && filename) {
    return (
      <>
        <button
          onClick={() => {
            setFilename("");
            setBlobUri("");
          }}
          style={{ position: "absolute", top: "1rem", left: "1rem" }}
        >
          Reset
        </button>
        <UploadImage blobUri={blobUri} filename={filename} />
      </>
    );
  } else {
    return (
      <CropImage
        cropConfirmCallback={(fileUri, _filename) => {
          setBlobUri(fileUri);
          setFilename(_filename);
        }}
      />
    );
  }
};

export default App;
