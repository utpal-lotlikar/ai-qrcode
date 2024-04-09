import { ModeToggle } from "@/components/mode-toggle";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Mode Toggle Component Tests", () => {
  it("renders the toggle button trigger", () => {
    render(<ModeToggle />);

    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });

  it("renders the drop down UI when button is triggered", async () => {
    const user = userEvent.setup();
    render(<ModeToggle />);

    await user.click(screen.getByRole("button", { name: /toggle theme/i }));

    const darkOption = screen.getByRole("menuitem", { name: /dark/i });
    const lightOption = screen.getByRole("menuitem", { name: /light/i });

    expect(darkOption).toBeInTheDocument();
    expect(lightOption).toBeInTheDocument();
  });
});
