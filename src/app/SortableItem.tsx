"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, Action } from "./reducer";
import { Dispatch } from "react";
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
};

export function SortableItem({
  id,
  task,
  isEditing,
  editInput,
  dispatch,
  toggleTask,
  startEdit,
  deleteTask,
  saveEdit,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition
      ? "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)"
      : undefined,
  };

  return (
    <li
      className={`flex items-center gap-1 py-1 rounded-lg shadow-[0_2px_8px_0_rgba(0,0,0,0.10)] hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.14)] transition-all duration-200 group backdrop-blur text-white/90 text-sm min-h-[32px] ${
        isEditing === task.id ? "" : "px-1"
      }${
        isDragging
          ? " z-20 ring-2 ring-blue-400 bg-neutral-800/90 scale-105"
          : ""
      }`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {isEditing === task.id ? (
        <>
          <input
            placeholder="Edit task"
            value={editInput}
            onChange={(e) =>
              dispatch({ type: "SET_EDIT_INPUT", payload: e.target.value })
            }
            autoFocus
            className="flex-1 px-2 py-1 border border-neutral-800 rounded bg-neutral-900/80 text-white/90 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-700/60 transition shadow-inner text-sm"
          />
          <div className="flex flex-row items-center gap-0 ml-1 bg-neutral-900/80 rounded border border-neutral-800 px-1 py-0.5">
            <button
              onClick={saveEdit}
              className="w-6 h-6 flex items-center justify-center rounded-none bg-transparent text-neutral-300 hover:text-white active:scale-95 transition"
            >
              <Check width={14} height={14} />
            </button>
            <div className="h-4 w-px bg-neutral-800 mx-0.5" />
            <button
              onClick={() => dispatch({ type: "CANCEL_EDIT" })}
              className="w-6 h-6 flex items-center justify-center rounded-none bg-transparent text-neutral-300 hover:text-white active:scale-95 transition"
            >
              <X width={14} height={14} />
            </button>
          </div>
        </>
      ) : (
        <>
          <span
            onClick={() => toggleTask(task.id)}
            className={`flex-1 cursor-pointer select-none font-medium transition-all duration-200 ${
              task.done ? "line-through text-gray-400" : "text-white/90"
            }`}
          >
            {task.title}
          </span>
          <div className="flex flex-row items-center gap-0 ml-1 bg-neutral-900/80 rounded border border-neutral-800 px-1 py-0.5">
            <button
              onClick={() => startEdit(task)}
              className="w-6 h-6 flex items-center justify-center rounded-none bg-transparent text-neutral-300 hover:text-white active:scale-95 transition"
            >
              <Pencil width={14} height={14} />
            </button>
            <div className="h-4 w-px bg-neutral-800 mx-0.5" />
            <button
              onClick={() => deleteTask(task.id)}
              className="w-6 h-6 flex items-center justify-center rounded-none bg-transparent text-neutral-300 hover:text-white active:scale-95 transition"
            >
              <X width={14} height={14} />
            </button>
          </div>
        </>
      )}
    </li>
  );
}
