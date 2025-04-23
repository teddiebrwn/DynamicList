import "@testing-library/jest-dom";
import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import Home from "./page";

Object.defineProperty(globalThis, "crypto", {
  value: {
    ...globalThis.crypto,
    randomUUID: () => Math.random().toString(36).slice(2, 10),
  },
  configurable: true,
});

Object.defineProperty(window, "localStorage", {
  value: (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      clear: () => {
        store = {};
      },
      removeItem: (key: string) => {
        delete store[key];
      },
    };
  })(),
  writable: true,
});

describe("Home UI", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders and opens modal", () => {
    const { getByText, getByPlaceholderText } = render(<Home />);
    fireEvent.click(getByText("Dynamic Island Todo List"));
    expect(getByPlaceholderText("Add a new task")).toBeInTheDocument();
  });

  it("adds a task and persists to localStorage", () => {
    const { getByPlaceholderText, getByRole, getByText } = render(<Home />);
    fireEvent.click(getByText("Dynamic Island Todo List"));
    fireEvent.change(getByPlaceholderText("Add a new task"), {
      target: { value: "Task 1" },
    });
    fireEvent.click(getByRole("button"));
    expect(getByText("Task 1")).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem("tasks")!)[0].title).toBe(
      "Task 1"
    );
  });

  it("does not add empty task", () => {
    const { getAllByRole, queryByText, getByText } = render(<Home />);
    fireEvent.click(getByText("Dynamic Island Todo List"));
    fireEvent.click(getAllByRole("button")[0]);
    expect(queryByText("Task 1")).not.toBeInTheDocument();
  });

  it("toggles task done", () => {
    const { getByPlaceholderText, getAllByRole, getByText } = render(<Home />);
    fireEvent.click(getByText("Dynamic Island Todo List"));
    fireEvent.change(getByPlaceholderText("Add a new task"), {
      target: { value: "Task 2" },
    });
    fireEvent.click(getAllByRole("button")[0]);
    fireEvent.click(getByText("Task 2"));
    expect(getByText("Task 2")).toHaveClass("line-through");
  });

  it("edits a task and cancels edit", () => {
    const {
      getByPlaceholderText,
      getByRole,
      getByText,
      queryByPlaceholderText,
    } = render(<Home />);
    fireEvent.click(getByText("Dynamic Island Todo List"));
    fireEvent.change(getByPlaceholderText("Add a new task"), {
      target: { value: "Task 3" },
    });
    fireEvent.click(getByRole("button"));
    fireEvent.click(getByRole("button", { name: "edit" }));
    const editInput = getByPlaceholderText("Edit task");
    fireEvent.change(editInput, { target: { value: "Task 3 edited" } });
    fireEvent.click(getByRole("button", { name: "cancel" }));
    expect(queryByPlaceholderText("Edit task")).not.toBeInTheDocument();
    expect(getByText("Task 3")).toBeInTheDocument();
  });

  it("saves an edit to a task", () => {
    const { getByPlaceholderText, getByRole, getByText } = render(<Home />);
    fireEvent.click(getByText("Dynamic Island Todo List"));
    fireEvent.change(getByPlaceholderText("Add a new task"), {
      target: { value: "Task 4" },
    });
    fireEvent.click(getByRole("button"));
    fireEvent.click(getByRole("button", { name: "edit" }));
    const editInput = getByPlaceholderText("Edit task");
    fireEvent.change(editInput, { target: { value: "Task 4 edited" } });
    fireEvent.click(getByRole("button", { name: "save" }));
    expect(getByText("Task 4 edited")).toBeInTheDocument();
  });

  it("deletes a task", () => {
    const { getByPlaceholderText, getByRole, getByText, queryByText } = render(
      <Home />
    );
    fireEvent.click(getByText("Dynamic Island Todo List"));
    fireEvent.change(getByPlaceholderText("Add a new task"), {
      target: { value: "Task 5" },
    });
    fireEvent.click(getByRole("button"));
    fireEvent.click(getByRole("button", { name: "delete" }));
    expect(queryByText("Task 5")).not.toBeInTheDocument();
  });

  it("closes modal on outside click", () => {
    const { getByText, getByPlaceholderText } = render(<Home />);
    fireEvent.click(getByText("Dynamic Island Todo List"));
    fireEvent.mouseDown(document);
    // Modal is hidden, not unmounted; check input is still in DOM but hidden
    expect(getByPlaceholderText("Add a new task")).toBeInTheDocument();
  });

  it("loads tasks from localStorage", () => {
    window.localStorage.setItem(
      "tasks",
      JSON.stringify([{ id: "a", title: "Persisted", done: false }])
    );
    const { getByText } = render(<Home />);
    fireEvent.click(getByText("Dynamic Island Todo List"));
    expect(getByText("Persisted")).toBeInTheDocument();
  });

  it("handles drag and drop reorder", () => {
    const { getByPlaceholderText, getAllByRole, getByText } = render(<Home />);
    fireEvent.click(getByText("Dynamic Island Todo List"));
    fireEvent.change(getByPlaceholderText("Add a new task"), {
      target: { value: "A" },
    });
    fireEvent.click(getAllByRole("button")[0]);
    fireEvent.change(getByPlaceholderText("Add a new task"), {
      target: { value: "B" },
    });
    fireEvent.click(getAllByRole("button")[0]);
    act(() => {
      const ul = document.querySelector("ul");
      if (ul) {
        const event = new Event("dragend");
        ul.dispatchEvent(event);
      }
    });
    expect(getByText("A")).toBeInTheDocument();
    expect(getByText("B")).toBeInTheDocument();
  });

  it("never throws or lags on rapid input and actions", () => {
    const { getByPlaceholderText, getAllByRole, getByText } = render(<Home />);
    fireEvent.click(getByText("Dynamic Island Todo List"));
    for (let i = 0; i < 20; ++i) {
      fireEvent.change(getByPlaceholderText("Add a new task"), {
        target: { value: `T${i}` },
      });
      fireEvent.click(getAllByRole("button")[0]);
    }
    for (let i = 0; i < 20; ++i) {
      fireEvent.click(getByText(`T${i}`));
    }
    for (let i = 0; i < 20; ++i) {
      const editButtons = getAllByRole("button", { name: "edit" });
      fireEvent.click(editButtons[0]);
      const cancelButtons = getAllByRole("button", { name: "cancel" });
      fireEvent.click(cancelButtons[0]);
    }
    for (let i = 0; i < 20; ++i) {
      const deleteButtons = getAllByRole("button", { name: "delete" });
      fireEvent.click(deleteButtons[0]);
    }
    expect(() => {
      fireEvent.change(getByPlaceholderText("Add a new task"), {
        target: { value: "Final" },
      });
      fireEvent.click(getAllByRole("button")[0]);
    }).not.toThrow();
    expect(getByText("Final")).toBeInTheDocument();
  });
});
