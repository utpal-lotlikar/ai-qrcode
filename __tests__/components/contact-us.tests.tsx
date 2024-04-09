import { ContactUs } from "@/components/contact-us";
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
    json: () => Promise.resolve({ message: "Message sent successfully!" }),
  } as Response)
);

describe("Contact Us Component Tests", () => {
  it("renders the button trigger", () => {
    render(<ContactUs />);

    const button = screen.getByText("Contact Us");
    expect(button).toBeInTheDocument();
  });

  it("renders the contact us form when button is triggered", () => {
    render(<ContactUs />);

    const button = screen.getByRole("button", { name: /contact us/i });
    fireEvent.click(button);

    const nameLabel = screen.getByLabelText(/Name/i);
    expect(nameLabel).toBeInTheDocument();

    const nameInput = screen.getByRole("textbox", { name: /name/i });
    expect(nameInput).toBeInTheDocument();

    const messageLabel = screen.getByLabelText(/Message/i);
    expect(messageLabel).toBeInTheDocument();

    const messageInput = screen.getByRole("textbox", { name: /message/i });
    expect(messageInput).toBeInTheDocument();
  });

  it("allows user to fill and submit the form", async () => {
    const user = userEvent.setup();
    render(
      <>
        <ContactUs />
        <Toaster richColors />
      </>
    );

    const button = screen.getByRole("button", { name: /contact us/i });
    fireEvent.click(button);

    fireEvent.change(screen.getByPlaceholderText("Please enter your name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your message"), {
      target: { value: "Hello, this is a test message." },
    });

    await user.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() =>
      expect(screen.getByText("Message sent successfully!")).toBeInTheDocument()
    );
  });

  it("handles form submission errors gracefully", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "Failed to send message" }),
      } as Response)
    );

    render(
      <>
        <ContactUs />
        <Toaster richColors />
      </>
    );

    const button = screen.getByRole("button", { name: /contact us/i });
    fireEvent.click(button);

    fireEvent.change(screen.getByPlaceholderText("Please enter your name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your message"), {
      target: { value: "Hello, this is a test message." },
    });

    await user.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() =>
      expect(screen.getByText("Failed to send message")).toBeInTheDocument()
    );
  });
});
