"use client";
import { Plus, Loader2 } from "lucide-react";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { AnimatePresence, motion } from "framer-motion";

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
  DragStartEvent,
  DragOverEvent,
  TouchSensor,
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
  const listRef = useRef<HTMLUListElement>(null);
  const [dragState, setDragState] = useState<{
    overId: string | null;
    activeId: string | null;
  }>({ overId: null, activeId: null });

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

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const prevent = (e: TouchEvent) => e.preventDefault();
    el.addEventListener("touchmove", prevent, { passive: false });
    return () => el.removeEventListener("touchmove", prevent);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_INPUT", payload: e.target.value });
  };

  const handleAddTask = () => {
    if (!state.input.trim()) return;
    dispatch({ type: "ADD_TASK", payload: crypto.randomUUID() });
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

  const handleDragStart = (event: DragStartEvent) => {
    setDragState({
      overId: event.active?.id?.toString() ?? null,
      activeId: event.active?.id?.toString() ?? null,
    });
  };

  const handleDragOver = (event: DragOverEvent) => {
    setDragState((prev) => ({
      ...prev,
      overId: event.over?.id?.toString() ?? null,
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDragState({ overId: null, activeId: null });
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 12,
      },
    })
  );

  return (
    <div className="relative min-h-screen w-full bg-neutral-950 p-2">
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-10"
        style={{
          backgroundImage: "url('/noise.png')",
        }}
      />
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-between px-4 py-1.5 bg-black/80 border border-neutral-700 rounded-2xl shadow-2xl transition-all duration-300 cursor-pointer select-none min-w-[140px] w-[80vw] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 backdrop-blur-md hover:scale-105 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] active:scale-95
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
          Dynamic Island Todo List
        </h2>
        <span className="bg-white text-xs font-bold text-neutral-900 rounded-lg px-2 py-0.5 ml-2 shadow">
          {state.tasks.length}
        </span>
      </div>
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 bg-black/80 border border-neutral-700 rounded-2xl shadow-2xl p-4 transition-all duration-300 ease-in-out transform backdrop-blur-md
          ${
            isOpen
              ? "animate-[dynamicIslandOpen_400ms_cubic-bezier(0.4,0,0.2,1)] opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none animate-[dynamicIslandClose_300ms_cubic-bezier(0.4,0,0.2,1)]"
          }
        `}
        ref={wrapperRef}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="flex flex-1">
            <AnimatePresence mode="wait" initial={false}>
              {state.isEditing !== null ? (
                <motion.div
                  key="editing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="flex items-center justify-start w-full h-8 rounded text-white text-sm select-none px-2 border border-transparent bg-transparent"
                >
                  <span className="relative overflow-hidden">
                    <span className="bg-gradient-to-r from-neutral-400 via-white to-neutral-400 bg-[length:200%_100%] bg-clip-text text-transparent animate-[shimmer_2.5s_linear_infinite]">
                      Editing...
                    </span>
                  </span>
                </motion.div>
              ) : (
                <motion.input
                  key="input"
                  type="text"
                  value={state.input}
                  onChange={handleInput}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTask();
                  }}
                  placeholder="Add a new task"
                  className="flex-1 px-2 h-8 border border-neutral-700 rounded bg-neutral-900/80 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white-400/60 transition shadow-inner text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                />
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={handleAddTask}
            className={`w-8 h-8 flex items-center justify-center rounded font-bold transition shadow ${
              state.isEditing !== null
                ? "bg-transparent border border-transparent cursor-default"
                : "bg-white text-neutral-900 hover:bg-white-300 active:scale-95"
            }`}
            disabled={state.isEditing !== null}
          >
            {state.isEditing !== null ? (
              <Loader2
                className="w-5 h-5 animate-spin text-neutral-400"
                strokeWidth={2.2}
              />
            ) : (
              <Plus width={16} height={16} />
            )}
          </button>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement, restrictToVerticalAxis]}
        >
          <SortableContext
            items={state.tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div>
              <ul className="flex flex-col space-y-3" ref={listRef}>
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
                    overId={dragState.overId}
                    activeId={dragState.activeId}
                  />
                ))}
              </ul>
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
