import "@testing-library/jest-dom";
Object.defineProperty(globalThis, "crypto", {
  value: {
    ...globalThis.crypto,
    randomUUID: () => Math.random().toString(36).slice(2, 10),
  },
  configurable: true,
});
import React from "react";
import { render } from "@testing-library/react";
import RootLayout from "./layout";

jest.mock("next/font/google", () => ({
  Geist: () => ({ variable: "" }),
  Geist_Mono: () => ({ variable: "" }),
}));

describe("RootLayout", () => {
  it("renders any valid ReactNode", () => {
    const { getByText } = render(
      <RootLayout>
        <div>test node</div>
      </RootLayout>
    );
    expect(getByText("test node")).toBeInTheDocument();
  });
});
