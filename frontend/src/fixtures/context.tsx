import React from "react";
import { AuthProvider, useAuth } from "context/auth";
import { MessagesProvider } from "context/messages";

/**
 * Doesn't render anything until user is initialised.
 */
export const AuthFixture: React.FC = ({ children }) => {
  const { userInitialised, user } = useAuth();

  return userInitialised ? <>{children}</> : null;
};

export const ProvidersFixture: React.FC = ({ children }) => (
  <AuthProvider>
    <MessagesProvider>
      <AuthFixture>
        {children}
      </AuthFixture>
    </MessagesProvider>
  </AuthProvider>
);
