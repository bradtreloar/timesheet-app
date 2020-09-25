import React, { useContext, createContext } from "react";
import { User } from "../types";
import * as datastore from "../services/datastore";

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
    throw "AuthContext is undefined";
  }
  return authContext;
};

const AuthProvider: React.FC = ({ children }) => {
  // Hydrate the user value from session storage.
  const initialUser: User | null = JSON.parse(
    (window as any).sessionStorage.getItem("user")
  );
  const [user, setUser] = React.useState(initialUser);
  const [error, setError] = React.useState<string | null>(null);
  const isAuthenticated = user !== null;
  const isAdmin = user !== null && user.isAdmin;

  /**
   * Persist the user's information.
   */
  React.useEffect(() => {
    (window as any).sessionStorage.setItem("user", JSON.stringify(user));
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
      setError(error);
      return;
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
      setError(error);
    }
  };

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
