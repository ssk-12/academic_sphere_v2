"use client";``
import { toggleTodo, deleteTodo } from '@/actions/actions'

type Todo = {
  id: string;
  title: string;
  completed: boolean;
}

export default function TodoList({ initialTodos : todos }: { initialTodos: Todo[] }) {
  

  return (
    <ul className="space-y-4">
      {todos.map((todo) => (
        <li key={todo.id} className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={async () => {
              await toggleTodo(todo.id, !todo.completed)
            }}
            className="h-6 w-6"
          />
          <span className={todo.completed ? 'line-through text-gray-500' : ''}>
            {todo.title}
          </span>
          <button
            onClick={async () => {
              await deleteTodo(todo.id)
              
            }}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}

