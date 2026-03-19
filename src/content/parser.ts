import yaml from 'js-yaml'
import type {
  RoleCode,
  Scene,
  Choice,
  NuclearOutcome,
  IntroContent,
  Ending,
} from '../types/game'

// ─── Raw file loading (Vite eager glob) ───────────────────────────────────────

const sceneFiles = import.meta.glob('../content/roles/*/s*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const introFiles = import.meta.glob('../content/roles/*/intro.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const endingFiles = import.meta.glob('../content/roles/*/endings.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

// ─── Frontmatter parser ───────────────────────────────────────────────────────

interface ParsedFile {
  data: Record<string, unknown>
  body: string
}

function parseFrontmatter(raw: string): ParsedFile {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { data: {}, body: raw.trim() }
  return {
    data: (yaml.load(match[1]) as Record<string, unknown>) ?? {},
    body: match[2].trim(),
  }
}

// ─── Section parser ───────────────────────────────────────────────────────────
// The markdown body uses ## headings to delimit sections:
//   text before first heading  → narrative
//   ## A                       → outcome for choice A
//   ## B                       → outcome for choice B
//   ## D:win                   → nuclear win outcome for choice D
//   ## D:lose                  → nuclear lose outcome for choice D
//   ## Ending 1                → narrative for ending 1 (in endings.md)

function parseSections(body: string): Record<string, string> {
  const sections: Record<string, string> = {}
  const parts = body.split(/\n(?=## )/)

  // Everything before the first ## heading is the main narrative
  const firstHeadingIdx = parts[0].startsWith('## ') ? 0 : -1
  if (firstHeadingIdx === -1) {
    sections['narrative'] = parts[0].trim()
    for (let i = 1; i < parts.length; i++) {
      const lines = parts[i].split('\n')
      const key = lines[0].replace('## ', '').trim().toLowerCase()
      sections[key] = lines.slice(1).join('\n').trim()
    }
  } else {
    sections['narrative'] = ''
    for (const part of parts) {
      const lines = part.split('\n')
      const key = lines[0].replace('## ', '').trim().toLowerCase()
      sections[key] = lines.slice(1).join('\n').trim()
    }
  }

  return sections
}

// ─── Scene parser ─────────────────────────────────────────────────────────────

type RawChoice = {
  id: string
  type: string
  text: string
  ministry?: number
  relational?: number
  selfAware?: number
  split?: number
  winMinistry?: number
  winRelational?: number
  winSelfAware?: number
  loseMinistry?: number
  loseRelational?: number
  loseSelfAware?: number
  flags?: string[]
  skipToScene?: number
}

function parseScene(raw: string, sceneNumber: number): Scene {
  const { data, body } = parseFrontmatter(raw)
  const sections = parseSections(body)
  const rawChoices = (data.choices as RawChoice[]) ?? []

  const choices: Choice[] = rawChoices.map(rc => {
    const choice: Choice = {
      id: rc.id,
      type: rc.type as Choice['type'],
      text: rc.text,
    }

    if (rc.flags?.length) choice.flags = rc.flags
    if (rc.skipToScene != null) choice.skipToScene = rc.skipToScene

    if (rc.type === 'nuclear' && rc.split != null) {
      const nuclear: NuclearOutcome = {
        split: rc.split,
        winScores: {
          ministry: rc.winMinistry ?? 0,
          relational: rc.winRelational ?? 0,
          selfAware: rc.winSelfAware ?? 0,
        },
        loseScores: {
          ministry: rc.loseMinistry ?? 0,
          relational: rc.loseRelational ?? 0,
          selfAware: rc.loseSelfAware ?? 0,
        },
      }
      choice.nuclear = nuclear
    } else {
      choice.scores = {
        ministry: rc.ministry ?? 0,
        relational: rc.relational ?? 0,
        selfAware: rc.selfAware ?? 0,
      }
    }

    return choice
  })

  // Build outcomes map: { A: '...', B: '...', D:win: '...', D:lose: '...' }
  const outcomes: Record<string, string> = {}
  for (const [key, text] of Object.entries(sections)) {
    if (key === 'narrative') continue
    outcomes[key.toUpperCase().replace(':', ':')] = text
  }
  // Normalize keys: 'a' → 'A', 'd:win' → 'D:win', 'd:lose' → 'D:lose'
  const normalizedOutcomes: Record<string, string> = {}
  for (const [key, text] of Object.entries(sections)) {
    if (key === 'narrative') continue
    const parts = key.split(':')
    const normalized = parts.map((p, i) =>
      i === 0 ? p.toUpperCase() : p.toLowerCase()
    ).join(':')
    normalizedOutcomes[normalized] = text
  }

  return {
    sceneNumber,
    title: String(data.title ?? `Scene ${sceneNumber}`),
    time: data.time ? String(data.time) : undefined,
    location: data.location ? String(data.location) : undefined,
    image: data.image ? String(data.image) : undefined,
    narrative: sections['narrative'] ?? '',
    decision: String(data.decision ?? 'What do you do?'),
    choices,
    outcomes: normalizedOutcomes,
  }
}

// ─── Intro parser ─────────────────────────────────────────────────────────────

function parseIntro(raw: string): IntroContent {
  const { data, body } = parseFrontmatter(raw)
  return {
    narrative: body,
    image: data.image ? String(data.image) : undefined,
  }
}

// ─── Endings parser ───────────────────────────────────────────────────────────

type RawEnding = {
  id: number
  title: string
  condition: string
  shareText: string
  shareVariants?: string[]
}

function parseEndings(raw: string): Ending[] {
  const { data, body } = parseFrontmatter(raw)
  const sections = parseSections(body)
  const rawEndings = (data.endings as RawEnding[]) ?? []

  return rawEndings.map(re => ({
    id: re.id,
    title: re.title,
    condition: re.condition,
    narrative: sections[`ending ${re.id}`] ?? sections[`ending${re.id}`] ?? '',
    shareText: re.shareText,
    shareVariants: re.shareVariants ?? [],
  }))
}

// ─── Public API ───────────────────────────────────────────────────────────────

function fileKey(role: RoleCode, filename: string): string {
  return `./roles/${role}/${filename}`
}

export function getIntro(role: RoleCode): IntroContent | null {
  const raw = introFiles[fileKey(role, 'intro.md')]
  return raw ? parseIntro(raw) : null
}

export function getScene(role: RoleCode, sceneNumber: number): Scene | null {
  const pad = String(sceneNumber).padStart(2, '0')
  const raw = sceneFiles[fileKey(role, `s${pad}.md`)]
  return raw ? parseScene(raw, sceneNumber) : null
}

export function getEndings(role: RoleCode): Ending[] {
  const raw = endingFiles[fileKey(role, 'endings.md')]
  return raw ? parseEndings(raw) : []
}

export function getAllScenes(role: RoleCode): Scene[] {
  const scenes: Scene[] = []
  for (let i = 1; i <= 12; i++) {
    const scene = getScene(role, i)
    if (scene) scenes.push(scene)
  }
  return scenes
}

export function personalize(text: string, name: string): string {
  return text
    .replace(/\{name\}/g, name)
    .replace(/\{first name\}/g, name)
}

// ─── Ending variant helpers ───────────────────────────────────────────────────

// Returns all non-numbered, non-narrative sections from endings.md as a map.
// Keys like 'blippicoin win', 'blippicoin lose', 'meme account'.
export function getEndingVariants(role: RoleCode): Record<string, string> {
  const raw = endingFiles[fileKey(role, 'endings.md')]
  if (!raw) return {}
  const { body } = parseFrontmatter(raw)
  const sections = parseSections(body)
  const variants: Record<string, string> = {}
  for (const [key, text] of Object.entries(sections)) {
    if (key === 'narrative') continue
    if (/^ending \d+$/.test(key)) continue
    variants[key] = text
  }
  return variants
}

// Returns the setup intro text shown before every meeting.
// Hard-coded — same for all roles.
export function getMeetingSetup(): string {
  return "One month later, you're standing outside your pastor's office. He called a one-on-one meeting with you. It sounded important.\n\nYou stare at the door. Taped below his name is a quote: 'Obstacles do not exist to be surrendered to, but only to be broken.' You aren’t sure who it’s by."
}
