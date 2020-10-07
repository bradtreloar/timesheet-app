import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";
import randomstring from "randomstring";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "../context/auth";
import { randomUser } from "../fixtures/random";

const Fixture = () => (
  <AuthProvider>
    <MemoryRouter>
      <ProtectedRoute exact path="/">
        user is authenticated
      </ProtectedRoute>
      <Route exact path="/login">
        user is not authenticated
      </Route>
    </MemoryRouter>
  </AuthProvider>
);

afterEach(() => {
  window.localStorage.clear();
});

test("renders protected route when authenticated", async () => {
  const mockUser = randomUser();
  (window as any).localStorage.setItem("user", JSON.stringify(mockUser));
  await act(async () => {
    render(<Fixture />);
  });
  screen.getByText(/user is authenticated/i);
});

test("redirects to /login when not authenticated", async () => {
  await act(async () => {
    render(<Fixture />);
  });
  screen.getByText(/user is not authenticated/i);
});
