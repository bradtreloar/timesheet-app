import React, { version } from "react";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import useMeta from "hooks/useMeta";
import { act, render, screen } from "@testing-library/react";

const mockClient = new MockAdapter(axios);

const Fixture: React.FC = () => {
  const { hasNewVersion, isLoadingMeta, version } = useMeta();

  return (
    <>
      <div data-testid="isLoadingMeta">{isLoadingMeta.toString()}</div>
      <div data-testid="hasNewVersion">{hasNewVersion.toString()}</div>
      <div data-testid="version">{version}</div>
    </>
  );
};

const expectMeta = (isLoadingMeta: boolean, hasNewVersion: boolean, version: string) => {
  expect(screen.getByTestId("isLoadingMeta")).toHaveTextContent(isLoadingMeta.toString());
  expect(screen.getByTestId("hasNewVersion")).toHaveTextContent(hasNewVersion.toString());
  expect(screen.getByTestId("version")).toHaveTextContent(version);
}

afterEach(() => {
  localStorage.clear();
  mockClient.reset();
});

test("detects new major version", async () => {
  localStorage.setItem("version", "1.0.0");
  mockClient.onGet("/meta.json").reply(200, {
    version: "2.0.0"
  });

  await act(async () => {
    render(<Fixture />);
  });

  expectMeta(false, true, "1.0.0");
});

test("detects new minor version", async () => {
  localStorage.setItem("version", "1.0.0");
  mockClient.onGet("/meta.json").reply(200, {
    version: "1.1.0"
  });

  await act(async () => {
    render(<Fixture />);
  });

  expectMeta(false, true, "1.0.0");
});

test("detects new patch version", async () => {
  localStorage.setItem("version", "1.0.0");
  mockClient.onGet("/meta.json").reply(200, {
    version: "1.0.1"
  });

  await act(async () => {
    render(<Fixture />);
  });

  expectMeta(false, true, "1.0.0");
});

test("detects same version", async () => {
  localStorage.setItem("version", "1.0.0");
  mockClient.onGet("/meta.json").reply(200, {
    version: "1.0.0"
  });

  await act(async () => {
    render(<Fixture />);
  });

  expectMeta(false, false, "1.0.0");
});

test("detects loading state", async () => {
  localStorage.setItem("version", "1.0.0");
  mockClient.onGet("/meta.json").reply(200, {
    version: "1.0.0"
  });

  await act(async () => {
    render(<Fixture />);
  });

  expectMeta(false, false, "1.0.0");
});
