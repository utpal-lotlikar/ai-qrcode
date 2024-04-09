import QRCode from "@/components/qr-code";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { saveAs } from "file-saver";

jest.mock("file-saver", () => ({ saveAs: jest.fn() }));

global.fetch = jest.fn(() =>
  Promise.resolve({
    blob: () => Promise.resolve(new Blob(["test"], { type: "image/png" })),
  } as Response)
);

describe("QR Codes Component Tests", () => {
  it("renders QR code image when image prop is provided", () => {
    const testImageUrl = "https://example.com/qr-code.png";
    render(<QRCode image={testImageUrl} />);

    const qrImage: HTMLImageElement = screen.getByRole("img", {
      name: /qr code/i,
    });
    expect(qrImage).toBeInTheDocument();
    expect(qrImage.src).toMatch(/qr-code\.png/i);

    const downloadButton = screen.getByRole("button", {
      name: /download png/i,
    });
    expect(downloadButton).toBeEnabled();
  });

  it("disables download button when image prop is not provided", () => {
    render(<QRCode image="" />);

    const downloadButton = screen.getByRole("button", {
      name: /download png/i,
    });
    expect(downloadButton).toBeDisabled();
  });

  it("renders svg when image prop is not provided", () => {
    render(<QRCode image="" />);

    const qrCodeSVG = screen.getByRole("img", { name: "QR Code" });
    expect(qrCodeSVG).toBeInTheDocument();
  });

  it("triggers image download when download button is clicked", async () => {
    const user = userEvent.setup();
    const testImageUrl = "https://example.com/qr-code.png";
    render(<QRCode image={testImageUrl} />);

    await user.click(screen.getByRole("button", { name: /download png/i }));

    expect(saveAs).toHaveBeenCalledTimes(1);
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), "ai_qr_code.png");
  });
});
