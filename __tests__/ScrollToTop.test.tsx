import { render, screen, fireEvent } from "@testing-library/react";
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

  it("becomes visible after scrolling", () => {
    render(<ScrollToTop />);
    Object.defineProperty(window, "scrollY", { value: 500 });
    fireEvent.scroll(window);
    const button = screen.getByRole("button", { name: /scroll to top/i });
    expect(button).toHaveClass("opacity-100");
  });

  it("scrolls to top when clicked", () => {
    const scrollToMock = jest.fn();
    window.scrollTo = scrollToMock;
    render(<ScrollToTop />);
    const button = screen.getByRole("button", { name: /scroll to top/i });
    fireEvent.click(button);
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
