import React, { useContext, createContext } from "react";
import { User } from "../types";
import * as datastore from "../services/datastore";
import { isEqual } from "lodash";

type Status = "idle" | "pending" | "fulfilled" | "rejected";

interface AuthContextState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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
  const [error, setError] = React.useState<string | null>(null);
  const isAuthenticated = user !== null;
  const isAdmin = user !== null && user.isAdmin;

  /**
   * Persist the user's information.
   */
  React.useEffect(() => {
    (window as any).localStorage.setItem("user", JSON.stringify(user));
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
      setError(null);
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 422) {
          setError("Unrecognized email or password.");
          return;
        }
        if (status === 403) {
          setIsStale(true);
          return;
        }
        setError("Unable to log in. An error has occurred");
        console.error(error);
        return;
      }
      setError(error);
    }
  };

  /**
   * Revokes the user's authentication.
   */
  const logout = async () => {
    try {
      await datastore.logout();
      setUser(null);
      setError(null);
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 403) {
          setIsStale(true);
          return;
        }
      }
      setError(error);
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
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
