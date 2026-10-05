import { useTodos } from '@/hooks'
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
    isUpdatingTodoStatus,
    updateTodoStatus,
    isUpdatingTodo,
    updateTodo,
    isDeletingTodo,
    deleteTodo,
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
        isUpdatingTodoStatus={isUpdatingTodoStatus}
        onTodoStatusChange={updateTodoStatus}
        isUpdatingTodo={isUpdatingTodo}
        onUpdateTodo={updateTodo}
        isDeletingTodo={isDeletingTodo}
        onDeleteTodo={deleteTodo}
      />
    </main>
  )
}

export default App
