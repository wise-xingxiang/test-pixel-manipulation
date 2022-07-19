import React, { useState } from "react";
import "./App.css";
import CropImage from "./components/CropImage";
import UploadImage from "./components/UploadImage";

const App = () => {
  const [blobUri, setBlobUri] = useState<string>();
  const [filename, setFilename] = useState<string>();

  if (blobUri && filename) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: 1,
        }}
      >
        <button
          onClick={() => {
            setFilename("");
            setBlobUri("");
          }}
          style={{ marginBottom: "2rem" }}
        >
          Reset
        </button>
        <UploadImage blobUri={blobUri} filename={filename} />
      </div>
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
