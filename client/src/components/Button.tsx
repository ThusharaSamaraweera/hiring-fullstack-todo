import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'ghost' | 'outline'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  className?: string
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50',
  ghost: 'text-xs text-stone-500 hover:text-stone-900 disabled:opacity-50',
  outline:
    'rounded-md border border-stone-200 px-2 py-1 text-xs text-stone-600 hover:bg-stone-50 disabled:opacity-40',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`${variants[variant]} ${className}`}
      {...props}
    />
  )
}
