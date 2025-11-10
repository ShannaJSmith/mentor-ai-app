import { render, screen } from "@testing-library/react";
import ChatInput from "@/app/chat/components/ChatInput";

describe("ChatInput", () => {
  it("renders an input field", () => {
    render(<ChatInput input="" setInput={() => {}} onSend={() => {}} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});
