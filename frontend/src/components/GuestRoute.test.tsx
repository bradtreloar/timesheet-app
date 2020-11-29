import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";
import { AuthProvider } from "../context/auth";
import GuestRoute from "./GuestRoute";
import { randomUser } from "../fixtures/random";
import { client } from "../services/datastore";
import MockAdapter from "axios-mock-adapter";

// Mock the HTTP client used by the datastore.
const mockClient = new MockAdapter(client);

const Fixture = () => (
  <AuthProvider>
    <MemoryRouter initialEntries={["/login"]}>
      <GuestRoute exact path="/login">
        user is not authenticated
      </GuestRoute>
      <Route exact path="/">
        user is authenticated
      </Route>
    </MemoryRouter>
  </AuthProvider>
);

afterEach(() => {
  window.localStorage.clear();
});

test("renders guest route when not authenticated", async () => {
  mockClient.onGet("/api/user").reply(204);

  await act(async () => {
    render(<Fixture />);
  });

  screen.getByText(/user is not authenticated/i);
});

test("redirects to / when authenticated", async () => {
  const mockUser = randomUser();
  mockClient.onGet("/api/user").reply(200, mockUser);
  localStorage.setItem("user", JSON.stringify(mockUser));

  await act(async () => {
    render(<Fixture />);
  });

  screen.getByText(/user is authenticated/i);
});
