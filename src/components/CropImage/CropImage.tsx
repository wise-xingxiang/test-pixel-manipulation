import React, { useCallback, useMemo, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import Header from "../../layout/Header";
import { getCroppedImg } from "../../lib/image_transformation";
import "./CropImage.css";

interface Props {
  cropConfirmCallback: (
    fileUri: string | undefined,
    filename: string | undefined
  ) => void;
}

const CropImage = ({ cropConfirmCallback }: Props) => {
  const [imageSrc, setImageSrc] = React.useState<string>();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
  const [croppedImage, setCroppedImage] = useState<string>();
  const [filename, setFilename] = useState<string>();

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

  const onConfirmCrop = useCallback(async () => {
    try {
      const croppedImage = getCroppedImg(imageSrc, croppedAreaPixels);

      setCroppedImage(croppedImage);

      cropConfirmCallback(croppedImage, filename);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const croppedFileName = useMemo(() => {
    return `${filename}_${new Date().toISOString()}.png`;
  }, [croppedImage, filename]);
  return (
    <div style={{ width: "100%" }}>
      <main>
        {imageSrc ? (
          <div className="container">
            <div className="cropContainer">
              <Cropper
                crop={crop}
                onCropChange={setCrop}
                onCropComplete={(_, croppedAreaPixels) => {
                  setCroppedAreaPixels(croppedAreaPixels);
                }}
                image={imageSrc}
                aspect={2024 / 1276}
                zoom={zoom}
                onZoomChange={setZoom}
              />
            </div>
            <div>
              <button
                onClick={onConfirmCrop}
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
        {croppedImage && (
          <a href={croppedImage} download={croppedFileName}>
            {croppedFileName}
          </a>
        )}
      </main>
    </div>
  );
};

export default CropImage;
