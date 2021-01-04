import React, { useContext, createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message, MessageType } from "types";
import { DateTime } from "luxon";

/**
 * The minimum time in seconds that a message should be displayed before it can
 * be automatically dismissed.
 */
const MESSAGE_MINIMUM_DURATION = 3;

interface MessagesContextValue {
  messages: Message[];
  setMessage: (
    type: MessageType,
    value: string | JSX.Element,
    tags?: string[]
  ) => void;
  dismissMessage: (message: Message) => void;
  dismissMessagesByTag: (tag: string) => void;
  expireMessages: () => void;
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

  const { expireMessages } = messagesContext;

  // Expire messages on unmount.
  useEffect(() => {
    return () => {
      expireMessages();
    };
  }, [expireMessages]);

  return messagesContext;
};

const MessagesProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const setMessage = (
    type: MessageType,
    value: string | JSX.Element,
    tags?: string[]
  ) => {
    setMessages([
      ...messages,
      {
        id: uuidv4(),
        value,
        type,
        created: DateTime.local(),
        tags: tags || [],
      },
    ]);
  };

  const dismissMessage = (message: Message) => {
    setMessages(messages.filter(({ id }) => id !== message.id));
  };

  const dismissMessagesByTag = (tag: string) => {
    const dismissedMessages = messages.filter(({ tags }) => tags.includes(tag));
    if (dismissedMessages.length > 0) {
      const remainingMessages = messages.filter(
        ({ id }) =>
          undefined === dismissedMessages.find((message) => message.id === id)
      );
      setMessages(remainingMessages);
    }
  };

  const expireMessages = () => {
    const expiredMessages = messages.filter((message) => {
      const messageAge = DateTime.local().diff(message.created);
      return messageAge.as("seconds") > MESSAGE_MINIMUM_DURATION;
    });
    if (expiredMessages.length > 0) {
      const remainingMessages = messages.filter(
        ({ id }) =>
          undefined === expiredMessages.find((message) => message.id === id)
      );
      setMessages(remainingMessages);
    }
  };

  const value = {
    messages,
    setMessage,
    dismissMessage,
    dismissMessagesByTag,
    expireMessages,
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};

export { MessagesProvider };
