interface ImagePlaceholderProps {
  imageKey?: string
  alt?: string
}

// Real images — add entries here as photos are provided
const images: Record<string, string> = {
  'parking-lot':  '/images/parking-lot.jpg',
  'oboe':         '/images/oboe.jpg',
  'glamour-shots': '/images/glamour-shots.jpg',
  'alarm-clock':  '/images/alarm-clock.jpg',
  'greg':         '/images/greg.jpg',
  'iced-coffee':  '/images/iced-coffee.jpg',
  'jordan':       '/images/jordan.jpg',
  'ron':          '/images/ron.jpg',
  'mom':          '/images/mom.jpg',
}

// Placeholder labels for scenes without a real image yet
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

  const src = images[imageKey]

  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? labels[imageKey] ?? imageKey}
        className="w-full rounded-lg my-4 object-cover"
        style={{ maxHeight: '260px' }}
      />
    )
  }

  const label = labels[imageKey] ?? imageKey
  return (
    <div className="w-full aspect-video bg-[#f0efed] border border-[#dddbd8] rounded-lg flex items-center justify-center my-4">
      <span className="text-xs text-gray-400 uppercase tracking-widest">
        {alt ?? label}
      </span>
    </div>
  )
}
