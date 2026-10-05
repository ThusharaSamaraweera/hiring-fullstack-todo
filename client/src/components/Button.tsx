import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'ghost' | 'outline' | 'danger' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  className?: string
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'cursor-pointer rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50',
  ghost:
    'min-h-8 cursor-pointer rounded-md px-2 py-1.5 text-xs text-stone-500 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-50',
  outline:
    'cursor-pointer rounded-md border border-stone-200 px-2 py-1 text-xs text-stone-600 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40',
  danger:
    'min-h-8 cursor-pointer rounded-md px-2 py-1.5 text-xs text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50',
  icon: 'grid size-5 shrink-0 cursor-pointer place-items-center rounded-md border text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`${variants[variant]} ${className}`}
      {...props}
    />
  )
}
