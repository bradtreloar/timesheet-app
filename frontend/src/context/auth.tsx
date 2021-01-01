import React, { useContext, createContext } from "react";
import { User } from "types";
import * as datastore from "services/datastore";
import { isEqual } from "lodash";

type Status = "idle" | "pending" | "fulfilled" | "rejected";

interface AuthContextState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  setPassword: (password: string) => Promise<void>;
  resetPassword: (email: string, token: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

/**
 * Custom hook. Returns the auth context. Only works inside components wrapped
 * by AuthProvider.
 */
export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (authContext === undefined) {
    throw new Error("AuthContext is undefined");
  }
  return authContext;
};

const AuthProvider: React.FC = ({ children }) => {
  // Rehydrate the user value from local storage.
  const storedUserData = localStorage.getItem("user");
  const initialUser: User | null = storedUserData
    ? JSON.parse(storedUserData)
    : null;
  const [isStale, setIsStale] = React.useState(true);
  const [user, setUser] = React.useState(initialUser);
  const isAuthenticated = user !== null;
  const isAdmin = user !== null && user.isAdmin;

  /**
   * Persist the user's information.
   */
  React.useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  /**
   * Authenticates the user.
   *
   * @param email
   * @param password
   */
  const login = async (email: string, password: string) => {
    try {
      const user = await datastore.login(email, password);
      setUser(user);
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 422) {
          throw new Error(`Unrecognized email or password.`);
        } else if (status === 403) {
          setIsStale(true);
          throw new Error(`User is already logged in.`);
        } else {
          console.error(error);
          throw new Error(`Unable to log in. An error has occurred.`);
        }
      } else {
        throw error;
      }
    }
  };

  /**
   * Revokes the user's authentication.
   */
  const logout = async () => {
    try {
      await datastore.logout();
      setUser(null);
    } catch (error) {
      if (error.response?.status === 403) {
        setIsStale(true);
      }
    }
  };

  /**
   * Requests a password reset.
   */
  const forgotPassword = async (email: string) => {
    try {
      await datastore.forgotPassword(email);
    } catch (error) {
      if (error.response?.status === 422) {
        throw new Error(`Unable to find a user with that email address.`);
      }
      if (error.response?.status === 429) {
        throw new Error(`Too many requests.`);
      }
      throw new Error(`Unable to request password reset.`);
    }
  };

  /**
   * Sets a new password.
   */
  const setPassword = async (password: string) => {
    try {
      await datastore.setPassword(password);
    } catch (error) {
      throw new Error(`Unable to set password.`);
    }
  };

  /**
   * Sets a new password using a token.
   */
  const resetPassword = async (email: string, token: string, password: string) => {
    try {
      await datastore.resetPassword(email, token, password);
    } catch (error) {
      throw new Error(`Unable to reset password.`);
    }
  };

  /**
   * Refreshes the user from the server.
   */
  React.useEffect(() => {
    if (isStale) {
      (async () => {
        const currentUser = await datastore.fetchCurrentUser();
        // Update the user if the logged in user differs from the stored user.
        if (!isEqual(user, currentUser)) {
          setUser(currentUser);
        }
        setIsStale(false);
      })();
    }
  }, [isStale, user]);

  const value = {
    isAuthenticated,
    isAdmin,
    user,
    login,
    logout,
    forgotPassword,
    setPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
