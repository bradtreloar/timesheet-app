import React, { useEffect } from "react";
import { Alert } from "react-bootstrap";
import { MessagesProvider, useMessages } from "./messages";
import randomstring from "randomstring";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

const testMessage = randomstring.generate();

const Fixture: React.FC = () => {
  const { messages, setMessage, dismissMessages } = useMessages();

  useEffect(() => {
    setMessage("success", testMessage);
  }, []);

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
