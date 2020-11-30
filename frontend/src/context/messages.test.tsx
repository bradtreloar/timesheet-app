import React, { useEffect } from "react";
import { Alert } from "react-bootstrap";
import { MessagesProvider, useMessages } from "./messages";
import randomstring from "randomstring";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

const MessagesFixture: React.FC = ({ children }) => {
  const { messages } = useMessages();

  return (
    <>
      {messages.map(({ type, value }, index) => (
        <Alert key={index} variant={type}>
          {value}
        </Alert>
      ))}
    </>
  );
};

test("set message", () => {
  const testMessage = randomstring.generate();
  const Fixture: React.FC = () => {
    const { setMessage } = useMessages();

    useEffect(() => {
      setMessage("success", testMessage);
    }, []);

    return (
      <>
        <MessagesFixture />
      </>
    );
  };

  render(
    <MessagesProvider>
      <Fixture />
    </MessagesProvider>
  );

  screen.getByText(testMessage);
});

test("dismiss messages", async () => {
  const testMessage = randomstring.generate();
  const Fixture: React.FC = () => {
    const { messages, setMessage, dismissMessages } = useMessages();

    useEffect(() => {
      setMessage("success", testMessage);
    }, []);

    return (
      <>
        <MessagesFixture />
        <button onClick={() => dismissMessages(messages)}>
          Dismiss messages
        </button>
      </>
    );
  };

  render(
    <MessagesProvider>
      <Fixture />
    </MessagesProvider>
  );

  screen.getByText(testMessage);

  userEvent.click(screen.getByText(/dismiss messages/i));
  expect(screen.queryByText(testMessage)).toBeNull();
});
