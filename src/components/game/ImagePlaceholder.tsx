interface ImagePlaceholderProps {
  imageKey?: string
  alt?: string
}

// Placeholder labels while real images are produced
const labels: Record<string, string> = {
  'parking-lot':    'Parking Lot',
  'green-room':     'Green Room',
  'stage':          'Stage',
  'lobby':          'Lobby',
  'auditorium':     'Auditorium',
  'booth':          'Tech Booth',
  'hallway':        'Hallway',
  'kids-wing':      'Kids Wing',
  'pastors-office': "Pastor's Office",
}

export default function ImagePlaceholder({ imageKey, alt }: ImagePlaceholderProps) {
  if (!imageKey) return null

  const label = labels[imageKey] ?? imageKey

  return (
    <div className="w-full aspect-video bg-[#f0efed] border border-[#dddbd8] rounded-lg flex items-center justify-center my-4">
      <span className="text-xs text-gray-400 uppercase tracking-widest">
        {alt ?? label}
      </span>
    </div>
  )
}
