import React, { useState } from "react";
import "./App.css";
import CropImage from "./components/CropImage";
import Instruction from "./components/Instruction";
import PreviewFiles from "./components/PreviewFiles";
import UploadImage from "./components/UploadImage";

const App = () => {
  const [blobUri, setBlobUri] = useState<string>();
  const [filename, setFilename] = useState<string>();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
      }}
    >
      <Instruction />
      {blobUri && filename ? (
        <>
          <button
            onClick={() => {
              setFilename("");
              setBlobUri("");
            }}
            style={{ marginBottom: "2rem" }}
          >
            Reset
          </button>
          <PreviewFiles pngLogoUrl={blobUri} filename={filename} />
        </>
      ) : (
        <CropImage
          cropConfirmCallback={(fileUri, _filename) => {
            setBlobUri(fileUri);
            setFilename(_filename);
          }}
        />
      )}
    </div>
  );
};

export default App;
