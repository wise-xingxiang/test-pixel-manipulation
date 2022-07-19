import React, { useState, useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "./CropImage.css";
import "cropperjs/dist/cropper.css";
import { IMAGE_MIN_HEIGHT_PX, IMAGE_MIN_WIDTH_PX } from "../../lib/constants";

interface Props {
  cropConfirmCallback: (
    fileUri: string | undefined,
    filename: string | undefined
  ) => void;
}

const CropImage = ({ cropConfirmCallback }: Props) => {
  const [imageSrc, setImageSrc] = useState<string>();
  const [filename, setFilename] = useState<string>();

  const cropperRef = useRef<ReactCropperElement>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFilename(file.name.split(".").at(0));
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImageSrc(reader?.result as string)
      );
      reader.readAsDataURL(file);
    }
  };

  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    if (cropper) {
      cropConfirmCallback(
        cropper.getCroppedCanvas().toDataURL("image/png", 1),
        filename
      );
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <main>
        {imageSrc ? (
          <div className="container">
            <div className="cropContainer">
              <Cropper
                src={imageSrc}
                style={{ height: "400", width: "100%" }}
                // Cropper.js options
                aspectRatio={IMAGE_MIN_WIDTH_PX / IMAGE_MIN_HEIGHT_PX}
                dragMode="move"
                cropBoxMovable={false}
                cropBoxResizable={false}
                guides={true}
                ref={cropperRef}
              />
            </div>
            <div>
              <button
                onClick={onCrop}
                style={{ marginTop: "1rem", marginBottom: "2rem" }}
              >
                Confirm crop
              </button>
            </div>
          </div>
        ) : (
          <input
            type="file"
            onChange={onFileChange}
            accept="image/png, image/jpeg"
          />
        )}
      </main>
    </div>
  );
};

export default CropImage;
