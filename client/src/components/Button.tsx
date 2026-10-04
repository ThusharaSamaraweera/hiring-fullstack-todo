import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  className?: string
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const variantClassName = variant === 'ghost'
    ? 'text-stone-500 hover:text-stone-900 disabled:opacity-50'
    : 'rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50'

  return (
    <button
      className={`${variantClassName} ${className}`}
      {...props}
    />
  )
}
