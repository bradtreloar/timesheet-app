import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { MessagesProvider, useMessages } from "./messages";
import randomstring from "randomstring";
import { render, screen } from "@testing-library/react";

const testMessage = randomstring.generate();

const Fixture: React.FC = () => {
  const { messages, setMessage } = useMessages();
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
