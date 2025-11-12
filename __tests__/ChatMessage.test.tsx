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

  it("renders model message on the left with model avatar", () => {
    render(<ChatMessage sender="model" text="Hi there" timestamp={now} />);
    expect(screen.getByText("Hi there")).toBeInTheDocument();
    expect(screen.getByTestId("avatar-model")).toBeInTheDocument();
    expect(screen.queryByTestId("avatar-user")).not.toBeInTheDocument();
  });

  it('shows "Just now" when timestamp is recent', () => {
    const recent = Date.now();
    render(
      <ChatMessage sender="model" text="Quick reply" timestamp={recent} />
    );
    expect(screen.getByText(/just now/i)).toBeInTheDocument();
  });

  it("shows relative time correctly for older timestamps", () => {
    const fiveMinsAgo = Date.now() - 5 * 60 * 1000;
    render(
      <ChatMessage sender="user" text="Testing time" timestamp={fiveMinsAgo} />
    );
    expect(screen.getByText(/5 min ago/i)).toBeInTheDocument();
  });
});
