import { render, screen, fireEvent } from "@testing-library/react";
import ChatInput from "@/app/chat/components/ChatInput";

describe("ChatInput", () => {
  it("renders an input field", () => {
    render(<ChatInput input="" setInput={() => {}} onSend={() => {}} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("updates when typing", () => {
    const setInput = jest.fn();
    render(<ChatInput input="" setInput={setInput} onSend={() => {}} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "hello mentor" } });
    expect(setInput).toHaveBeenCalledWith("hello mentor");
  });

  it("calls onSend when Enter is pressed", () => {
    const onSend = jest.fn();
    render(<ChatInput input="hello" setInput={() => {}} onSend={onSend} />);
    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(onSend).toHaveBeenCalled();
  });
});
