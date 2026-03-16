interface ScreenProps {
  children: React.ReactNode
  centered?: boolean
}

export default function Screen({ children, centered = false }: ScreenProps) {
  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="bg-[#1c1c1c] text-white px-4 py-3 flex-shrink-0">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-gray-400 leading-none mb-0.5">
            Execution Church
          </p>
          <p className="text-[10px] tracking-widest uppercase text-gray-600 leading-none">
            "Make Disciples or Else"
          </p>
        </div>
      </header>

      {/* Content */}
      <main
        className={[
          'flex flex-col flex-1 w-full max-w-lg mx-auto px-4',
          centered ? 'justify-center items-center text-center' : '',
        ].join(' ')}
      >
        {children}
      </main>
    </div>
  )
}
