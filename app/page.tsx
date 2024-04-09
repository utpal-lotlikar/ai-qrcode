"use client";

import { useState } from "react";
import QRCode from "@/components/qr-code";
import AiForm from "@/components/ai-form";
import Image from "next/image";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="border rounded-lg p-6 mt-12 bg-gray-50 dark:bg-gray-700">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.png"
            width={60}
            height={60}
            alt="Logo"
            className="border rounded-lg"
          />
        </div>
        <h2 className="md:text-4xl font-bold text-center mb-4">
          Online Generator of{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Artistic AI
          </span>{" "}
          QR Codes
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="lg:w-[400px] mt-4 p-8 border rounded-xl bg-gray-100 dark:bg-gray-600">
            <AiForm setImage={setImage} />
          </div>
          <div className="lg:w-[400px] mt-4 p-8 gap-4 border rounded-xl bg-gray-100 dark:bg-gray-600 flex flex-col justify-between items-center">
            <QRCode image={image!} />
          </div>
        </div>
      </div>
    </main>
  );
}
