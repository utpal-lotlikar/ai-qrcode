import Header from "@/components/header";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("Header Component Tests", () => {
  it("renders the header component", () => {
    render(<Header />);

    const appTitle = screen.getByRole("heading", {
      level: 3,
      name: /AI QR Code Generator/i,
    });
    expect(appTitle).toBeInTheDocument();
  });
});
