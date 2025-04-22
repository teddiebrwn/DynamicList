"use client";
import { Plus } from "lucide-react";
import { restrictToParentElement } from "@dnd-kit/modifiers";

type Task = {
  id: string;
  title: string;
  done: boolean;
};

import { useReducer, useEffect, useRef, useState } from "react";
import { reducer, State } from "./reducer";

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableItem } from "./SortableItem";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  const [state, dispatch] = useReducer(reducer, {
    tasks: [],
    input: "",
    isEditing: null,
    editInput: "",
  } as State);

  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        dispatch({ type: "CANCEL_EDIT" }); // clear isEditing + editInput
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_INPUT", payload: e.target.value });
  };

  const handleAddTask = () => {
    dispatch({ type: "ADD_TASK" });
  };

  const toggleTask = (id: string) => {
    dispatch({ type: "TOGGLE_TASK", payload: id });
  };

  const startEdit = (task: Task) => {
    dispatch({ type: "START_EDIT", payload: task });
  };

  const saveEdit = () => {
    if (typeof state.isEditing === "string") {
      dispatch({ type: "SAVE_EDIT", payload: state.isEditing });
    }
  };

  const deleteTask = (id: string) => {
    dispatch({ type: "DELETE_TASK", payload: id });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = state.tasks.findIndex((task) => task.id === active.id);
    const newIndex = state.tasks.findIndex((task) => task.id === over.id);

    const newTasks = arrayMove(state.tasks, oldIndex, newIndex);
    dispatch({ type: "REORDER_TASKS", payload: newTasks });
  };

  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        dispatch({ type: "LOAD_TASKS", payload: parsed });
      } catch {
        console.error("Failed to load tasks from localStorage");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
  }, [state.tasks]);

  return (
    <div className="relative min-h-screen w-full bg-neutral-950">
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-10"
        style={{
          backgroundImage: "url('/noise.png')",
        }}
      />
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-between px-4 py-1.5 bg-black/80 border border-neutral-700 rounded-2xl shadow-2xl transition-all duration-300 cursor-pointer select-none min-w-[180px] max-w-xs backdrop-blur-md hover:scale-105 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] active:scale-95
          ${
            isOpen
              ? "pointer-events-none"
              : "pointer-events-auto animate-[dynamicIslandOpen_400ms_cubic-bezier(0.4,0,0.2,1)] opacity-100 scale-100"
          }
          ${
            isOpen
              ? "opacity-0 scale-95 animate-[dynamicIslandClose_300ms_cubic-bezier(0.4,0,0.2,1)]"
              : ""
          }
        `}
        onClick={() => setIsOpen(true)}
      >
        <h2 className="text-base font-semibold tracking-tight text-white">
          Todo List
        </h2>
        <span className="bg-blue-400/90 text-xs font-bold text-neutral-900 rounded-lg px-2 py-0.5 ml-2 shadow">
          {state.tasks.length}
        </span>
      </div>
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs bg-black/80 border border-neutral-700 rounded-2xl shadow-2xl p-4 transition-all duration-300 ease-in-out transform backdrop-blur-md
          ${
            isOpen
              ? "animate-[dynamicIslandOpen_400ms_cubic-bezier(0.4,0,0.2,1)] opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none animate-[dynamicIslandClose_300ms_cubic-bezier(0.4,0,0.2,1)]"
          }
        `}
        ref={wrapperRef}
      >
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={state.input}
            onChange={handleInput}
            placeholder="Add a new task"
            className="flex-1 px-2 h-8 border border-neutral-700 rounded bg-neutral-900/80 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white-400/60 transition shadow-inner text-sm"
          />
          <button
            onClick={handleAddTask}
            className="w-8 h-8 flex items-center justify-center rounded bg-blue-400 text-neutral-900 font-bold hover:bg-blue-300 active:scale-95 transition shadow"
          >
            <Plus width={16} height={16} />
          </button>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement]}
        >
          <SortableContext
            items={state.tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-3">
              {state.tasks.map((task) => (
                <SortableItem
                  key={task.id}
                  id={task.id}
                  task={task}
                  isEditing={state.isEditing}
                  editInput={state.editInput}
                  dispatch={dispatch}
                  toggleTask={toggleTask}
                  startEdit={startEdit}
                  deleteTask={deleteTask}
                  saveEdit={saveEdit}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
