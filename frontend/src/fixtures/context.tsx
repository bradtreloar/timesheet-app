import React from "react";
import { AuthProvider } from "context/auth";
import { MessagesProvider } from "context/messages";

export const ProvidersFixture: React.FC = ({ children }) => (
  <AuthProvider>
    <MessagesProvider>{children}</MessagesProvider>
  </AuthProvider>
);
