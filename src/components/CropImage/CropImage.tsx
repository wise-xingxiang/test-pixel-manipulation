import React, { useState, useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "./CropImage.css";
import "cropperjs/dist/cropper.css";
import { IMAGE_MIN_HEIGHT_PX, IMAGE_MIN_WIDTH_PX } from "../../lib/constants";
import { getFileType } from "../../lib/filetype";

interface Props {
  cropConfirmCallback: (
    fileUri: string | undefined,
    filename: string | undefined
  ) => void;
}

interface ImgDims {
  height: number;
  width: number;
}
const CropImage = ({ cropConfirmCallback }: Props) => {
  const [imageSrc, setImageSrc] = useState<string>();
  const [filename, setFilename] = useState<string>();
  const [imageDimensions, setImageDimensions] = useState<ImgDims>();

  const cropperRef = useRef<ReactCropperElement>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate uploaded file
      getFileType(file, (s) => {
        if (!s) {
          alert("Only png and jpg files are accepted");
          // e.target.value = e.target.defaultValue; // Reset the input
        } else {
          console.log("Image uploaded was of type", s);
          setFilename(file.name.split(".").at(0));
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            const imgSrc = reader?.result as string;
            setImageSrc(imgSrc);

            let img = new Image();
            img.src = imgSrc;
            img.onload = () => {
              setImageDimensions({ width: img.width, height: img.height });
            };
          });
          reader.readAsDataURL(file);
        }
      });
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
            {imageDimensions && (
              <div>
                <span>
                  Width: {imageDimensions.width}, Height:{" "}
                  {imageDimensions.height}{" "}
                </span>
                <span>
                  Min Width: {IMAGE_MIN_WIDTH_PX}, Min Height:{" "}
                  {IMAGE_MIN_HEIGHT_PX}
                </span>
                {imageDimensions.width < IMAGE_MIN_WIDTH_PX ||
                imageDimensions.height < IMAGE_MIN_HEIGHT_PX ? (
                  <p style={{ color: "#FF4136" }}>
                    Uploaded image is too small.
                  </p>
                ) : (
                  <p style={{ color: "#3D9970" }}>Uploaded image is OK.</p>
                )}
              </div>
            )}
            <div
              className="cropContainer"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Cropper
                src={imageSrc}
                style={{ height: "400px", width: "100%" }}
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
              <button
                onClick={() => setImageSrc(undefined)}
                style={{ marginLeft: "2rem" }}
              >
                Reset
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
