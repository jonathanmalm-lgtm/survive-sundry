import { useState } from 'react'
import type { PlayerProfile, RoleCode } from '../../types/game'
import { getIntro, personalize } from '../../content/parser'
import { analytics } from '../../engine/analytics'
import Button from '../ui/Button'
import ImagePlaceholder from '../game/ImagePlaceholder'

interface OnboardingProps {
  onComplete: (player: PlayerProfile) => void
}

type Step = 'welcome' | 'name' | 'role' | 'intro'

const ROLES: { code: RoleCode; label: string; description: string }[] = [
  { code: 'WL', label: 'Worship Leader',                   description: "Your beautiful voice won't be able to save you." },
  { code: 'TL', label: 'Tech Leader',                      description: "Not enough gaff tape in the world for the day you're about to have." },
  { code: 'KM', label: 'Kids Ministry Leader',             description: 'Okay, this might actually feel like a normal Sunday.' },
  { code: 'FI', label: 'First Impressions Leader',         description: 'Your handshakes are about to get extra sweaty.' },
  { code: 'AD', label: 'Administrator',                    description: "You're busy saving the ministry, but who will save you?" },
  { code: 'CP', label: 'Campus Pastor',                    description: 'Even the joke about your smoking hot wife will bomb today.' },
  { code: 'SM', label: 'Social Media & Photography Lead',  description: "50 fire emojis won't be enough to numb the pain today." },
]

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<Step>('welcome')
  const [name, setName] = useState('')
  const [role, setRole] = useState<RoleCode | null>(null)

  function handleComplete() {
    if (!role || !name.trim()) return
    analytics.gameStarted(role)
    onComplete({ name: name.trim(), role })
  }

  // ── Welcome ───────────────────────────────────────────────────────────────

  if (step === 'welcome') {
    return (
      <div className="flex flex-col flex-1 justify-center px-6 py-10 gap-5 max-w-lg mx-auto w-full">
        <div>
          <h2 className="text-2xl font-bold text-[#1c1c1c] leading-tight mb-1">
            Greetings, brave minister.
          </h2>
          <p className="text-base font-medium text-[#4b4b4b]">
            Welcome to the most important Sunday of your life.
          </p>
        </div>
        <p className="text-sm leading-relaxed text-[#4b4b4b]">
          You're about to face the most challenging Sunday you've ever had in ministry. Will you play it safe? Will you risk it all? Every decision leads to one critical moment. It'll determine your future as a staff member at Execution Church. Will you survive?
        </p>
        <Button onClick={() => setStep('name')} fullWidth>
          Begin
        </Button>
      </div>
    )
  }

  // ── Name ──────────────────────────────────────────────────────────────────

  if (step === 'name') {
    return (
      <div className="flex flex-col flex-1 justify-center px-4 py-12 gap-6 max-w-lg mx-auto w-full">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Step 1 of 2</p>
          <h2 className="text-2xl font-semibold text-[#1c1c1c]">What's your first name?</h2>
        </div>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && name.trim() && setStep('role')}
          placeholder="Your name"
          autoFocus
          className="w-full px-4 py-3 border border-[#dddbd8] rounded-lg text-[#1c1c1c] bg-white text-base focus:outline-none focus:border-[#1c1c1c] placeholder-gray-400"
        />
        <Button
          onClick={() => setStep('role')}
          disabled={!name.trim()}
          fullWidth
        >
          Next
        </Button>
      </div>
    )
  }

  // ── Role ──────────────────────────────────────────────────────────────────

  if (step === 'role') {
    return (
      <div className="flex flex-col px-4 py-8 gap-4 max-w-lg mx-auto w-full">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Step 2 of 2</p>
          <h2 className="text-2xl font-semibold text-[#1c1c1c]">What's your role?</h2>
          <p className="text-sm text-[#4b4b4b] mt-1">You're committed to this for the whole day.</p>
        </div>
        <div className="space-y-2">
          {ROLES.map(r => (
            <button
              key={r.code}
              onClick={() => { setRole(r.code); setStep('intro') }}
              className="w-full text-left px-4 py-3.5 rounded-lg border transition-colors duration-150 bg-white text-[#1c1c1c] border-[#dddbd8] hover:border-[#1c1c1c] hover:bg-[#f0efed]"
            >
              <span className="block text-sm font-medium">{r.label}</span>
              <span className="block text-xs mt-0.5 text-gray-500">{r.description}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Role intro narrative ───────────────────────────────────────────────────

  if (step === 'intro') {
    const intro = role ? getIntro(role) : null
    const narrative = personalize(intro?.narrative ?? '', name.trim())
    return (
      <div className="flex flex-col flex-1 px-4 py-8 gap-6 max-w-lg mx-auto w-full">
        {intro?.image && <ImagePlaceholder imageKey={intro.image} />}
        <div className="flex-1 space-y-3 text-sm leading-relaxed text-[#4b4b4b]">
          {narrative.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <Button onClick={handleComplete} fullWidth>
          Let's drive.
        </Button>
      </div>
    )
  }

  return null
}
