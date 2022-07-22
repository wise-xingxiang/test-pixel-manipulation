import { useEffect, useRef, useState } from "react";
import {
  shrinkLogo,
  generateTransformedLogo,
  transformToBlackOnWhite,
  transformToWhiteOnTransparent,
  generateCardImage,
  fromWhiteOnTransparentToBlackOnWhite,
} from "../.././lib/image_transformation";
import {
  CARD_HEIGHT_PX,
  CARD_WIDTH_PX,
  LOGO_HEIGHT_PX,
  LOGO_WIDTH_PX,
  LOGO_X_OFFSET_PX,
  LOGO_Y_OFFSET_PX,
} from "../../lib/constants";

interface Props {
  pngLogoUrl: string;
  filename: string;
}

const PreviewFiles = ({ pngLogoUrl, filename }: Props) => {
  const [previewCardUrl, setPreviewCardUrl] = useState("");
  const [jpgLogoUrl, setJpgLogoUrl] = useState("");

  useEffect(() => {
    generateCardImage(pngLogoUrl, (_previewCardUrl) => {
      setPreviewCardUrl(_previewCardUrl);

      generateTransformedLogo(
        pngLogoUrl,
        fromWhiteOnTransparentToBlackOnWhite,
        "image/jpeg",
        (bwLogoUrl) => setJpgLogoUrl(bwLogoUrl)
      );
    });
  }, [pngLogoUrl]);

  return (
    <div
      style={{
        width: "50vw",
        overflowX: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div style={{ marginBottom: "2rem" }}>
        {/* Contains the final preview of the card with the custom logo. */}
        <img
          src={previewCardUrl}
          style={{
            aspectRatio: `${CARD_WIDTH_PX} / ${CARD_HEIGHT_PX}`,
            width: "20vw",
          }}
        />
      </div>
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td>
              <img
                src={pngLogoUrl}
                style={{
                  aspectRatio: `${CARD_WIDTH_PX} / ${CARD_HEIGHT_PX}`,
                  width: "20vw",
                  border: "1px dashed #646cff",
                }}
              />
            </td>
            <td>
              <img
                src={jpgLogoUrl}
                style={{
                  aspectRatio: `${CARD_WIDTH_PX} / ${CARD_HEIGHT_PX}`,
                  width: "20vw",
                  border: "1px dashed #646cff",
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              {pngLogoUrl && (
                <a href={pngLogoUrl} download={"logo_" + filename}>
                  Download PNG file
                </a>
              )}
            </td>
            <td>
              {jpgLogoUrl && (
                <a href={jpgLogoUrl} download={"logo_" + filename}>
                  Download JPG file
                </a>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PreviewFiles;
