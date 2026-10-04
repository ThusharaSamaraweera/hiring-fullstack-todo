import { useTodos } from '@/hooks/useTodos'
import { HeroSection } from '@/sections/dashboard/HeroSection'
import { TodoForm } from '@/sections/todos/TodoForm'
import { TodoListSection } from '@/sections/todos/TodoListSection'

function App() {
  const { createTodo, isCreatingTodo, todosPage, isLoadingTodos, hasTodoLoadError } = useTodos()

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10 sm:px-8 sm:py-16">
      <HeroSection />
      <TodoForm isCreatingTodo={isCreatingTodo} onCreateTodo={createTodo} />
      <TodoListSection
        todosPage={todosPage}
        isLoadingTodos={isLoadingTodos}
        hasTodoLoadError={hasTodoLoadError}
      />
    </main>
  )
}

export default App
