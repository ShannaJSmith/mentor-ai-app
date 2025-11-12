import { render, screen } from "@testing-library/react";
import ChatMessage from "@/app/chat/components/ChatMessage";

// Mock Avatar component to avoid dealing with its internals
jest.mock("@/app/chat/components/Avatar", () => ({
  __esModule: true,
  default: ({ sender }: { sender: string }) => (
    <div data-testid={`avatar-${sender}`} />
  ),
}));

describe("ChatMessage", () => {
  const now = Date.now();

  it("renders user message on the right with user avatar", () => {
    render(<ChatMessage sender="user" text="Hello" timestamp={now} />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByTestId("avatar-user")).toBeInTheDocument();
    expect(screen.queryByTestId("avatar-model")).not.toBeInTheDocument();
  });
});
