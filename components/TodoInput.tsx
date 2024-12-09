"use client";

interface Todo {
  id: string;
  completed: boolean;
}

interface TodoCheckboxProps {
  todo: Todo;
  toggleTodo: (id: string, completed: boolean) => void;
}

export default function TodoCheckbox({ todo, toggleTodo }: TodoCheckboxProps) {
  return (
    <input
      type="checkbox"
      onChange={() => toggleTodo(todo.id, !todo.completed)}
      checked={todo.completed}
      className="h-6 w-6"
    />
  );
}
