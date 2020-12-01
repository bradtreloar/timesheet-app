import React from "react";
import { act, render, screen } from "@testing-library/react";
import { AuthProvider } from "context/auth";
import AccessDeniedPage from "./AccessDeniedPage";
import * as datastore from "services/datastore";
import { MemoryRouter } from "react-router";

jest.mock("services/datastore");
jest.spyOn(datastore, "fetchCurrentUser").mockResolvedValue(null);

const Fixture: React.FC = () => {
  return (
    <AuthProvider>
      <MemoryRouter>
        <AccessDeniedPage />
      </MemoryRouter>
    </AuthProvider>
  );
};

test("renders 403 page", async () => {
  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/403/i);
});
