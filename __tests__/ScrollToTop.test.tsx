import { render, screen } from "@testing-library/react";
import ScrollToTop from "@/app/chat/components/ScrollToTop";

describe("ScrollToTop", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
  });

  it("is hidden initially", () => {
    render(<ScrollToTop />);
    const button = screen.getByRole("button", { name: /scroll to top/i });
    expect(button).toHaveClass("opacity-0");
  });
});
