import { useTodos } from '@/hooks/useTodos'
import { HeroSection } from '@/sections/dashboard/HeroSection'
import { TodoForm } from '@/sections/todos/TodoForm'

function App() {
  const { createTodo, isCreatingTodo } = useTodos()

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10 sm:px-8 sm:py-16">
      <HeroSection />
      <TodoForm isCreatingTodo={isCreatingTodo} onCreateTodo={createTodo} />
    </main>
  )
}

export default App
