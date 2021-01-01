import React from "react";
import { act, render, screen } from "@testing-library/react";
import AccessDeniedPage from "./AccessDeniedPage";
import * as datastore from "services/datastore";
import { MemoryRouter } from "react-router";
import { ProvidersFixture } from "fixtures/context";

jest.mock("services/datastore");
jest.spyOn(datastore, "fetchCurrentUser").mockResolvedValue(null);

const Fixture: React.FC = () => {
  return (
    <ProvidersFixture>
      <MemoryRouter>
        <AccessDeniedPage />
      </MemoryRouter>
    </ProvidersFixture>
  );
};

test("renders 403 page", async () => {
  await act(async () => {
    render(<Fixture />);
  });

  expect(screen.getByRole("heading")).toHaveTextContent(/403/i);
});
