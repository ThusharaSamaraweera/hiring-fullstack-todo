import { useTodos } from '@/hooks/useTodos'
import { HeroSection } from '@/sections/dashboard/HeroSection'
import { TodoForm } from '@/sections/todos/TodoForm'
import { TodoListSection } from '@/sections/todos/TodoListSection'
import { TodoStatusTabs } from '@/sections/todos/TodoStatusTabs'
import { TodoToolbar } from '@/sections/todos/TodoToolbar'

function App() {
  const {
    createTodo,
    isCreatingTodo,
    todoQuery,
    setTodoQuery,
    todosPage,
    isLoadingTodos,
    isFetchingTodos,
    hasTodoLoadError,
  } = useTodos()

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10 sm:px-8 sm:py-16">
      <HeroSection />
      <TodoForm isCreatingTodo={isCreatingTodo} onCreateTodo={createTodo} />
      <TodoToolbar todoQuery={todoQuery} onTodoQueryChange={setTodoQuery} />
      <TodoStatusTabs todoQuery={todoQuery} onTodoQueryChange={setTodoQuery} />
      <TodoListSection
        todoQuery={todoQuery}
        todosPage={todosPage}
        isLoadingTodos={isLoadingTodos}
        isFetchingTodos={isFetchingTodos}
        hasTodoLoadError={hasTodoLoadError}
        onTodoQueryChange={setTodoQuery}
      />
    </main>
  )
}

export default App
