export const getFileType = (
  file: Blob,
  callback: (s: string | undefined) => void
) => {
  const numBytesNeeded = Math.max(...imageMimes.map((m) => m.pattern.length));
  const blob = file.slice(0, numBytesNeeded); // Read the needed bytes of the file

  const fileReader = new FileReader();

  fileReader.onloadend = (e) => {
    if (!e || !fileReader.result) return;

    const bytes = new Uint8Array(fileReader.result as ArrayBuffer);

    const correctMime = imageMimes.find((mime) => isMime(bytes, mime));
    callback(correctMime?.mime);
  };

  fileReader.readAsArrayBuffer(blob);
};

function isMime(bytes: Uint8Array, mime: Mime): boolean {
  let result = mime.pattern.every((p, i) => !p || bytes[i] === p);
  return result;
}

const imageMimes: Mime[] = [
  {
    mime: "image/png",
    pattern: [0x89, 0x50, 0x4e, 0x47],
  },
  {
    mime: "image/jpeg",
    pattern: [0xff, 0xd8, 0xff],
  },
  //   {
  //     mime: "image/gif",
  //     pattern: [0x47, 0x49, 0x46, 0x38],
  //   },
  //   {
  //     mime: "image/webp",
  //     pattern: [
  //       0x52,
  //       0x49,
  //       0x46,
  //       0x46,
  //       undefined,
  //       undefined,
  //       undefined,
  //       undefined,
  //       0x57,
  //       0x45,
  //       0x42,
  //       0x50,
  //       0x56,
  //       0x50,
  //     ],
  //   },
  // You can expand this list @see https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern
];

interface Mime {
  mime: string;
  pattern: (number | undefined)[];
}
