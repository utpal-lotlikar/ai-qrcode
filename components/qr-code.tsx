import { QrCode } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { saveAs } from "file-saver";

function QRCode({ image }: { image: string }) {
  const downloadImage = async () => {
    if (image) {
      const response = await fetch(image);
      const blob = await response.blob();
      saveAs(blob, "ai_qr_code.png");
    }
  };

  return (
    <>
      {image ? (
        <Image src={image} width={250} height={250} alt="QR code" />
      ) : (
        <QrCode size={250} role="img" aria-label="QR Code"/>
      )}

      <Button className="gap-2" onClick={downloadImage} disabled={!image}>
        Download PNG
      </Button>
    </>
  );
}

export default QRCode;
