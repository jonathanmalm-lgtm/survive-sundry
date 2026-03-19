import { useState, useEffect, useRef } from 'react'
import type { GameState } from '../../types/game'
import { getEndings } from '../../content/parser'
import { generateShareImage, downloadCanvas, shareCanvas } from '../../engine/shareImage'
import { analytics } from '../../engine/analytics'
import Button from '../ui/Button'

interface ResultScreenProps {
  state: GameState
  onRestart: () => void
}

// BlippiCoin special share texts (per PRD)
const BLIPPI_WIN_TEXT  = 'I INVESTED IN BLIPPICOIN DURING THE SERMON. IT WORKED.'
const BLIPPI_LOSE_TEXT = 'I INVESTED IN BLIPPICOIN DURING THE SERMON.'

export default function ResultScreen({ state, onRestart }: ResultScreenProps) {
  const { player, endingId, specialVariants = [] } = state

  const endings       = getEndings(player.role)
  const ending        = endings.find(e => e.id === endingId)

  const isBlippiWin   = specialVariants.includes('blippicoin_win')
  const isBlippiLose  = specialVariants.includes('blippicoin_lose')

  // Pick share text once — BlippiCoin variants override the ending shareText
  const [shareText] = useState<string>(() => {
    if (isBlippiWin)  return BLIPPI_WIN_TEXT
    if (isBlippiLose) return BLIPPI_LOSE_TEXT
    if (!ending) return ''
    const pool = ending.shareVariants?.length ? ending.shareVariants : [ending.shareText]
    return pool[Math.floor(Math.random() * pool.length)]
  })

  const canvasRef          = useRef<HTMLCanvasElement | null>(null)
  const [imageUrl, setImageUrl]   = useState<string | null>(null)
  const [copied, setCopied]       = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  // Re-generate image when name toggle changes
  useEffect(() => {
    if (!shareText) return
    generateShareImage({ shareText }).then(canvas => {
      canvasRef.current = canvas
      setImageUrl(canvas.toDataURL('image/png'))
    })
  }, [shareText])

  // Track ending once
  useEffect(() => {
    if (endingId) {
      analytics.meetingReached(player.role, endingId, specialVariants)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleShare() {
    if (!canvasRef.current || !endingId) return
    setIsSharing(true)
    const shared = await shareCanvas(canvasRef.current)
    if (shared) {
      analytics.imageShared('webshare', endingId, player.role)
    } else {
      // Web Share not available — fall back to download
      downloadCanvas(canvasRef.current)
      analytics.imageShared('download', endingId, player.role)
    }
    setIsSharing(false)
  }

  function handleDownload() {
    if (!canvasRef.current || !endingId) return
    downloadCanvas(canvasRef.current)
    analytics.imageShared('download', endingId, player.role)
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText('https://execution.jonathanmalm.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    if (endingId) analytics.imageShared('copylink', endingId, player.role)
  }

  const replayLine = isBlippiWin
    ? 'You invested in BlippiCoin during a sermon and it worked. Ready to see what else can go wrong?'
    : 'Seven roles. One Sunday. Different choices, different ending.'

  return (
    <div className="flex flex-col px-4 py-6 gap-5 max-w-lg mx-auto w-full">

      {/* Ending title */}
      {ending && (
        <div className="text-center pt-2">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
            Your result
          </p>
          <h2 className="text-xl font-semibold text-[#1c1c1c] leading-snug">
            {ending.title}
          </h2>
        </div>
      )}

      {/* Shareable image preview */}
      <div className="rounded-lg overflow-hidden border border-[#dddbd8] bg-[#1c1c1c]">
        {imageUrl ? (
          <img src={imageUrl} alt="Your result card" className="w-full block" />
        ) : (
          <div className="aspect-square flex items-center justify-center">
            <span className="text-xs text-gray-500">Generating image…</span>
          </div>
        )}
      </div>

      {/* Share buttons */}
      <div className="space-y-2">
        <Button onClick={handleShare} disabled={!imageUrl || isSharing} fullWidth>
          {isSharing ? 'Sharing…' : 'Share result'}
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={handleDownload} disabled={!imageUrl}>
            Download PNG
          </Button>
          <Button variant="outline" onClick={handleCopyLink}>
            {copied ? 'Copied!' : 'Copy link'}
          </Button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#dddbd8]" />

      {/* Replay */}
      <div className="text-center pb-4">
        <p className="text-xs text-gray-400 mb-3">{replayLine}</p>
        <Button variant="ghost" onClick={onRestart}>
          Play again as a different role
        </Button>
      </div>

    </div>
  )
}
