import type { ProgressSegment } from '../../types/game'

interface ProgressBarProps {
  segments: ProgressSegment[]
}

const segmentStyles: Record<ProgressSegment['status'], string> = {
  completed: 'bg-[#7f1d1d] h-2',
  active:    'bg-[#b91c1c] h-3',
  skipped:   'bg-gray-400 h-1.5',
  future:    'bg-gray-200 h-1.5',
}

export default function ProgressBar({ segments }: ProgressBarProps) {
  return (
    <div className="w-full bg-[#1c1c1c] px-4 py-2 flex-shrink-0">
      <div className="max-w-lg mx-auto flex items-center gap-0.5">
        {segments.map(seg => (
          <div
            key={seg.index}
            title={seg.label}
            className={[
              'flex-1 rounded-full transition-all duration-300',
              segmentStyles[seg.status],
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  )
}
