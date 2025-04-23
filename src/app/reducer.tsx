export type Task = {
  id: string;
  title: string;
  done: boolean;
};

export type State = {
  tasks: Task[];
  input: string;
  isEditing: string | null;
  editInput: string;
};

export type Action =
  | { type: "SET_INPUT"; payload: string }
  | { type: "ADD_TASK"; payload: string }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "TOGGLE_TASK"; payload: string }
  | { type: "START_EDIT"; payload: Task }
  | { type: "SAVE_EDIT"; payload: string }
  | { type: "SET_EDIT_INPUT"; payload: string }
  | { type: "CANCEL_EDIT" }
  | { type: "LOAD_TASKS"; payload: Task[] }
  | { type: "REORDER_TASKS"; payload: Task[] };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, input: action.payload };
    case "ADD_TASK":
      if (!state.input.trim() || !action.payload) return state;
      return {
        ...state,
        tasks: [
          {
            id: action.payload,
            title: state.input.trim(),
            done: false,
          },
          ...state.tasks,
        ],
        input: "",
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload ? { ...task, done: !task.done } : task
        ),
      };

    case "START_EDIT":
      return {
        ...state,
        isEditing: action.payload.id,
        editInput: action.payload.title,
      };
    case "SET_EDIT_INPUT":
      return {
        ...state,
        editInput: action.payload,
      };
    case "SAVE_EDIT":
      if (!state.isEditing) return state;

      const currentTask = state.tasks.find((t) => t.id === state.isEditing);
      if (!state.editInput.trim() && currentTask) {
        // Nếu input rỗng → huỷ sửa, giữ nguyên task
        return {
          ...state,
          isEditing: null,
          editInput: "",
        };
      }

      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === state.isEditing
            ? { ...task, title: state.editInput }
            : task
        ),
        isEditing: null,
        editInput: "",
      };
    case "CANCEL_EDIT":
      return {
        ...state,
        isEditing: null,
        editInput: "",
      };

    case "LOAD_TASKS":
      return {
        ...state,
        tasks: action.payload,
      };

    case "REORDER_TASKS":
      return {
        ...state,
        tasks: action.payload,
      };

    default:
      return state;
  }
}
