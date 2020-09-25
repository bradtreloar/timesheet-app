import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useAuth } from "./context/auth";
import LoginPage from "./pages/LoginPage";

function App() {
  const { isAuthenticated, login, logout } = useAuth();

  return isAuthenticated ? (
    <div>
      <p>You are signed in.</p>
      <a
        onClick={() => {
          logout();
        }}
      >Log out</a>
    </div>
  ) : (
    <div>
      <LoginPage />
    </div>
  );
}

export default App;
