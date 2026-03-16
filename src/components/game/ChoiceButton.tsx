interface ChoiceButtonProps {
  text: string
  onClick: () => void
  disabled?: boolean
  selected?: boolean
}

export default function ChoiceButton({
  text,
  onClick,
  disabled = false,
  selected = false,
}: ChoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'w-full text-left px-4 py-3.5 rounded-lg border text-sm leading-snug',
        'transition-colors duration-150',
        'focus-visible:outline-2 focus-visible:outline-[#b91c1c] focus-visible:outline-offset-2',
        selected
          ? 'bg-[#1c1c1c] text-white border-[#1c1c1c]'
          : disabled
          ? 'bg-white text-gray-400 border-[#dddbd8] cursor-not-allowed'
          : 'bg-white text-[#1c1c1c] border-[#dddbd8] hover:border-[#1c1c1c] hover:bg-[#f0efed] cursor-pointer',
      ].join(' ')}
    >
      {text}
    </button>
  )
}
