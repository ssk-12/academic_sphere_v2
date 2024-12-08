'use client'

import { useRef } from 'react'
import { addTodo } from '@/actions/actions'

export default function AddTodo() {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addTodo(formData)
        formRef.current?.reset()
      }}
      className="flex mb-4"
    >
      <input
        type="text"
        name="title"
        placeholder="Add a new todo..."
        className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add
      </button>
    </form>
  )
}

