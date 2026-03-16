// ─── Text helpers ─────────────────────────────────────────────────────────────

function wrapToLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

function fitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
  startSize: number,
  minSize: number,
): number {
  let size = startSize
  while (size >= minSize) {
    ctx.font = `bold ${size}px system-ui, -apple-system, sans-serif`
    if (wrapToLines(ctx, text, maxWidth).length <= maxLines) return size
    size -= 4
  }
  return minSize
}

// ─── Generator ────────────────────────────────────────────────────────────────

export interface ShareImageOptions {
  shareText: string
  playerName?: string
  url?: string
}

export async function generateShareImage({
  shareText,
  playerName,
  url = 'execution.jonathanmalm.com',
}: ShareImageOptions): Promise<HTMLCanvasElement> {
  await document.fonts.ready

  const S = 1080
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')!

  // ── Background ────────────────────────────────────────────────────────────
  ctx.fillStyle = '#1c1c1c'
  ctx.fillRect(0, 0, S, S)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  // ── Top branding ──────────────────────────────────────────────────────────
  ctx.fillStyle = '#9ca3af'
  ctx.font = '600 38px system-ui, -apple-system, sans-serif'
  ctx.fillText('EXECUTION CHURCH', S / 2, 110)

  ctx.fillStyle = '#6b7280'
  ctx.font = '400 24px system-ui, -apple-system, sans-serif'
  ctx.fillText('"Make Disciples or Else"', S / 2, 158)

  // Red accent bar
  const barW = 120
  ctx.fillStyle = '#b91c1c'
  ctx.fillRect((S - barW) / 2, 186, barW, 4)

  // ── Main result text ──────────────────────────────────────────────────────
  const maxTextWidth = 900
  const fontSize = fitFontSize(ctx, shareText, maxTextWidth, 4, 84, 48)
  ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`
  const lines = wrapToLines(ctx, shareText, maxTextWidth)
  const lineHeight = fontSize * 1.22

  const midTop = 210
  const midBottom = playerName ? 790 : 840
  const midCenter = (midTop + midBottom) / 2
  const blockH = lines.length * lineHeight
  const startY = midCenter - blockH / 2 + fontSize * 0.38

  ctx.fillStyle = '#ffffff'
  lines.forEach((l, i) => ctx.fillText(l, S / 2, startY + i * lineHeight))

  // ── Optional player name ──────────────────────────────────────────────────
  if (playerName) {
    ctx.fillStyle = '#9ca3af'
    ctx.font = '400 30px system-ui, -apple-system, sans-serif'
    ctx.fillText(playerName, S / 2, midBottom + 44)
  }

  // ── Bottom rule ───────────────────────────────────────────────────────────
  ctx.fillStyle = '#2e2e2e'
  ctx.fillRect(80, S - 190, S - 160, 1)

  // ── Bottom CTA ────────────────────────────────────────────────────────────
  ctx.fillStyle = '#6b7280'
  ctx.font = '400 26px system-ui, -apple-system, sans-serif'
  ctx.fillText('Can you survive Sunday?', S / 2, S - 120)

  ctx.fillStyle = '#4b4b4b'
  ctx.font = '400 22px system-ui, -apple-system, sans-serif'
  ctx.fillText(url, S / 2, S - 74)

  return canvas
}

// ─── Share / download helpers ─────────────────────────────────────────────────

export function downloadCanvas(canvas: HTMLCanvasElement, filename = 'survive-sunday.png') {
  const a = document.createElement('a')
  a.download = filename
  a.href = canvas.toDataURL('image/png')
  a.click()
}

export async function shareCanvas(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(b => (b ? resolve(b) : reject()), 'image/png'),
    )
    const file = new File([blob], 'survive-sunday.png', { type: 'image/png' })
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'Survive Sunday',
        url: 'https://execution.jonathanmalm.com',
      })
      return true
    }
  } catch {
    // Cancelled or unsupported — fall through
  }
  return false
}
