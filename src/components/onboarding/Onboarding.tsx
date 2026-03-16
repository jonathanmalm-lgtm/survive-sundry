import { useState } from 'react'
import type { PlayerProfile, RoleCode, Gender, MaritalStatus } from '../../types/game'
import { getIntro, personalize } from '../../content/parser'
import { analytics } from '../../engine/analytics'
import Button from '../ui/Button'

interface OnboardingProps {
  onComplete: (player: PlayerProfile) => void
}

type Step = 'welcome' | 'name' | 'role' | 'gender' | 'marital' | 'intro'

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
  const [gender, setGender] = useState<Gender | null>(null)
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus | null>(null)

  function handleComplete() {
    if (!role || !gender || !maritalStatus || !name.trim()) return
    analytics.gameStarted(role)
    onComplete({ name: name.trim(), role, gender, maritalStatus })
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
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Step 1 of 4</p>
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
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Step 2 of 4</p>
          <h2 className="text-2xl font-semibold text-[#1c1c1c]">What's your role?</h2>
          <p className="text-sm text-[#4b4b4b] mt-1">You're committed to this for the whole day.</p>
        </div>
        <div className="space-y-2">
          {ROLES.map(r => (
            <button
              key={r.code}
              onClick={() => { setRole(r.code); setStep('gender') }}
              className={[
                'w-full text-left px-4 py-3.5 rounded-lg border transition-colors duration-150',
                role === r.code
                  ? 'bg-[#1c1c1c] text-white border-[#1c1c1c]'
                  : 'bg-white text-[#1c1c1c] border-[#dddbd8] hover:border-[#1c1c1c] hover:bg-[#f0efed]',
              ].join(' ')}
            >
              <span className="block text-sm font-medium">{r.label}</span>
              <span className={[
                'block text-xs mt-0.5',
                role === r.code ? 'text-gray-300' : 'text-gray-500',
              ].join(' ')}>
                {r.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Role intro narrative ───────────────────────────────────────────────────

  if (step === 'intro') {
    const intro = role ? getIntro(role) : null
    const narrative = (intro?.narrative ?? '')
    const personalized = (role && gender && maritalStatus)
      ? personalize(narrative, name.trim(), gender, maritalStatus)
      : narrative
    return (
      <div className="flex flex-col flex-1 px-4 py-8 gap-6 max-w-lg mx-auto w-full">
        <div className="flex-1 space-y-3 text-sm leading-relaxed text-[#4b4b4b]">
          {personalized.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <Button onClick={handleComplete} fullWidth>
          That's me. Let's go.
        </Button>
      </div>
    )
  }

  // ── Gender ────────────────────────────────────────────────────────────────

  if (step === 'gender') {
    const options: { value: Gender; label: string }[] = [
      { value: 'male',   label: 'Male' },
      { value: 'female', label: 'Female' },
    ]
    return (
      <div className="flex flex-col flex-1 justify-center px-4 py-12 gap-6 max-w-lg mx-auto w-full">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Step 3 of 4</p>
          <h2 className="text-2xl font-semibold text-[#1c1c1c]">What's your gender?</h2>
        </div>
        <div className="space-y-2">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { setGender(opt.value); setStep('marital') }}
              className="w-full text-left px-4 py-3.5 rounded-lg border transition-colors duration-150 bg-white text-[#1c1c1c] border-[#dddbd8] hover:border-[#1c1c1c] hover:bg-[#f0efed]"
            >
              <span className="block text-sm font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Marital status ────────────────────────────────────────────────────────

  if (step === 'marital') {
    const options: { value: MaritalStatus; label: string; sub: string }[] = [
      { value: 'married',     label: 'Married',          sub: 'Spouse texting during service is a spiritual gift.' },
      { value: 'single',      label: 'Single',           sub: "Your mom has opinions about your career choice." },
      { value: 'complicated', label: "It's complicated", sub: 'Understood. Moving on.' },
    ]
    return (
      <div className="flex flex-col flex-1 justify-center px-4 py-12 gap-6 max-w-lg mx-auto w-full">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Step 4 of 4</p>
          <h2 className="text-2xl font-semibold text-[#1c1c1c]">Are you married?</h2>
        </div>
        <div className="space-y-2">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { setMaritalStatus(opt.value); setStep('intro') }}
              className="w-full text-left px-4 py-3.5 rounded-lg border transition-colors duration-150 bg-white text-[#1c1c1c] border-[#dddbd8] hover:border-[#1c1c1c] hover:bg-[#f0efed]"
            >
              <span className="block text-sm font-medium">{opt.label}</span>
              <span className="block text-xs mt-0.5 text-gray-500">{opt.sub}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return null
}
