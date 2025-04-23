import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { SortableItem } from "./SortableItem";
import { Task, Action } from "./reducer";
import { Dispatch } from "react";

const baseTask: Task = { id: "1", title: "Test Task", done: false };
const noop = () => {};
const dispatch: Dispatch<Action> = noop as Dispatch<Action>;

describe("SortableItem", () => {
  it("renders task title and toggles done", () => {
    let toggled = "";
    const { getByText } = render(
      <SortableItem
        id={baseTask.id}
        task={baseTask}
        isEditing={null}
        editInput=""
        dispatch={dispatch}
        toggleTask={(id) => (toggled = id)}
        startEdit={noop}
        deleteTask={noop}
        saveEdit={noop}
        overId={null}
        activeId={null}
      />
    );
    fireEvent.click(getByText("Test Task"));
    expect(toggled).toBe("1");
  });

  it("calls startEdit and deleteTask", () => {
    let started = false;
    let deleted = "";
    const { getByRole } = render(
      <SortableItem
        id={baseTask.id}
        task={baseTask}
        isEditing={null}
        editInput=""
        dispatch={dispatch}
        toggleTask={noop}
        startEdit={() => (started = true)}
        deleteTask={(id) => (deleted = id)}
        saveEdit={noop}
        overId={null}
        activeId={null}
      />
    );
    fireEvent.click(getByRole("button", { name: "edit" }));
    expect(started).toBe(true);
    fireEvent.click(getByRole("button", { name: "delete" }));
    expect(deleted).toBe("1");
  });

  it("renders edit mode and handles input, save, cancel", () => {
    let saved = false;
    let cancelled = false;
    let inputValue = "";
    const dispatchMock = (action: Action) => {
      if (action.type === "SET_EDIT_INPUT") inputValue = action.payload;
      if (action.type === "CANCEL_EDIT") cancelled = true;
    };
    const { getByPlaceholderText, getByRole } = render(
      <SortableItem
        id={baseTask.id}
        task={baseTask}
        isEditing={baseTask.id}
        editInput="edit me"
        dispatch={dispatchMock as Dispatch<Action>}
        toggleTask={noop}
        startEdit={noop}
        deleteTask={noop}
        saveEdit={() => (saved = true)}
        overId={null}
        activeId={null}
      />
    );
    const input = getByPlaceholderText("Edit task");
    fireEvent.change(input, { target: { value: "new value" } });
    expect(inputValue).toBe("new value");
    fireEvent.click(getByRole("button", { name: "save" }));
    expect(saved).toBe(true);
    fireEvent.click(getByRole("button", { name: "cancel" }));
    expect(cancelled).toBe(true);
  });

  it("does not crash with null/undefined props", () => {
    expect(() =>
      render(
        <SortableItem
          id={""}
          task={{ id: "", title: "", done: false }}
          isEditing={null}
          editInput={""}
          dispatch={dispatch}
          toggleTask={noop}
          startEdit={noop}
          deleteTask={noop}
          saveEdit={noop}
          overId={null}
          activeId={null}
        />
      )
    ).not.toThrow();
  });
});
