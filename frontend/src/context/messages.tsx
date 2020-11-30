import React, { useContext, createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message, MessageType } from "../types";

interface MessagesContextValue {
  messages: Message[];
  setMessage: (type: MessageType, value: string) => void;
  dismissMessage: (viewedMessage: Message) => void;
  dismissMessages: (viewedMessages: Message[]) => void;
}

const MessagesContext = createContext<MessagesContextValue | undefined>(
  undefined
);

/**
 * Custom hook. Returns the message context. Only works inside components
 * wrapped by MessagesProvider.
 */
export const useMessages = () => {
  const messagesContext = useContext(MessagesContext);
  if (messagesContext === undefined) {
    throw new Error("MessagesContext is undefined");
  }

  return messagesContext;
};

const MessagesProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const setMessage = (type: MessageType, value: string) => {
    setMessages([
      ...messages,
      {
        id: uuidv4(),
        value,
        type,
      },
    ]);
  };

  const dismissMessage = (viewedMessage: Message) => {
    setMessages(messages.filter(({ id }) => id !== viewedMessage.id));
  };

  const dismissMessages = (viewedMessages: Message[]) => {
    setMessages(
      messages.filter(
        (message) =>
          undefined === viewedMessages.find(({ id }) => id === message.id)
      )
    );
  };

  const value = {
    messages,
    setMessage,
    dismissMessage,
    dismissMessages,
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};

export { MessagesProvider };
