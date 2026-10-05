import { useEffect, useRef, useState } from 'react'

export interface DropdownOption<T extends string> {
  value: T
  label: string
}

interface DropdownProps<T extends string> {
  options: readonly DropdownOption<T>[]
  value: T
  onChange: (value: T) => void
  ariaLabel: string
}

export function Dropdown<T extends string>({ options, value, onChange, ariaLabel }: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const selectedOption = options.find((option) => option.value === value) ?? options[0]

  useEffect(() => {
    if (!isOpen) return

    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) setIsOpen(false)
    }

    document.addEventListener('pointerdown', handleOutsidePointerDown)
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    menuRef.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus()
  }, [isOpen])

  const focusOption = (index: number) => {
    const optionButtons = menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]')
    optionButtons?.[index]?.focus()
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-500 shadow-sm transition hover:border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-100"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="font-medium">Sort</span>
        <span className="font-medium text-stone-700">{selectedOption?.label}</span>
        <svg className={`size-3 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m7 10 5 5 5-5" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 z-20 mt-2 min-w-52 overflow-hidden rounded-xl border border-stone-200 bg-white p-1.5 shadow-lg shadow-stone-900/10"
          role="listbox"
          aria-label={ariaLabel}
          onKeyDown={(event) => {
            const currentIndex = options.findIndex((option) => option.value === value)
            const optionButtons = menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]')
            const focusedIndex = optionButtons
              ? Array.from(optionButtons).indexOf(document.activeElement as HTMLButtonElement)
              : -1
            const activeIndex = focusedIndex >= 0 ? focusedIndex : currentIndex

            if (event.key === 'Escape') {
              event.preventDefault()
              setIsOpen(false)
            } else if (event.key === 'ArrowDown') {
              event.preventDefault()
              focusOption((activeIndex + 1) % options.length)
            } else if (event.key === 'ArrowUp') {
              event.preventDefault()
              focusOption((activeIndex - 1 + options.length) % options.length)
            } else if (event.key === 'Home') {
              event.preventDefault()
              focusOption(0)
            } else if (event.key === 'End') {
              event.preventDefault()
              focusOption(options.length - 1)
            }
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === value

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition duration-150 hover:-translate-y-0.5 hover:shadow-sm ${
                  isSelected ? 'bg-stone-100 font-medium text-stone-900' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
              >
                {option.label}
                {isSelected && <span aria-hidden="true">✓</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
