interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  fullWidth?: boolean
  children: React.ReactNode
}

const variants = {
  primary: 'bg-[#1c1c1c] text-white hover:bg-[#333] active:bg-[#111]',
  outline: 'bg-white text-[#1c1c1c] border border-[#dddbd8] hover:border-[#1c1c1c] hover:bg-[#f0efed] active:bg-[#e8e7e4]',
  ghost:   'text-[#4b4b4b] hover:text-[#1c1c1c] hover:bg-[#f0efed]',
}

export default function Button({
  variant = 'primary',
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'px-5 py-3 rounded-lg text-sm font-medium transition-colors duration-150',
        'focus-visible:outline-2 focus-visible:outline-[#b91c1c] focus-visible:outline-offset-2',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variants[variant],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
