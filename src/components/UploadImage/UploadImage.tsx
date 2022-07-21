import { useEffect, useRef, useState } from "react";
import "./UploadImage.css";
import {
  shrinkLogo,
  generateTransformedLogo,
  transformToBlackOnWhite,
  transformToWhiteOnTransparent,
  generateCardImage,
} from "../.././lib/image_transformation";
import {
  CARD_HEIGHT_PX,
  CARD_WIDTH_PX,
  LOGO_HEIGHT_PX,
  LOGO_WIDTH_PX,
  LOGO_X_OFFSET_PX,
  LOGO_Y_OFFSET_PX,
} from "../../lib/constants";

const DISPLAY_WIDTH_PX = CARD_WIDTH_PX / 4;
const DISPLAY_HEIGHT_PX = CARD_HEIGHT_PX / 4;

interface Props {
  blobUri: string;
  filename: string;
}

function UploadImage({ blobUri, filename }: Props) {
  const [logo2Url, setLogo2Url] = useState("");
  const [logo3Url, setLogo3Url] = useState("");

  const [shrunkLogo1Url, setShrunkLogo1Url] = useState("");
  const [shrunkLogo2Url, setShrunkLogo2Url] = useState("");
  const [shrunkLogo3Url, setShrunkLogo3Url] = useState("");

  const [card1Url, setCard1Url] = useState("");
  const [card2Url, setCard2Url] = useState("");
  const [card3Url, setCard3Url] = useState("");

  // Generate the 2 additional full-sized images
  useEffect(() => {
    generateTransformedLogo(
      blobUri,
      transformToWhiteOnTransparent,
      "image/png",
      (dataUrl) => setLogo2Url(dataUrl)
    );

    generateTransformedLogo(
      blobUri,
      transformToBlackOnWhite,
      "image/jpeg",
      (dataUrl) => setLogo3Url(dataUrl)
    );
  }, [blobUri]);

  // Generate shrunk logo and full-card image: Original
  useEffect(() => {
    shrinkLogo(blobUri, "image/png", setShrunkLogo1Url);
    generateCardImage(blobUri, setCard1Url);
  }, [blobUri]);

  // Generate shrunk logo and full-card image: White on transparent
  useEffect(() => {
    shrinkLogo(logo2Url, "image/png", setShrunkLogo2Url);
    generateCardImage(logo2Url, setCard2Url);
  }, [logo2Url]);

  // Generate shrunk logo and full-card image: Black on white
  useEffect(() => {
    shrinkLogo(logo3Url, "image/jpeg", setShrunkLogo3Url);
    generateCardImage(logo3Url, setCard3Url);
  }, [logo3Url]);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th />
            <th>Original Image</th>
            <th>White fg + Transparent bg</th>
            <th>Black fg + White bg</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Logos</th>
            <td>
              <img
                src={blobUri}
                style={{
                  aspectRatio: `${CARD_WIDTH_PX} / ${CARD_HEIGHT_PX}`,
                  width: "20vw",
                  border: "1px dashed #646cff",
                }}
              />
            </td>
            <td>
              <img
                src={logo2Url}
                style={{
                  aspectRatio: `${CARD_WIDTH_PX} / ${CARD_HEIGHT_PX}`,
                  width: "20vw",
                  border: "1px dashed #646cff",
                }}
              />
            </td>
            <td>
              <img
                src={logo3Url}
                style={{
                  aspectRatio: `${CARD_WIDTH_PX} / ${CARD_HEIGHT_PX}`,
                  width: "20vw",
                  border: "1px dashed #646cff",
                }}
              />
            </td>
          </tr>

          <tr>
            <td />
            <td>
              {blobUri && (
                <a href={blobUri} download={filename + "_original"}>
                  Download
                </a>
              )}
            </td>
            <td>
              {logo2Url && (
                <a href={logo2Url} download={filename + "_white_transparent"}>
                  Download
                </a>
              )}
            </td>
            <td>
              {logo3Url && (
                <a href={logo3Url} download={filename + "_black_white"}>
                  Download
                </a>
              )}
            </td>
          </tr>
          {/* Spacer row */}
          <tr style={{ height: "3rem" }} />
          {/* Spacer row */}
          <tr>
            <th>Shrunk logos</th>
            <td>
              <img
                src={shrunkLogo1Url}
                style={{
                  aspectRatio: `${CARD_WIDTH_PX} / ${CARD_HEIGHT_PX}`,
                  width: "20vw",
                  border: "1px dashed #646cff",
                }}
              />
            </td>

            <td>
              <img
                src={shrunkLogo2Url}
                style={{
                  aspectRatio: `${CARD_WIDTH_PX} / ${CARD_HEIGHT_PX}`,
                  width: "20vw",
                  border: "1px dashed #646cff",
                }}
              />
            </td>
            <td>
              <img
                src={shrunkLogo3Url}
                style={{
                  aspectRatio: `${CARD_WIDTH_PX} / ${CARD_HEIGHT_PX}`,
                  width: "20vw",
                  border: "1px dashed #646cff",
                }}
              />
            </td>
          </tr>
          <tr>
            <td />
            <td>
              {shrunkLogo1Url && (
                <a
                  href={shrunkLogo1Url}
                  download={"shrunklogo_" + filename + "_original"}
                >
                  Download
                </a>
              )}
            </td>
            <td>
              {shrunkLogo2Url && (
                <a
                  href={shrunkLogo2Url}
                  download={"shrunklogo_" + filename + "_white_transparent"}
                >
                  Download
                </a>
              )}
            </td>
            <td>
              {shrunkLogo3Url && (
                <a
                  href={shrunkLogo3Url}
                  download={"shrunklogo_" + filename + "_black_white"}
                >
                  Download
                </a>
              )}
            </td>
          </tr>
          {/* Spacer row */}
          <tr style={{ height: "3rem" }} />
          {/* Spacer row */}
          <tr>
            <th>Cards</th>
            <td>
              <img
                src={card1Url}
                style={{
                  aspectRatio: `${CARD_WIDTH_PX} / ${CARD_HEIGHT_PX}`,
                  width: "20vw",
                }}
              />
            </td>

            <td>
              <img
                src={card2Url}
                style={{
                  aspectRatio: `${CARD_WIDTH_PX} / ${CARD_HEIGHT_PX}`,
                  width: "20vw",
                }}
              />
            </td>
            <td>
              <img
                src={card3Url}
                style={{
                  aspectRatio: `${CARD_WIDTH_PX} / ${CARD_HEIGHT_PX}`,
                  width: "20vw",
                }}
              />
            </td>
          </tr>
          <tr>
            <td />
            <td>
              {card1Url && (
                <a href={card1Url} download={"card_" + filename + "_original"}>
                  Download
                </a>
              )}
            </td>
            <td>
              {card2Url && (
                <a
                  href={card2Url}
                  download={"card_" + filename + "_white_transparent"}
                >
                  Download
                </a>
              )}
            </td>
            <td>
              {card3Url && (
                <a
                  href={card3Url}
                  download={"card_" + filename + "_black_white"}
                >
                  Download
                </a>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default UploadImage;
