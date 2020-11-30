import React, { useEffect } from "react";
import { MessagesProvider, useMessages } from "../context/messages";
import randomstring from "randomstring";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Messages from "./Messages";

const testMessage = randomstring.generate();

const Fixture: React.FC = () => {
  const { setMessage, dismissMessages } = useMessages();

  useEffect(() => {
    setMessage("success", testMessage);
  }, []);

  return (
    <>
      <Messages />
    </>
  );
};

test("show message", () => {
  render(
    <MessagesProvider>
      <Fixture />
    </MessagesProvider>
  );

  screen.getByText(testMessage);
});

test("dismiss message", () => {
  render(
    <MessagesProvider>
      <Fixture />
    </MessagesProvider>
  );

  screen.getByText(testMessage);
  userEvent.click(screen.getByText(/close alert/i));
  expect(screen.queryByText(testMessage)).toBeNull();
});
