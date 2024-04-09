import React from "react";
import { ModeToggle } from "./mode-toggle";
import { ContactUs } from "./contact-us";

export default function Header() {
  return (
    <div className="w-full p-2 flex flex-row justify-between items-center border-b">
      <h3 className="text-lg font-bold text-purple-500">
        AI QR Code Generator
      </h3>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <ContactUs />
      </div>
    </div>
  );
}
