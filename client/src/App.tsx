import { HeroSection } from '@/sections/dashboard/HeroSection'
import { TodoForm } from '@/sections/todos/TodoForm'

function App() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10 sm:px-8 sm:py-16">
      <HeroSection />
      <TodoForm />
    </main>
  )
}

export default App
