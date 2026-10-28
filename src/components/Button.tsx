import type { ButtonHTMLAttributes } from "react";

const variants = {
  primary: 'bg-accent text-[#1a1400] hover:brightness-110',
  ghost:
    'border border-border bg-transparent text-text-muted hover:border-text-faint hover:text-text',
} as const

type Variant = keyof typeof variants

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export default function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`cursor-pointer rounded-sm px-4.5 py-2.5 font-sans text-[13.5px] font-semibold active:scale-[0.97] disabled:cursor-default disabled:opacity-50 ${variants[variant]} ${className}`}
      {...rest}
    />
  )
}