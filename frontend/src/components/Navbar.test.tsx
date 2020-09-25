import React from "react";
import { render, act } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "../context/auth";
import { client } from "../services/datastore";
import { getMockPassword, getMockUser } from "../fixtures/mocks";
import Navbar from "./Navbar";
import MockAdapter from "axios-mock-adapter";

// Mock the HTTP client used by the datastore.
const mockClient = new MockAdapter(client);

beforeEach(() => {
  mockClient.onGet("/sanctum/csrf-cookie").reply(204);
});

afterEach(() => {
  mockClient.reset();

  // Clear the stored user object.
  (window as any).sessionStorage.removeItem("user");
});

test("displays Navbar for unauthenticated user", () => {
  render(
    <AuthProvider>
      <Navbar />
    </AuthProvider>
  );

  expect(screen.queryByText(/Log out/)).toBeNull();
});

test("displays Navbar for authenticated user", () => {
  const mockUser = getMockUser();
  const mockPassword = getMockPassword();
  (window as any).sessionStorage.setItem("user", JSON.stringify(mockUser));

  render(
    <AuthProvider>
      <Navbar />
    </AuthProvider>
  );

  screen.getByText(/Log out/);
});

test("logout link successfully logs user out", async () => {
  const mockUser = getMockUser();
  (window as any).sessionStorage.setItem("user", JSON.stringify(mockUser));
  mockClient.onGet("/api/v1/logout").reply(200);

  render(
    <AuthProvider>
      <Navbar />
    </AuthProvider>
  );

  await act(async () => {
    userEvent.click(screen.getByText(/Log out/));
  });
  expect(screen.queryByText(/Log out/)).toBeNull();
});
