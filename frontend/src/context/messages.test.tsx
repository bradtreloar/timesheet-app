import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { MessagesProvider, useMessages } from "./messages";
import randomstring from "randomstring";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const testMessage = randomstring.generate();

const Fixture: React.FC = () => {
  const { messages, setMessage, dismissMessages } = useMessages();
  const [hasMessage, setHasMessage] = useState(false);

  useEffect(() => {
    if (!hasMessage) {
      setMessage("success", testMessage);
    }
    setHasMessage(true);
  }, [hasMessage, setMessage]);

  return (
    <>
      {messages.map(({ type, value }, index) => (
        <Alert key={index} variant={type}>
          {value}
        </Alert>
      ))}
      <button onClick={() => dismissMessages(messages)}>
        Dismiss messages
      </button>
    </>
  );
};

test("set message", () => {
  render(
    <MessagesProvider>
      <Fixture />
    </MessagesProvider>
  );

  screen.getByText(testMessage);
});

test("dismiss messages", async () => {
  render(
    <MessagesProvider>
      <Fixture />
    </MessagesProvider>
  );

  screen.getByText(testMessage);

  userEvent.click(screen.getByText(/dismiss messages/i));
  expect(screen.queryByText(testMessage)).toBeNull();
});
