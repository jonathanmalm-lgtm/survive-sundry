import { useState } from 'react'
import type { PlayerProfile, RoleCode } from '../../types/game'
import { getIntro, personalize } from '../../content/parser'
import { analytics } from '../../engine/analytics'
import Button from '../ui/Button'

interface OnboardingProps {
  onComplete: (player: PlayerProfile) => void
}

type Step = 'welcome' | 'name' | 'role' | 'intro'

const ROLES: { code: RoleCode; label: string; description: string }[] = [
  { code: 'WL', label: 'Worship Leader',                   description: 'Full band. Production-heavy. Five Elevation songs.' },
  { code: 'TL', label: 'Tech Leader',                      description: 'Audio, lighting, streaming, ProPresenter. Simultaneously.' },
  { code: 'KM', label: 'Kids Ministry Leader',             description: 'Babies through 5th grade. Jackson is coming back.' },
  { code: 'FI', label: 'First Impressions Leader',         description: 'Parking, greeters, welcome, ushers. The door is everything.' },
  { code: 'AD', label: 'Administrator',                    description: "Facility, volunteer database, pastor's calendar." },
  { code: 'CP', label: 'Campus Pastor',                    description: 'You only preach when the livestream goes down.' },
  { code: 'SM', label: 'Social Media & Photography Lead',  description: "Capture the moment. Don't miss the moment." },
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
      <div className="flex flex-col flex-1 justify-center items-center text-center px-4 py-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-[#1c1c1c] tracking-tight leading-none mb-2">
            Survive Sunday
          </h1>
          <p className="text-[#4b4b4b] text-sm">This Sunday could make or break everything.</p>
        </div>
        <p className="text-xs text-gray-500 max-w-xs">
          A choose-your-own-adventure for church staff. Your choices are hidden from the congregation. Your scores are hidden from you.
        </p>
        <Button onClick={() => setStep('name')} className="px-8">
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
          className="w-full px-4 py-3 border border-[#dddbd8] rounded-lg text-[#1c1c1c] bg-white text-sm focus:outline-none focus:border-[#1c1c1c] placeholder-gray-400"
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
        <div className="flex-1 space-y-3 text-sm leading-relaxed text-[#4b4b4b]">
          {narrative.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <Button onClick={handleComplete} fullWidth>
          That's me. Let's go.
        </Button>
      </div>
    )
  }

  return null
}
