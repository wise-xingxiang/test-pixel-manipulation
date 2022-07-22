import React, { useState, useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "./CropImage.css";
import "cropperjs/dist/cropper.css";
import { PX_DIMS } from "../../lib/constants";
import { getFileType } from "../../lib/filetype";
import {
  generateTransformedLogo,
  transformToWhiteOnTransparent,
} from "../../lib/image_transformation";
import useWindowDimensions from "../../hooks/useWindowDimensions";

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

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

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

            // Transform img to transparent bg
            generateTransformedLogo(
              imgSrc,
              transformToWhiteOnTransparent,
              "image/png",
              (newImgSrc) => {
                setImageSrc(newImgSrc);

                let img = new Image();
                img.src = newImgSrc;
                img.onload = () => {
                  setImageDimensions({ width: img.width, height: img.height });
                };
              }
            );
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {imageDimensions && (
              <div>
                <span>
                  Width: {imageDimensions.width}, Height:
                  {imageDimensions.height}
                </span>
                <span>
                  Min Width: {PX_DIMS.CARD_WIDTH}, Min Height:{" "}
                  {PX_DIMS.CARD_HEIGHT}
                </span>
                {imageDimensions.width < PX_DIMS.CARD_WIDTH ||
                imageDimensions.height < PX_DIMS.CARD_HEIGHT ? (
                  <p style={{ color: "#FF4136" }}>
                    Uploaded image is too small.
                  </p>
                ) : (
                  <p style={{ color: "#3D9970" }}>Uploaded image is OK.</p>
                )}
              </div>
            )}
            <div className="outer-div">
              <Cropper
                src={imageSrc}
                // style={{ height: "500px", maxWidth: "100vw" }}
                // Cropper.js options
                background={true}
                dragMode="move"
                cropBoxMovable={false}
                cropBoxResizable={false}
                center={false}
                guides={false}
                modal={false}
                ref={cropperRef}
                ready={() => {
                  if (!windowWidth || !windowHeight) {
                    return;
                  }
                  const cardWidth = windowWidth * 0.5;

                  const logoXOffset =
                    (cardWidth / PX_DIMS.CARD_WIDTH) * PX_DIMS.LOGO_X_OFFSET;

                  const logoYOffset =
                    (cardWidth / PX_DIMS.CARD_WIDTH) * PX_DIMS.LOGO_Y_OFFSET;

                  const logoWidth =
                    (cardWidth / PX_DIMS.CARD_WIDTH) * PX_DIMS.LOGO_WIDTH;

                  const logoHeight =
                    (cardWidth / PX_DIMS.CARD_WIDTH) * PX_DIMS.LOGO_HEIGHT;

                  cropperRef.current?.cropper.setCropBoxData({
                    left: logoXOffset,
                    top: logoYOffset,
                    width: logoWidth,
                    height: logoHeight,
                  });
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  position: "absolute",
                  bottom: "2rem",
                  left: "-4rem",
                }}
              >
                <button
                  style={{ marginBottom: "1rem" }}
                  onClick={() => {
                    cropperRef.current?.cropper.zoom(0.01);
                  }}
                >
                  +
                </button>
                <button
                  onClick={() => {
                    cropperRef.current?.cropper.zoom(-0.01);
                  }}
                >
                  -
                </button>
              </div>
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
