import React from "react";

const Instruction = () => {
  return (
    <div
      style={{
        borderBottom: "2px solid rgba(30,30,30,0.25)",
        marginBottom: "2rem",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h3>Things to test:</h3>
      <ol>
        <li>Only PNG and JPG/JPEG files are accepted.</li>
        <li>Pixel transformation algorithm works as expected.</li>
        <li>Low image sizes are detected.</li>
      </ol>
    </div>
  );
};

export default Instruction;
