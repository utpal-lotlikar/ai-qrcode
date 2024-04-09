import AiForm from "@/components/ai-form";
import { Toaster } from "@/components/ui/sonner";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

(Object.defineProperty as any)(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve("QR generated successfully!"),
  } as Response)
);

describe("AI Form Component Tests", () => {
  it("renders the form", () => {
    const setImageFn = jest.fn;
    render(<AiForm setImage={setImageFn} />);

    const urlLabel = screen.getByLabelText(/URL/i);
    expect(urlLabel).toBeInTheDocument();

    const urlInput = screen.getByRole("textbox", { name: /url/i });
    expect(urlInput).toBeInTheDocument();

    const promptLabel = screen.getByLabelText(/Prompt/i);
    expect(promptLabel).toBeInTheDocument();

    const promptInput = screen.getByRole("textbox", { name: /prompt/i });
    expect(promptInput).toBeInTheDocument();
  });

  it("allows user to fill and submit the form", async () => {
    const user = userEvent.setup();
    const setImageFn = jest.fn;
    render(
      <>
        <AiForm setImage={setImageFn} />
        <Toaster richColors />
      </>
    );

    await user.type(screen.getByLabelText(/URL/i), "http://www.example.com");
    await user.type(screen.getByLabelText(/Prompt/i), "A sample prompt");

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(screen.getByText("QR Code Generated!")).toBeInTheDocument()
    );
  });

  it("displayes error when the api fails", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve("QR generation failed!"),
        json: () => Promise.resolve({ message: "Failed to generate QR code" }),
      } as Response)
    );

    const setImageFn = jest.fn;
    render(
      <>
        <AiForm setImage={setImageFn} />
        <Toaster richColors />
      </>
    );

    await user.type(screen.getByLabelText(/URL/i), "http://www.example.com");
    await user.type(screen.getByLabelText(/Prompt/i), "A sample prompt");

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(screen.getByText("QR Code Generated Failed")).toBeInTheDocument()
    );
  });

  it("logs error toast when the api raises error", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("Network error"))
    );

    const setImageFn = jest.fn;
    render(
      <>
        <AiForm setImage={setImageFn} />
        <Toaster richColors />
      </>
    );

    await user.type(screen.getByLabelText(/URL/i), "http://www.example.com");
    await user.type(screen.getByLabelText(/Prompt/i), "A sample prompt");

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(screen.getByText("QR Code Generated Failed")).toBeInTheDocument()
    );
  });

  it("shows loading indicator when form is submitted", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                text: () => Promise.resolve("QR generated successfully!"),
              }),
            100
          )
        )
    );

    const setImageFn = jest.fn;
    render(
      <>
        <AiForm setImage={setImageFn} />
        <Toaster richColors />
      </>
    );

    await user.type(screen.getByLabelText(/URL/i), "http://www.example.com");
    await user.type(screen.getByLabelText(/Prompt/i), "A sample prompt");

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();

    const qrCodeSVG = screen.getByRole("loader", { name: "Loading" });
    expect(qrCodeSVG).toBeInTheDocument();
  });

  it("logs error in console when /api/send throws error", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes("/api/send")) {
        return Promise.reject(new Error("Network error"));
      } else {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve("QR generated successfully!"),
        });
      }
    });

    const consoleSpy = jest.spyOn(console, "error");

    const setImageFn = jest.fn;
    render(
      <>
        <AiForm setImage={setImageFn} />
        <Toaster richColors />
      </>
    );

    await user.type(screen.getByLabelText(/URL/i), "http://www.example.com");
    await user.type(screen.getByLabelText(/Prompt/i), "A sample prompt");

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error:",
      new Error("Network error")
    );

    consoleSpy.mockRestore();
  });
});
