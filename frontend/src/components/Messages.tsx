import React from "react";
import { Alert } from "react-bootstrap";
import { useMessages } from "context/messages";

const Messages: React.FC = () => {
  const { messages, dismissMessage } = useMessages();

  return messages.length > 0 ? (
    <div className="container my-3">
      <div>
        {messages.map((message, index) => (
          <Alert
            key={index}
            variant={message.type}
            dismissible
            onClose={() => dismissMessage(message)}
          >
            {message.value}
          </Alert>
        ))}
      </div>
    </div>
  ) : null;
};

export default Messages;
