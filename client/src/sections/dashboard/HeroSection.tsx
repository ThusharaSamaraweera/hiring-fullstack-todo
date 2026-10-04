export function HeroSection() {
  return (
    <header className="mb-8 flex items-center justify-between gap-8 border-b border-stone-200 pb-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          My <span className="text-lime-700">tasks</span>
        </h1>
        <p className="mt-2 text-sm text-stone-500">Keep track of what needs to get done.</p>
      </div>

      <img
        src="/hero-illustration.svg"
        alt=""
        aria-hidden="true"
        className="hidden w-32 shrink-0 sm:block"
      />
    </header>
  )
}
