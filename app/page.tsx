// import { getTodos } from '../actions/actions'
// import TodoList from '@/components/TodoList'
// import AddTodo from '@/components/AddTodo'


export default async function Home() {
  // const todos: { id: string; title: string; completed: boolean }[] = await getTodos()

  return (
    <main className="max-w-4xl mx-auto mt-4">
      {/* <Navbar /> */}
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      {/* <AddTodo />
      <TodoList initialTodos={todos} /> */}
      {/* <ul className="space-y-4">
      {todos.map((todo: { id: string; title: string; completed: boolean }) => (
        <li key={todo.id} className="flex items-center space-x-4">
          <input
           
            
            className="h-6 w-6"
          />
          <span className={todo.completed ? 'line-through text-gray-500' : ''}>
            {todo.title}
          </span>
          
        </li>
      ))}
    </ul> */}
    </main>
  )
}

