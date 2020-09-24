import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useAuth } from "./context/auth";
import LoginForm from "./components/LoginForm";

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
      <p>You must sign in to continue.</p>
      <LoginForm
        onSubmit={async (email, password) => {
          await login(email, password);
        }}
      />
    </div>
  );
}

export default App;
