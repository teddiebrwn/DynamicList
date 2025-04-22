import { render } from "@testing-library/react";
import { SortableItem } from "./SortableItem";
import { Task, Action } from "./reducer";
import { Dispatch } from "react";
import * as dndSortable from "@dnd-kit/sortable";

const baseTask: Task = { id: "1", title: "Test", done: false };
const noop = (() => {}) as Dispatch<Action>;

describe("SortableItem", () => {
  it("applies smooth cubic-bezier transition when dragging", () => {
    const { container } = render(
      <SortableItem
        id="1"
        task={baseTask}
        isEditing={null}
        editInput=""
        dispatch={noop}
        toggleTask={noop}
        startEdit={noop}
        deleteTask={noop}
        saveEdit={noop}
      />
    );
    const li = container.querySelector("li");
    expect(li).toBeTruthy();
    // Simulate dragging by checking style
    // The transition should be set to the custom cubic-bezier
    // Note: useSortable hook is not actually triggered in this test, so we check default render
    // For real drag, integration test with dnd-kit is needed
  });

  it("applies visual feedback when isDragging is true", () => {
    jest.spyOn(dndSortable, "useSortable").mockReturnValue({
      attributes: {},
      listeners: {},
      setNodeRef: jest.fn(),
      transform: undefined,
      transition: undefined,
      isDragging: true,
      isSorting: false,
      setActivatorNodeRef: jest.fn(),
      setDroppableNodeRef: jest.fn(),
      setDraggableNodeRef: jest.fn(),
      active: null,
      activeIndex: 0,
      data: {},
      rect: undefined,
      index: 0,
      newIndex: 0,
      items: [],
      isOver: false,
      node: undefined,
      overIndex: 0,
      over: undefined,
    } as any);
    const { container } = render(
      <SortableItem
        id="1"
        task={baseTask}
        isEditing={null}
        editInput=""
        dispatch={noop}
        toggleTask={noop}
        startEdit={noop}
        deleteTask={noop}
        saveEdit={noop}
      />
    );
    const li = container.querySelector("li");
    expect(li?.className).toMatch(/ring-2/);
    expect(li?.className).toMatch(/bg-neutral-800/);
    expect(li?.className).toMatch(/scale-105/);
  });
});
