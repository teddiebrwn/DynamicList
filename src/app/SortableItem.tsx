"use client";

import React from "react";
import { useSortable, defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, Action } from "./reducer";
import { Dispatch, memo, useCallback, useRef } from "react";
import { Check, X, Pencil } from "lucide-react";

type Props = {
  id: string;
  task: Task;
  isEditing: string | null;
  editInput: string;
  dispatch: Dispatch<Action>;
  toggleTask: (id: string) => void;
  startEdit: (task: Task) => void;
  deleteTask: (id: string) => void;
  saveEdit: () => void;
  overId: string | null;
  activeId: string | null;
};

export const SortableItem = memo(function SortableItem({
  id,
  task,
  isEditing,
  editInput,
  dispatch,
  toggleTask,
  startEdit,
  deleteTask,
  saveEdit,
  overId,
  activeId,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    transition,
  } = useSortable({ id, animateLayoutChanges: defaultAnimateLayoutChanges });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition:
      !isDragging && transition
        ? transition.replace(/\d+ms/, "300ms")
        : undefined,
  };
  const isOver = overId === id && activeId !== id;
  const inputRef = useRef<HTMLInputElement>(null);
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: "SET_EDIT_INPUT", payload: e.target.value });
    },
    [dispatch]
  );
  const handleSaveEdit = useCallback(() => {
    saveEdit();
  }, [saveEdit]);
  const handleToggleTask = useCallback(() => {
    toggleTask(task.id);
  }, [toggleTask, task.id]);
  const handleStartEdit = useCallback(() => {
    startEdit(task);
  }, [startEdit, task]);
  const handleDeleteTask = useCallback(() => {
    deleteTask(task.id);
  }, [deleteTask, task.id]);
  return (
    <li
      className={`flex items-center w-full  gap-2 px-1 py-1 rounded-lg shadow-[0_2px_8px_0_rgba(0,0,0,0.10)] hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.14)] duration-150 group backdrop-blur text-white/90 text-sm min-h-[32px] relative${
        isDragging ? " z-20 bg-neutral-800/80 scale-105" : ""
      }`}
      ref={setNodeRef}
      style={style}
    >
      {isDragging && (
        <>
          <div className="absolute -inset-1 rounded-xl border border-white/20 pointer-events-none animate-gradient-border" />
        </>
      )}
      {isOver && (
        <div className="absolute left-0 right-0 bottom-0 h-1.5 rounded-b shimmer-bg animate-shimmer" />
      )}
      <span
        className={`w-6 h-full border-r border-dashed  border-neutral-600 rounded-tl-lg rounded-bl-lg cursor-grab select-none flex items-center${
          isEditing === task.id ? " hidden" : " mr-1"
        }`}
        aria-label="drag"
        style={{ touchAction: "pan-y" }}
        {...(isEditing === task.id ? {} : { ...attributes, ...listeners })}
      >
        &#8203;
      </span>
      {isEditing === task.id ? (
        <>
          <input
            ref={inputRef}
            placeholder="Edit task"
            value={editInput}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveEdit();
            }}
            autoFocus
            className="w-full px-2 h-8 ml-0 border text-sm font-light border-neutral-700 rounded bg-neutral-900/80 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white-400/60 transition shadow-inner"
            style={{ fontSize: "16px" }}
          />
          <div
            className={`flex flex-row items-center gap-0 ml-1 bg-neutral-900/80 rounded px-1 py-0.5 ${
              typeof window !== "undefined" && window.innerWidth <= 600
                ? "border-0"
                : "border border-neutral-500"
            }`}
          >
            <button
              onClick={handleSaveEdit}
              aria-label="save"
              className={`w-6 h-6 flex items-center justify-center rounded-none bg-transparent hover:text-white active:scale-95 transition cursor-pointer ${
                typeof window !== "undefined" && window.innerWidth <= 600
                  ? "text-neutral-400 border-0"
                  : "text-neutral-800"
              }`}
            >
              <Check width={14} height={14} />
            </button>
          </div>
        </>
      ) : (
        <>
          <span
            onClick={handleToggleTask}
            className={`flex-1 cursor-pointer select-none font-medium transition-all duration-600 ${
              task.done ? "line-through text-neutral-600" : "text-white/90"
            }`}
          >
            {task.title}
          </span>
          <div
            className={`flex flex-row items-center gap-0 ml-1 bg-neutral-900/80 rounded px-1 py-0.5 group ${
              typeof window !== "undefined" && window.innerWidth <= 600
                ? "border-0"
                : "border border-neutral-500 hover:border-white focus-within:border-white"
            }`}
          >
            <button
              onClick={handleStartEdit}
              aria-label="edit"
              className={`w-6 h-6 flex items-center justify-center rounded-none bg-transparent hover:text-white active:scale-95 transition cursor-pointer group-hover/button-group:text-white group-focus/button-group:text-white ${
                typeof window !== "undefined" && window.innerWidth <= 600
                  ? "text-neutral-400"
                  : "text-neutral-800"
              }`}
            >
              <Pencil width={14} height={14} />
            </button>
            <div className="h-4 w-px bg-neutral-600 mx-0.5" />
            <button
              onClick={handleDeleteTask}
              aria-label="delete"
              className={`w-6 h-6 flex items-center justify-center rounded-none bg-transparent hover:text-white active:scale-95 transition cursor-pointer group-hover/button-group:text-white group-focus/button-group:text-white ${
                typeof window !== "undefined" && window.innerWidth <= 600
                  ? "text-neutral-400"
                  : "text-neutral-800"
              }`}
            >
              <X width={14} height={14} />
            </button>
          </div>
        </>
      )}
    </li>
  );
});
